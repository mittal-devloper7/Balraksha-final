const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      Report.hasMany(models.Evidence, {
        foreignKey: "reportId",
        as: "evidence",
      });

      Report.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Report.hasMany(models.RiskEvent, {
        foreignKey: "reportId",
        as: "riskEvents",
      });
    }
  }

  Report.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      riskScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      riskLevel: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "CRITICAL"),
        allowNull: false,
        defaultValue: "LOW",
      },

      category: {
        type: DataTypes.ENUM(
          "GROOMING",
          "BULLYING",
          "HARASSMENT",
          "THREAT",
          "SEXUAL_CONTENT",
          "PERSONAL_INFORMATION_REQUEST",
          "SELF_HARM",
          "OTHER",
        ),
        allowNull: false,
        defaultValue: "OTHER",
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      anonymous: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      status: {
        type: DataTypes.ENUM(
          "OPEN",
          "UNDER_REVIEW",
          "IN_PROGRESS",
          "RESOLVED",
          "ESCALATED",
        ),
        allowNull: false,
        defaultValue: "OPEN",
      },
    },
    {
      sequelize,
      modelName: "Report",
      tableName: "Reports",
    },
  );

  return Report;
};
