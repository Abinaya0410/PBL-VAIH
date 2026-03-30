const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

const {
  createModuleQuestion,
  getModuleQuestions,
} = require("../controllers/moduleQuestionController");

// Teacher creates quiz-only questions
router.post(
  "/lessons/:lessonId/module-questions",
  authMiddleware,
  isTeacher,
  createModuleQuestion
);

// Teacher views own module questions
router.get(
  "/lessons/:lessonId/module-questions",
  authMiddleware,
  isTeacher,
  getModuleQuestions
);

module.exports = router;
