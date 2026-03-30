const { chatWithGemini, getQuizPerformanceSummary, getPDFContentSummary, generateAcademicQuestions } = require("../services/aiService");
const QuizAttempt = require("../models/QuizAttempt");
const Lesson = require("../models/Lesson");
const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const chat = async (req, res) => {
  const { history, message } = req.body;
  try {
    const response = await chatWithGemini(history, message);
    res.json({ response });
  } catch (err) {
    console.error("AI Chat Error:", err);
    res.status(500).json({ message: "AI Assistant is temporarily unavailable" });
  }
};

const summarizeQuiz = async (req, res) => {
  const { answers, correctAnswers, score, total } = req.body;
  try {
    const summary = await getQuizPerformanceSummary({ answers, correctAnswers, score, total });
    res.json({ summary });
  } catch (err) {
    console.error("AI Quiz Summary Error:", err);
    res.status(500).json({ message: "Failed to generate analysis" });
  }
};

const summarizePDF = async (req, res) => {
  const { lessonId, textContent } = req.body;
  try {
    let textToSummarize = textContent || "";
    
    // If it's a specific lesson, fetch its PDF
    if (lessonId) {
      const lesson = await Lesson.findById(lessonId);
      if (lesson && lesson.pdfUrl) {
         const pdfPath = path.join(__dirname, "..", "uploads", lesson.pdfUrl.split("/").pop());
         if (fs.existsSync(pdfPath)) {
           const dataBuffer = fs.readFileSync(pdfPath);
           const data = await pdf(dataBuffer);
           textToSummarize += "\n" + data.text;
         }
      }
    }

    if (!textToSummarize.trim()) {
      return res.status(400).json({ message: "No content available to summarize" });
    }

    const summary = await getPDFContentSummary(textToSummarize);
    res.json({ summary });
  } catch (err) {
    console.error("AI PDF Summary Error:", err);
    res.status(500).json({ message: "Failed to summarize lesson content" });
  }
};

const generateQuestions = async (req, res) => {
  const { topic, count } = req.body;
  try {
    const questions = await generateAcademicQuestions(topic, count);
    res.json({ questions });
  } catch (err) {
    console.error("AI Question Generation Error:", err);
    res.status(500).json({ message: "Failed to generate questions" });
  }
};

module.exports = {
  chat,
  summarizeQuiz,
  summarizePDF,
  generateQuestions
};
