const http = require("http");

const app = require("./app");

const { sequelize, SupportMessage } = require("./models");

const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("MySQL database connected successfully");

    const server = http.createServer(app);

    const socketOrigins = [
      process.env.FRONTEND_ORIGIN || "http://localhost:5173",
      process.env.EXTENSION_ORIGIN,
    ]
      .filter(Boolean)
      .join(",")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    const io = new Server(server, {
      cors: {
        origin: socketOrigins,
        credentials: true,
      },
    });

    // A help request may be anonymous, but an authenticated sender must never
    // be able to impersonate another user by supplying an arbitrary senderId.
    io.use((socket, next) => {
      const token = socket.handshake.auth?.token;
      if (!token) {
        socket.user = null;
        return next();
      }

      try {
        socket.user = jwt.verify(token, process.env.JWT_SECRET);
        return next();
      } catch (error) {
        return next(new Error("Invalid or expired token"));
      }
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join-help", (helpRequestId) => {
        socket.join(`help-${helpRequestId}`);

        console.log(`Joined help-${helpRequestId}`);
      });

      socket.on("send-message", async (data) => {
        try {
          const savedMessage = await SupportMessage.create({
            helpRequestId: data.helpRequestId,

            senderId: socket.user?.id || null,

            message: data.message,
          });

          io.to(`help-${data.helpRequestId}`).emit("new-message", savedMessage);
        } catch (error) {
          console.error("Message save error:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`BalRaksha server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to MySQL:", error.message);
  }
};

startServer();
