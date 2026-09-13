const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class HelpRequest extends Model {
    static associate(models) {
      HelpRequest.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      HelpRequest.hasMany(models.SupportMessage, {
        foreignKey: "helpRequestId",
        as: "messages",
      });
    }
  }

  HelpRequest.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      priority: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "URGENT"),
        allowNull: false,
        defaultValue: "MEDIUM",
      },

      status: {
        type: DataTypes.ENUM(
          "OPEN",
          "ASSIGNED",
          "IN_PROGRESS",
          "RESOLVED",
          "CLOSED",
        ),
        allowNull: false,
        defaultValue: "OPEN",
      },

      anonymous: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "HelpRequest",
      tableName: "HelpRequests",
    },
  );

  return HelpRequest;
};
