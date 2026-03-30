const express = require("express");
const router = express.Router();

const {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const authMiddleware = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");
const upload = require("../middleware/lessonUploadMiddleware");

// =======================
// Teacher routes
// =======================
router.post(
  "/courses/:courseId/lessons",
  authMiddleware,
  isTeacher,
  upload.single("pdf"),
  createLesson
);

router.put(
  "/lessons/:lessonId",
  authMiddleware,
  isTeacher,
  upload.single("pdf"),
  updateLesson
);

router.delete(
  "/lessons/:lessonId",
  authMiddleware,
  isTeacher,
  deleteLesson
);

// =======================
// Student / Teacher route
// =======================
router.get(
  "/courses/:courseId/lessons",
  authMiddleware,
  getLessonsByCourse
);
// Get single lesson details (Teacher + Student)
router.get(
  "/lessons/:lessonId",
  authMiddleware,
  async (req, res) => {
    try {
      const Lesson = require("../models/Lesson");

      const lesson = await Lesson.findById(req.params.lessonId);

      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      res.json(lesson);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ✅ THIS LINE IS CRITICAL
module.exports = router;
