
const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    score: {
      type: Number,
      default: 0,
    },

    correctCount: {
      type: Number,
      default: 0,
    },

    wrongCount: {
      type: Number,
      default: 0,
    },

    // ✅ NEW: Store detailed answers for review
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ModuleQuestion", // or QuestionBank, generic ref if unsure, but for course quiz it's within Quiz model questions which don't have separate IDs usually unless we use subdoc IDs
        },
        question: String,
        options: [String],
        selectedAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
      },
    ],

    startTime: {
      type: Date,
    },

    endTime: {
      type: Date,
    },

    timeSpent: {
      type: Number, // in seconds
    },
    aiSummary: {
      type: String, // AI-generated performance summary
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);


