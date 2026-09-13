const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  },
);

const User = require("./user")(sequelize, DataTypes);
const Report = require("./report")(sequelize, DataTypes);
const RiskEvent = require("./riskevent")(sequelize, DataTypes);
const Evidence = require("./evidence")(sequelize, DataTypes);
const HelpRequest = require("./helpRequest")(sequelize, DataTypes);
const SupportMessage = require("./supportMessage")(sequelize, DataTypes);

const db = {
  sequelize,
  Sequelize,
  User,
  Report,
  RiskEvent,
  Evidence,
  HelpRequest,
  SupportMessage,
};

// Set up relationships
User.associate(db);
Report.associate(db);
RiskEvent.associate(db);
Evidence.associate(db);
HelpRequest.associate(db);
SupportMessage.associate(db);

module.exports = db;
