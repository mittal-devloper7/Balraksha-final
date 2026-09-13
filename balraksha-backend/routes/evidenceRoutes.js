const express = require("express");

const {
  uploadEvidence,
  getEvidence,
} = require("../controllers/evidenceController");

const upload = require("../middleware/uploadMiddleware");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Upload and read evidence only through an authenticated, authorized report.
router.post("/:id", protect, upload.single("evidence"), uploadEvidence);

router.get("/:id", protect, getEvidence);

module.exports = router;
