const express = require("express");
const router = express.Router();

const {
  sendFeedback,
  getStudentFeedback,
  getCourseFeedbackForTeacher
} = require("../controllers/feedbackController");

const authMiddleware = require("../middleware/authMiddleware");
const { isTeacher, isStudent } = require("../middleware/roleMiddleware");

// Teacher sends feedback
router.post("/", authMiddleware, isTeacher, sendFeedback);

// Student views their feedback
router.get("/student", authMiddleware, isStudent, getStudentFeedback);

// Teacher views feedback for a course
router.get("/course/:courseId", authMiddleware, isTeacher, getCourseFeedbackForTeacher);

module.exports = router;
