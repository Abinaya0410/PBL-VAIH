const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { isStudent } = require("../middleware/roleMiddleware");

const {
  completeLesson,
  getLessonProgress,
} = require("../controllers/lessonProgressController");

// Student marks lesson completed
router.post(
  "/lessons/:lessonId/complete",
  authMiddleware,
  isStudent,
  completeLesson
);

// Student checks progress
router.get(
  "/lessons/:lessonId/progress",
  authMiddleware,
  isStudent,
  getLessonProgress
);

module.exports = router;
