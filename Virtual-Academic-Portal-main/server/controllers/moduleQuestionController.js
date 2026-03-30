const ModuleQuestion = require("../models/ModuleQuestion");

// =======================
// TEACHER: CREATE MODULE QUESTION
// =======================
const createModuleQuestion = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { question, options, correctAnswer, difficulty } = req.body;

    const mq = await ModuleQuestion.create({
      lesson: lessonId,
      question,
      options,
      correctAnswer,
      difficulty,
      createdBy: req.user.id,
    });

    res.status(201).json(mq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// TEACHER: GET MODULE QUESTIONS
// =======================
const getModuleQuestions = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const questions = await ModuleQuestion.find({
      lesson: lessonId,
      createdBy: req.user.id,
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createModuleQuestion,
  getModuleQuestions,
};
