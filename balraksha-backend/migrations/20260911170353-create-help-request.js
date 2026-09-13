"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HelpRequests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      priority: {
        type: Sequelize.ENUM("LOW", "MEDIUM", "HIGH", "URGENT"),
        allowNull: false,
        defaultValue: "MEDIUM",
      },

      status: {
        type: Sequelize.ENUM(
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
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("HelpRequests");
  },
};
