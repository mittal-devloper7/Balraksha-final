const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RiskEvent extends Model {
    static associate(models) {
      RiskEvent.belongsTo(models.Report, {
        foreignKey: "reportId",
        as: "report",
      });
    }
  }

  RiskEvent.init(
    {
      reportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      signal: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "RiskEvent",
      tableName: "RiskEvents",
    },
  );

  return RiskEvent;
};
