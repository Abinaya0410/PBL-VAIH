const QuestionBank = require("../models/QuestionBank");
const LessonProgress = require("../models/LessonProgress");

// =======================
// TEACHER: CREATE QB QUESTION
// =======================
const createQuestion = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);
    console.log("LESSON ID:", req.params.lessonId);

    const { lessonId } = req.params;
    const { question, options, correctAnswer, difficulty } = req.body;

    const qb = await QuestionBank.create({
      lesson: lessonId,
      question,
      options,
      correctAnswer,
      difficulty,
      createdBy: req.user.id,
    });

    res.status(201).json(qb);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// TEACHER: GET OWN QB QUESTIONS
// =======================
const getTeacherQuestions = async (req, res) => {
  try {
    const questions = await QuestionBank.find({
      createdBy: req.user.id,
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// STUDENT: VIEW QB (ONLY AFTER COMPLETION)
// =======================
// const getStudentQuestions = async (req, res) => {
//   try {
//     const { lessonId } = req.params;

//     const progress = await LessonProgress.findOne({
//       student: req.user.id,
//       lesson: lessonId,
//       completed: true,
//     });

//     if (!progress) {
//       return res
//         .status(403)
//         .json({ message: "Complete lesson to access question bank" });
//     }

//     const questions = await QuestionBank.find({ lesson: lessonId });

//     res.json(questions);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getStudentQuestions = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // If teacher → allow direct access
    if (req.user.role === "teacher") {
      const questions = await QuestionBank.find({ lesson: lessonId });
      return res.json(questions);
    }

    // If student → check completion
    const progress = await LessonProgress.findOne({
      student: req.user.id,
      lesson: lessonId,
      completed: true,
    });

    if (!progress) {
      return res
        .status(403)
        .json({ message: "Complete lesson to access question bank" });
    }

    const questions = await QuestionBank.find({ lesson: lessonId });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { question, options, correctAnswer, difficulty } = req.body;

    const updated = await QuestionBank.findByIdAndUpdate(
      questionId,
      {
        question,
        options,
        correctAnswer,
        difficulty,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuestion,
  getTeacherQuestions,
  getStudentQuestions,
  updateQuestion,
};
