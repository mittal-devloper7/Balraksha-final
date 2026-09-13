"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reports", {
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

      riskScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      riskLevel: {
        type: Sequelize.ENUM("LOW", "MEDIUM", "HIGH", "CRITICAL"),
        allowNull: false,
        defaultValue: "LOW",
      },

      category: {
        type: Sequelize.ENUM(
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
        type: Sequelize.TEXT,
        allowNull: true,
      },

      anonymous: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      status: {
        type: Sequelize.ENUM(
          "OPEN",
          "UNDER_REVIEW",
          "IN_PROGRESS",
          "RESOLVED",
          "ESCALATED",
        ),
        allowNull: false,
        defaultValue: "OPEN",
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
    await queryInterface.dropTable("Reports");
  },
};
