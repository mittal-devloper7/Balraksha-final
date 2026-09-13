const express = require("express");

const { analyzeThreatRequest } = require("../controllers/threatController");

const { threatLimiter } = require("../middleware/rateLimitMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze", protect, threatLimiter, analyzeThreatRequest);

module.exports = router;
