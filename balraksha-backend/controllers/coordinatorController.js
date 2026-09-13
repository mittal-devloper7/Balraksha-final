const { Report, RiskEvent, Evidence, User } = require("../models");
const { Op } = require("sequelize");

// DASHBOARD SUMMARY

const getDashboard = async (req, res) => {
  try {
    const totalReports = await Report.count();

    const openReports = await Report.count({
      where: {
        status: "OPEN",
      },
    });

    const underReview = await Report.count({
      where: {
        status: "UNDER_REVIEW",
      },
    });

    const escalated = await Report.count({
      where: {
        status: "ESCALATED",
      },
    });

    const criticalReports = await Report.count({
      where: {
        riskLevel: { [Op.in]: ["HIGH", "CRITICAL"] },
      },
    });

    return res.json({
      success: true,
      dashboard: {
        totalReports,
        openReports,
        underReview,
        escalated,
        criticalReports,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load coordinator dashboard",
    });
  }
};

// HIGH PRIORITY CASES

const getHighPriorityCases = async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: {
        riskLevel: ["HIGH", "CRITICAL"],
      },
      include: [
        {
          model: RiskEvent,
          as: "riskEvents",
        },
        {
          model: Evidence,
          as: "evidence",
        },
      ],
      order: [
        ["riskScore", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    return res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("High priority error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch high priority cases",
    });
  }
};

module.exports = {
  getDashboard,
  getHighPriorityCases,
};
