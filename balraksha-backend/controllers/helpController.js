const { HelpRequest, SupportMessage, User } = require("../models");

// CREATE HELP REQUEST

const createHelpRequest = async (req, res) => {
  try {
    const { subject, priority, anonymous } = req.body;

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    const helpRequest = await HelpRequest.create({
      userId: anonymous ? null : req.user ? req.user.id : null,

      subject,

      priority: priority || "MEDIUM",

      anonymous: anonymous || false,

      status: "OPEN",
    });

    return res.status(201).json({
      success: true,
      message: "Help request created",
      helpRequest,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create help request",
    });
  }
};

// GET ALL HELP REQUESTS

const getHelpRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch help requests",
    });
  }
};

// GET SINGLE REQUEST

const getHelpRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await HelpRequest.findByPk(id, {
      include: [
        {
          model: SupportMessage,
          as: "messages",
          order: [["createdAt", "ASC"]],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    return res.json({
      success: true,
      request,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch help request",
    });
  }
};

// UPDATE STATUS

const updateHelpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "OPEN",
      "ASSIGNED",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const request = await HelpRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Help request not found",
      });
    }

    request.status = status;

    await request.save();

    return res.json({
      success: true,
      message: "Help request updated",
      request,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update help request",
    });
  }
};

// GET MESSAGES

const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const messages = await SupportMessage.findAll({
      where: {
        helpRequestId: id,
      },
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

module.exports = {
  createHelpRequest,
  getHelpRequests,
  getHelpRequestById,
  updateHelpStatus,
  getMessages,
};
