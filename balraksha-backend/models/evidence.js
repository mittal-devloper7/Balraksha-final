const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Evidence extends Model {
    static associate(models) {
      Evidence.belongsTo(models.Report, {
        foreignKey: "reportId",
        as: "report",
      });
    }
  }

  Evidence.init(
    {
      reportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      fileType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Evidence",
      tableName: "Evidence",
    },
  );

  return Evidence;
};
