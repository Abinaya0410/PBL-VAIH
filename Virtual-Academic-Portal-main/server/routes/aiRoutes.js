const express = require("express");
const router = express.Router();
const { chat, summarizeQuiz, summarizePDF, generateQuestions } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

// FEATURE 1: General Chat
router.post("/chat", authMiddleware, chat);

// FEATURE 2: Quiz Summary (POST requested)
router.post("/quiz-summary", authMiddleware, summarizeQuiz);

// FEATURE 3: PDF Summary (POST requested)
router.post("/pdf-summary", authMiddleware, summarizePDF);

// FEATURE 4: AI Question Generator
router.post("/generate-questions", authMiddleware, isTeacher, generateQuestions);

module.exports = router;
