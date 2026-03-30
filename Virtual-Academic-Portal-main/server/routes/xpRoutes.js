const express = require("express");
const router = express.Router();
const { getStudentXP } = require("../controllers/xpController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/xp/student — Get student XP (requires authentication)
router.get("/student", authMiddleware, getStudentXP);

module.exports = router;
