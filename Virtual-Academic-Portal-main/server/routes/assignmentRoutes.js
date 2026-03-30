

const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getCourseAssignments,
  submitAssignment,
  getSubmissions,
  gradeSubmission,
  checkQuizUnlock,
  deleteAssignment,
  getAssignment,
  updateAssignment,
  getPendingSubmissionsCount,
  getTeacherAllSubmissions,
  getTeacherQuizAttempts
} = require("../controllers/assignmentController");

const authMiddleware = require("../middleware/authMiddleware");
const { isTeacher, isStudent } = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");

// Teacher uploads assignment
router.post(
  "/",
  authMiddleware,
  isTeacher,
  upload.single("pdf"),
  createAssignment
);

// Get assignments for course
router.get(
  "/course/:courseId",
  authMiddleware,
  getCourseAssignments
);

// Student submits assignment
router.post(
  "/submit",
  authMiddleware,
  isStudent,
  upload.single("pdf"),
  submitAssignment
);

// Teacher views submissions
router.get(
  "/submissions/:assignmentId",
  authMiddleware,
  isTeacher,
  getSubmissions
);

// Teacher grades submission
router.put(
  "/grade/:submissionId",
  authMiddleware,
  isTeacher,
  gradeSubmission
);

// Teacher views all submissions across their courses
router.get(
  "/teacher/all",
  authMiddleware,
  isTeacher,
  getTeacherAllSubmissions
);

// Teacher views all quiz attempts across their courses
router.get(
  "/teacher/quiz-attempts",
  authMiddleware,
  isTeacher,
  getTeacherQuizAttempts
);

// Teacher views all quiz attempts across their courses
router.get(
  "/teacher/quiz-attempts",
  authMiddleware,
  isTeacher,
  getTeacherQuizAttempts
);

// Student checks quiz unlock
router.get(
  "/check/:courseId",
  authMiddleware,
  isStudent,
  checkQuizUnlock
);
// DELETE ASSIGNMENT
router.delete(
  "/:assignmentId",
  authMiddleware,
  isTeacher,
  deleteAssignment
);

// GET PENDING SUBMISSIONS COUNT
router.get(
  "/pending-count",
  authMiddleware,
  isTeacher,
  getPendingSubmissionsCount
);

// GET SINGLE ASSIGNMENT
router.get(
  "/:id",
  authMiddleware,
  isTeacher,
  getAssignment
);

module.exports = router;