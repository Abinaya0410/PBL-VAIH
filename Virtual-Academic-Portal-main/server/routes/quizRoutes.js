

// // const express = require("express");
// // const router = express.Router();

// // const authMiddleware = require("../middleware/authMiddleware");
// // const { isTeacher } = require("../middleware/roleMiddleware");
// // const { getCompletedCourses } = require("../controllers/manualQuizController");
// // const {
// //   createQuiz,
// //   getQuizByCourse,
// //   submitCourseQuiz,
// //   editQuizQuestion,
// //   deleteQuizQuestion
// // } = require("../controllers/manualQuizController");

// // const {
// //   startQuiz,
// //   submitQuiz,
// //   getLessonAnalytics,
// // } = require("../controllers/quizController");


// // // ===============================
// // // LESSON LEVEL QUIZ ROUTES
// // // ===============================

// // // Start lesson quiz
// // router.get(
// //   "/lessons/:lessonId/start-quiz",
// //   authMiddleware,
// //   startQuiz
// // );

// // // Submit lesson quiz
// // router.post(
// //   "/lessons/:lessonId/submit-quiz",
// //   authMiddleware,
// //   submitQuiz
// // );

// // // Teacher lesson analytics
// // router.get(
// //   "/lessons/:lessonId/analytics",
// //   authMiddleware,
// //   getLessonAnalytics
// // );


// // // ===============================
// // // COURSE LEVEL QUIZ ROUTES
// // // ===============================

// // // TEACHER CREATE / UPDATE FULL QUIZ
// // router.post(
// //   "/course-quiz",
// //   authMiddleware,
// //   isTeacher,
// //   createQuiz
// // );

// // // GET QUIZ FOR STUDENTS + TEACHER
// // router.get(
// //   "/course-quiz/:courseId",
// //   authMiddleware,
// //   getQuizByCourse
// // );

// // // SAVE STUDENT QUIZ ATTEMPT
// // router.post(
// //   "/course-quiz/submit/:courseId",
// //   authMiddleware,
// //   submitCourseQuiz
// // );


// // // ===============================
// // // ✏️ EDIT SINGLE QUIZ QUESTION (TEACHER)
// // // ===============================
// // router.put(
// //   "/course-quiz/:quizId/question/:questionIndex",
// //   authMiddleware,
// //   isTeacher,
// //   editQuizQuestion
// // );


// // // ===============================
// // // 🗑 DELETE SINGLE QUIZ QUESTION (TEACHER)
// // // ===============================
// // router.delete(
// //   "/course-quiz/:quizId/question/:questionIndex",
// //   authMiddleware,
// //   isTeacher,
// //   deleteQuizQuestion
// // );

// // router.get(
// //   "/course-progress/completed",
// //   authMiddleware,
// //   getCompletedCourses
// // );

// // module.exports = router;



// const express = require("express");
// const router = express.Router();

// const authMiddleware = require("../middleware/authMiddleware");
// const { isTeacher } = require("../middleware/roleMiddleware");

// const {
//   createQuiz,
//   getQuizByCourse,
//   submitCourseQuiz,
//   editQuizQuestion,
//   deleteQuizQuestion,
//   getCompletedCourses,
//   getStudentQuizAttempts  , // ✅ Added
//   getSingleAttempt
// } = require("../controllers/manualQuizController");

// const {
//   startQuiz,
//   submitQuiz,
//   getLessonAnalytics,
// } = require("../controllers/quizController");


// // ===============================
// // LESSON LEVEL QUIZ ROUTES
// // ===============================

// // Start lesson quiz
// router.get(
//   "/lessons/:lessonId/start-quiz",
//   authMiddleware,
//   startQuiz
// );

// // Submit lesson quiz
// router.post(
//   "/lessons/:lessonId/submit-quiz",
//   authMiddleware,
//   submitQuiz
// );

// // Teacher lesson analytics
// router.get(
//   "/lessons/:lessonId/analytics",
//   authMiddleware,
//   getLessonAnalytics
// );


// // ===============================
// // COURSE LEVEL QUIZ ROUTES
// // ===============================

// // TEACHER CREATE / UPDATE FULL QUIZ
// router.post(
//   "/course-quiz",
//   authMiddleware,
//   isTeacher,
//   createQuiz
// );

// // GET QUIZ FOR STUDENTS + TEACHER
// router.get(
//   "/course-quiz/:courseId",
//   authMiddleware,
//   getQuizByCourse
// );

// // SAVE STUDENT QUIZ ATTEMPT
// router.post(
//   "/course-quiz/submit/:courseId",
//   authMiddleware,
//   submitCourseQuiz
// );

// // ===============================
// // 🟢 GET ALL QUIZ ATTEMPTS (STUDENT)
// // ===============================
// router.get(
//   "/student-attempts",
//   authMiddleware,
//   getStudentQuizAttempts
// );


// // ===============================
// // ✏️ EDIT SINGLE QUIZ QUESTION (TEACHER)
// // ===============================
// router.put(
//   "/course-quiz/:quizId/question/:questionIndex",
//   authMiddleware,
//   isTeacher,
//   editQuizQuestion
// );


// // ===============================
// // 🗑 DELETE SINGLE QUIZ QUESTION (TEACHER)
// // ===============================
// router.delete(
//   "/course-quiz/:quizId/question/:questionIndex",
//   authMiddleware,
//   isTeacher,
//   deleteQuizQuestion
// );


// // ===============================
// // GET COMPLETED COURSES
// // ===============================
// router.get(
//   "/course-progress/completed",
//   authMiddleware,
//   getCompletedCourses
// );

// router.get(
//   "/quiz-attempt/:attemptId",
//   authMiddleware,
//   getSingleAttempt
// );
// module.exports = router;



const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

const {
  createQuiz,
  getQuizByCourse,
  submitCourseQuiz,
  editQuizQuestion,
  deleteQuizQuestion,
  getCompletedCourses,
  getSingleAttempt,
  getAttemptsByCourse,
  getTeacherQuizActivity,
  getStudentQuizAttempts
} = require("../controllers/manualQuizController");

const {
  startQuiz,
  submitQuiz,
  getLessonAnalytics,
  getLatestAttempt,
} = require("../controllers/quizController");


// ===============================
// LESSON LEVEL QUIZ ROUTES
// ===============================

// Start lesson quiz
router.get(
  "/lessons/:lessonId/start-quiz",
  authMiddleware,
  startQuiz
);

// Submit lesson quiz
router.post(
  "/lessons/:lessonId/submit-quiz",
  authMiddleware,
  submitQuiz
);

// Teacher lesson analytics
router.get(
  "/lessons/:lessonId/analytics",
  authMiddleware,
  getLessonAnalytics
);


// ===============================
// COURSE LEVEL QUIZ ROUTES
// ===============================

// Teacher create / update quiz
router.post(
  "/course-quiz",
  authMiddleware,
  isTeacher,
  createQuiz
);

// Get quiz for course
router.get(
  "/course-quiz/:courseId",
  authMiddleware,
  getQuizByCourse
);

// Submit course quiz
router.post(
  "/course-quiz/submit/:courseId",
  authMiddleware,
  submitCourseQuiz
);


// ===============================
// STUDENT QUIZ ATTEMPTS
// ===============================

router.get(
  "/quiz-attempts",
  authMiddleware,
  getStudentQuizAttempts
);

router.get(
  "/quiz-attempts/course/:courseId",
  authMiddleware,
  getAttemptsByCourse
);

router.get(
  "/teacher/activity",
  authMiddleware,
  isTeacher,
  getTeacherQuizActivity
);

router.get(
  "/quiz-attempt/:attemptId",
  authMiddleware,
  getSingleAttempt
);

router.get(
  "/attempts/:courseId/latest",
  authMiddleware,
  getLatestAttempt
);


// ===============================
// QUIZ QUESTION MANAGEMENT
// ===============================

router.put(
  "/course-quiz/:quizId/question/:questionIndex",
  authMiddleware,
  isTeacher,
  editQuizQuestion
);

router.delete(
  "/course-quiz/:quizId/question/:questionIndex",
  authMiddleware,
  isTeacher,
  deleteQuizQuestion
);


// ===============================
// COMPLETED COURSES
// ===============================

router.get(
  "/course-progress/completed",
  authMiddleware,
  getCompletedCourses
);

module.exports = router;