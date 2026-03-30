// const express = require("express");
// const router = express.Router();

// const { getStudentAnalytics } = require("../controllers/analyticsController");
// const authMiddleware = require("../middleware/authMiddleware");
// const { isStudent } = require("../middleware/roleMiddleware");

// // 🔐 Student Analytics Route
// router.get("/student", authMiddleware, isStudent, getStudentAnalytics);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  getStudentAnalytics,
  getTeacherAnalytics,
  getCourseAnalytics,
  getStudentDashboardStats,
  getEngagementAnalytics,
  notifyAtRiskStudent
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");
const { isStudent, isTeacher } = require("../middleware/roleMiddleware");

// 🔐 Student Analytics
router.get("/student", authMiddleware, isStudent, getStudentAnalytics);
router.get("/student-stats", authMiddleware, isStudent, getStudentDashboardStats);

// 🔐 Teacher Analytics
router.get("/teacher", authMiddleware, isTeacher, getTeacherAnalytics);
router.get("/engagement", authMiddleware, isTeacher, getEngagementAnalytics);
router.post("/notify-at-risk", authMiddleware, isTeacher, notifyAtRiskStudent);

// 🔐 Course Specific Analytics (Teacher)
router.get("/course/:courseId", authMiddleware, isTeacher, getCourseAnalytics);

module.exports = router;