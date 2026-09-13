const { Report, RiskEvent, Evidence } = require("../models");

const isCoordinator = (user) =>
  user?.role === "COORDINATOR" || user?.role === "ADMIN";

const accessibleReportWhere = (user) =>
  isCoordinator(user) ? {} : { userId: user.id };

// CREATE REPORT
const createReport = async (req, res) => {
  try {
    const { riskScore, riskLevel, category, description, anonymous } = req.body;

    // Basic validation
    if (riskScore === undefined || !riskLevel || !category) {
      return res.status(400).json({
        success: false,
        message: "riskScore, riskLevel and category are required",
      });
    }

    // Validate risk score
    if (riskScore < 0 || riskScore > 100) {
      return res.status(400).json({
        success: false,
        message: "Risk score must be between 0 and 100",
      });
    }

    // Keep an internal owner for authorization. Anonymous controls disclosure,
    // not whether the reporter can later access their own report.
    const userId = req.user.id;

    const report = await Report.create({
      userId,
      riskScore,
      riskLevel,
      category,
      description: description || null,
      anonymous: anonymous || false,
      status: "OPEN",
    });

    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    console.error("Create report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create report",
    });
  }
};

// GET ALL REPORTS
const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: accessibleReportWhere(req.user),
      include: [
        {
          model: RiskEvent,
          as: "riskEvents",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};

// GET SINGLE REPORT
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findOne({
      where: { id, ...accessibleReportWhere(req.user) },
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
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Get report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report",
    });
  }
};

// UPDATE REPORT STATUS
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "OPEN",
      "UNDER_REVIEW",
      "IN_PROGRESS",
      "RESOLVED",
      "ESCALATED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status",
      });
    }

    const report = await Report.findOne({
      where: { id, ...accessibleReportWhere(req.user) },
    });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = status;

    await report.save();

    return res.json({
      success: true,
      message: "Report status updated",
      report,
    });
  } catch (error) {
    console.error("Update status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update report status",
    });
  }
};

// ADD RISK EVENT
const addRiskEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { signal, description, weight } = req.body;

    if (!signal) {
      return res.status(400).json({
        success: false,
        message: "Signal is required",
      });
    }

    const report = await Report.findOne({
      where: { id, ...accessibleReportWhere(req.user) },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const riskEvent = await RiskEvent.create({
      reportId: id,
      signal,
      description: description || null,
      weight: weight || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Risk event added",
      riskEvent,
    });
  } catch (error) {
    console.error("Add risk event error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add risk event",
    });
  }
};

// GET RISK EVENTS
const getRiskEvents = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findOne({
      where: { id, ...accessibleReportWhere(req.user) },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const riskEvents = await RiskEvent.findAll({
      where: {
        reportId: id,
      },
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      success: true,
      count: riskEvents.length,
      riskEvents,
    });
  } catch (error) {
    console.error("Get risk events error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch risk events",
    });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  addRiskEvent,
  getRiskEvents,
};
