const express = require("express");

const {
  getDashboard,
  getHighPriorityCases,
} = require("../controllers/coordinatorController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Dashboard
router.get(
  "/dashboard",
  protect,
  authorize("COORDINATOR", "ADMIN"),
  getDashboard,
);

// High priority cases
router.get(
  "/high-priority",
  protect,
  authorize("COORDINATOR", "ADMIN"),
  getHighPriorityCases,
);

module.exports = router;
