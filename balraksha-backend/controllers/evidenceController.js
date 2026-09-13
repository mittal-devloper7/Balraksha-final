const { Report, Evidence } = require("../models");

const accessibleReportWhere = (user) =>
  user?.role === "COORDINATOR" || user?.role === "ADMIN" ? {} : { userId: user.id };

const uploadEvidence = async (req, res) => {
  try {
    const { id } = req.params;

    // Check whether report exists
    const report = await Report.findOne({
      where: { id, ...accessibleReportWhere(req.user) },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Check whether file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No evidence file uploaded",
      });
    }

    const evidence = await Evidence.create({
      reportId: id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });

    return res.status(201).json({
      success: true,
      message: "Evidence uploaded successfully",
      evidence,
    });
  } catch (error) {
    console.error("Evidence upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload evidence",
    });
  }
};

// GET EVIDENCE FOR REPORT

const getEvidence = async (req, res) => {
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

    const evidence = await Evidence.findAll({
      where: {
        reportId: id,
      },
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      success: true,
      count: evidence.length,
      evidence,
    });
  } catch (error) {
    console.error("Get evidence error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch evidence",
    });
  }
};

module.exports = {
  uploadEvidence,
  getEvidence,
};
