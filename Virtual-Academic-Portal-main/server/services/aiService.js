const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * FEATURE 1: General Chatbot Logic
 */
const chatWithGemini = async (history, message) => {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  
  // Clean history for Gemini (must start with 'user')
  const validHistory = (history || []).filter((msg, index) => {
    if (index === 0 && msg.role === 'model') return false;
    return true;
  });

  const chat = model.startChat({
    history: validHistory,
    generationConfig: {
      maxOutputTokens: 800,
    },
  });

  const prompt = `Act as a helpful academic assistant. Explain concepts in simple and clear terms. User question: ${message}`;
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
};

/**
 * FEATURE 2: Quiz Summary Logic
 */
const getQuizPerformanceSummary = async (quizData) => {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `
      Analyze this quiz performance:
      Score: ${quizData.score}
      Total Questions: ${quizData.total}
      User Answers: ${JSON.stringify(quizData.answers)}
      
      Give:
      - Strengths
      - Weak areas
      - Suggestions for improvement
      Keep it short, professional, and student-friendly.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

/**
 * FEATURE 3: PDF/Lesson Content Summary Logic
 */
const getPDFContentSummary = async (text) => {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `
      Summarize this academic content:
      
      ---
      ${text}
      ---
      
      Provide:
      - Short summary
      - Key points (bullet points)
      - Important topics covered
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

/**
 * FEATURE 4: AI Question Generator logic
 */
const generateAcademicQuestions = async (topic, count = 5) => {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `
      Generate ${count} MCQs on the topic: "${topic}".
      
      Return as a JSON array of objects:
      [
        {
          "question": "...",
          "options": ["...", "...", "...", "..."],
          "answer": "Correct option exactly as written in the options"
        }
      ]
      Provide ONLY the JSON array.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
};

module.exports = {
  chatWithGemini,
  getQuizPerformanceSummary,
  getPDFContentSummary,
  generateAcademicQuestions
};
