const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SupportMessage extends Model {
    static associate(models) {
      SupportMessage.belongsTo(models.HelpRequest, {
        foreignKey: "helpRequestId",
        as: "helpRequest",
      });

      SupportMessage.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
      });
    }
  }

  SupportMessage.init(
    {
      helpRequestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      senderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SupportMessage",
      tableName: "SupportMessages",
    },
  );

  return SupportMessage;
};
