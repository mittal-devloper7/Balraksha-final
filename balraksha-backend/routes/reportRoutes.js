const { body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");
const { reportLimiter } = require("../middleware/rateLimitMiddleware");
const express = require("express");

const {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  addRiskEvent,
  getRiskEvents,
} = require("../controllers/reportController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Create report
router.post(
  "/",
  protect,
  reportLimiter,
  [
    body("riskScore")
      .isInt({ min: 0, max: 100 })
      .withMessage("Risk score must be between 0 and 100"),

    body("riskLevel")
      .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
      .withMessage("Invalid risk level"),

    body("category")
      .isIn([
        "GROOMING",
        "BULLYING",
        "HARASSMENT",
        "THREAT",
        "SEXUAL_CONTENT",
        "PERSONAL_INFORMATION_REQUEST",
        "SELF_HARM",
        "OTHER",
      ])
      .withMessage("Invalid category"),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage("Description is too long"),

    body("anonymous")
      .optional()
      .isBoolean()
      .withMessage("Anonymous must be true or false"),
  ],
  validate,
  createReport,
);

// Every signed-in user may read only reports they are authorized to view.
router.get("/", protect, getReports);

// Every signed-in user may read only reports they are authorized to view.
router.get("/:id", protect, getReportById);

// Coordinator/Admin only
router.patch(
  "/:id/status",
  protect,
  authorize("COORDINATOR", "ADMIN"),
  updateReportStatus,
);

// Coordinator/Admin only
router.post(
  "/:id/risk-events",
  protect,
  authorize("COORDINATOR", "ADMIN"),
  addRiskEvent,
);

router.get("/:id/risk-events", protect, getRiskEvents);

module.exports = router;
