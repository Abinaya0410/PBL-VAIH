


// const express = require("express");
// const router = express.Router();

// const authMiddleware = require("../middleware/authMiddleware");
// const { isTeacher, isStudent } = require("../middleware/roleMiddleware");

// const {
//   createQuestion,
//   getTeacherQuestions,
//   getStudentQuestions,
//   updateQuestion   // 👈 ADD THIS
// } = require("../controllers/questionBankController");


// // =======================
// // Teacher creates question
// // =======================
// router.post(
//   "/lessons/:lessonId/question-bank",
//   authMiddleware,
//   isTeacher,
//   createQuestion
// );

// // =======================
// // Teacher views own questions
// // =======================
// router.get(
//   "/question-bank/teacher",
//   authMiddleware,
//   isTeacher,
//   getTeacherQuestions
// );

// // =======================
// // Student / Teacher view questions
// // =======================
// router.get(
//   "/lessons/:lessonId/question-bank",
//   authMiddleware,
//   getStudentQuestions
// );


// // =======================
// // ✏️ Teacher EDIT question  ← ADD HERE
// // =======================
// router.put(
//   "/question-bank/:questionId",
//   authMiddleware,
//   isTeacher,
//   updateQuestion
// );


// // =======================
// // 🗑 Teacher DELETE question
// // =======================
// router.delete(
//   "/question-bank/:questionId",
//   authMiddleware,
//   isTeacher,
//   async (req, res) => {
//     try {
//       const QuestionBank = require("../models/QuestionBank");

//       await QuestionBank.findByIdAndDelete(req.params.questionId);

//       res.json({ message: "Question deleted" });
//     } catch (err) {
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// module.exports = router;


const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

const {
  createQuestion,
  getTeacherQuestions,
  getStudentQuestions,
  updateQuestion
} = require("../controllers/questionBankController");


// =======================
// Teacher creates question
// =======================
router.post(
  "/lessons/:lessonId/question-bank",
  authMiddleware,
  isTeacher,
  createQuestion
);


// =======================
// Teacher views own questions
// =======================
router.get(
  "/question-bank/teacher",
  authMiddleware,
  isTeacher,
  getTeacherQuestions
);


// =======================
// Student / Teacher view questions by lesson
// =======================
router.get(
  "/lessons/:lessonId/question-bank",
  authMiddleware,
  getStudentQuestions
);


// =======================
// ⭐ GET SINGLE QUESTION (FOR EDIT PAGE)
// =======================
router.get(
  "/question-bank/:questionId",
  authMiddleware,
  isTeacher,
  async (req, res) => {
    try {
      const QuestionBank = require("../models/QuestionBank");

      const question = await QuestionBank.findById(req.params.questionId);

      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      res.json(question);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);


// =======================
// ✏️ Teacher EDIT question
// =======================
router.put(
  "/question-bank/:questionId",
  authMiddleware,
  isTeacher,
  updateQuestion
);


// =======================
// 🗑 Teacher DELETE question
// =======================
router.delete(
  "/question-bank/:questionId",
  authMiddleware,
  isTeacher,
  async (req, res) => {
    try {
      const QuestionBank = require("../models/QuestionBank");

      await QuestionBank.findByIdAndDelete(req.params.questionId);

      res.json({ message: "Question deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
