const express = require("express");

const {
  createHelpRequest,
  getHelpRequests,
  getHelpRequestById,
  updateHelpStatus,
  getMessages,
} = require("../controllers/helpController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Child / guest can request help
router.post("/", createHelpRequest);

// Coordinator/Admin only
router.get("/", protect, authorize("COORDINATOR", "ADMIN"), getHelpRequests);

// Coordinator/Admin only
router.get(
  "/:id",
  protect,
  authorize("COORDINATOR", "ADMIN"),
  getHelpRequestById,
);

// Coordinator/Admin only
router.patch(
  "/:id/status",
  protect,
  authorize("COORDINATOR", "ADMIN"),
  updateHelpStatus,
);

// Coordinator/Admin only
router.get(
  "/:id/messages",
  protect,
  authorize("COORDINATOR", "ADMIN"),
  getMessages,
);

module.exports = router;
