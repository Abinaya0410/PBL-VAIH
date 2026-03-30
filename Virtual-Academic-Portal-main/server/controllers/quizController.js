
const QuestionBank = require("../models/QuestionBank");
const ModuleQuestion = require("../models/ModuleQuestion");
const LessonProgress = require("../models/LessonProgress");
const QuizAttempt = require("../models/QuizAttempt");
const User = require("../models/User");
const Lesson = require("../models/Lesson");
const { evaluateCourseCompletion } = require("../services/completionHelper");
const { getQuizPerformanceSummary } = require("../services/aiService");

// Shuffle function
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const startQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user.id;

    // Check lesson completed
    const progress = await LessonProgress.findOne({
      lesson: lessonId,
      student: studentId,
      completed: true,
    });

    if (!progress) {
      return res.status(403).json({
        message: "Complete the lesson to start quiz",
      });
    }

    // 🚨 BLOCK SECOND ATTEMPT
    const existingAttempt = await QuizAttempt.findOne({
      student: studentId,
      lesson: lessonId,
      score: { $gt: 0 },
    });

    if (existingAttempt) {
      return res.status(403).json({
        message: "You can attempt this quiz only once",
      });
    }

    // Fetch lesson to get courseId before creating attempt
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || !lesson.course) {
      return res.status(404).json({ message: "Lesson or associated course not found." });
    }

    // Create attempt with start time AND course
    const attempt = await QuizAttempt.create({
      student: studentId,
      lesson: lessonId,
      course: lesson.course,
      startTime: new Date(),
    });

    // Get 5 QB questions
    const qbQuestions = await QuestionBank.aggregate([
      { $match: { lesson: progress.lesson } },
      { $sample: { size: 5 } },
    ]);

    // Get 15 module questions
    const moduleQuestions = await ModuleQuestion.aggregate([
      { $match: { lesson: progress.lesson } },
      { $sample: { size: 15 } },
    ]);

    let allQuestions = [...qbQuestions, ...moduleQuestions];
    allQuestions = shuffleArray(allQuestions);

    // 🏆 Award Points (+10 per attempt start)
    await User.findByIdAndUpdate(studentId, {
      $inc: { points: 10 }
    });

    res.json({
      attemptId: attempt._id,
      totalQuestions: 20,
      timeLimit: 30,
      questions: allQuestions,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// STUDENT: SUBMIT QUIZ
// ===============================
// const submitQuiz = async (req, res) => {
//   try {
//     const { lessonId } = req.params;
//     const { answers, attemptId } = req.body;
//     const studentId = req.user.id;

//     const attempt = await QuizAttempt.findById(attemptId);

//     if (!attempt) {
//       return res.status(404).json({ message: "Attempt not found" });
//     }

//     const endTime = new Date();
//     const timeSpent = (endTime - attempt.startTime) / 60000; // minutes

//     // 30 MINUTE LIMIT CHECK
//     if (timeSpent > 30) {
//       return res.status(403).json({
//         message: "Time exceeded! Quiz auto-closed.",
//       });
//     }

//     let correctCount = 0;
//     let wrongCount = 0;

//     for (const ans of answers) {
//       const { questionId, selectedAnswer } = ans;

//       let question =
//         await QuestionBank.findById(questionId) ||
//         await ModuleQuestion.findById(questionId);

//       if (!question) continue;

//       if (question.correctAnswer === selectedAnswer) {
//         correctCount++;
//       } else {
//         wrongCount++;
//       }
//     }

//     const score = correctCount;

//     // UPDATE EXISTING ATTEMPT
//     attempt.score = score;
//     attempt.correctCount = correctCount;
//     attempt.wrongCount = wrongCount;
//     attempt.endTime = endTime;
//     attempt.timeSpent = timeSpent;

//     await attempt.save();

//     res.json({
//       message: "Quiz submitted successfully",
//       score,
//       correctCount,
//       wrongCount,
//       timeSpent,
//       attempt,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const submitQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { answers, attemptId } = req.body;
    const studentId = req.user.id;

    const attempt = await QuizAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    // 🚨 MUST ANSWER ALL 20 QUESTIONS
    if (!answers || answers.length < 20) {
      return res.status(400).json({
        message: "You must answer all 20 questions before submitting",
      });
    }

    const endTime = new Date();
    const timeSpent = (endTime - attempt.startTime) / 60000;

    // 30 min limit
    if (timeSpent > 30) {
      return res.status(403).json({
        message: "Time exceeded! Quiz auto-closed.",
      });
    }

    let correctCount = 0;
    let wrongCount = 0;

    for (const ans of answers) {
      const { questionId, selectedAnswer } = ans;

      let question =
        await QuestionBank.findById(questionId) ||
        await ModuleQuestion.findById(questionId);

      if (!question) continue;

      if (question.correctAnswer === selectedAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }

    const score = correctCount;

    attempt.score = score;
    attempt.correctCount = correctCount;
    attempt.wrongCount = wrongCount;
    attempt.endTime = endTime;
    attempt.timeSpent = timeSpent;

    await attempt.save();

    // 🚀 NEW: Generate AI Performance Summary
    (async () => {
      try {
        const summary = await getQuizPerformanceSummary({
          score: score,
          total: 20,
          answers: answers.map(a => ({
            question: a.question,
            selected: a.selectedAnswer,
            correct: a.correctAnswer,
            isCorrect: a.isCorrect
          }))
        });
        
        if (summary) {
          attempt.aiSummary = summary;
          await attempt.save();
        }
      } catch (aiErr) {
        console.error("Delayed AI Quiz Summary Failed:", aiErr);
      }
    })();

    // 🚀 TRIGGER COURSE COMPLETION CHECK
    try {
      const lesson = await Lesson.findById(lessonId);
      if (lesson && lesson.course) {
        await evaluateCourseCompletion(studentId, lesson.course);
      }
    } catch (completionErr) {
      console.error("Failed to evaluate course completion after quiz:", completionErr);
    }

    // 🏆 Award Points (Tiered based on score out of 20)
    // Percentage: (score/20) * 100
    const percentage = (score / 20) * 100;
    let pointsToAward = 10;
    if (percentage >= 90) pointsToAward = 50;
    else if (percentage >= 70) pointsToAward = 40;
    else if (percentage >= 50) pointsToAward = 25;

    await User.findByIdAndUpdate(studentId, {
      $inc: { points: pointsToAward }
    });

    res.json({
      message: `Quiz submitted successfully (+${pointsToAward} points)`,
      score,
      correctCount,
      wrongCount,
      timeSpent,
      attempt,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// TEACHER: LESSON ANALYTICS
// ===============================
const getLessonAnalytics = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const attempts = await QuizAttempt.find({ lesson: lessonId })
      .populate("student", "name email");

    if (attempts.length === 0) {
      return res.json({
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        attempts: [],
      });
    }

    const totalAttempts = attempts.length;

    let totalScore = 0;
    let highestScore = attempts[0].score;
    let lowestScore = attempts[0].score;

    attempts.forEach((a) => {
      totalScore += a.score;
      if (a.score > highestScore) highestScore = a.score;
      if (a.score < lowestScore) lowestScore = a.score;
    });

    const averageScore = totalScore / totalAttempts;

    res.json({
      totalAttempts,
      averageScore,
      highestScore,
      lowestScore,
      attempts, // includes student name + timeSpent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// STUDENT: GET LATEST ATTEMPT (for AI Summary polling)
// ===============================
const getLatestAttempt = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const attempt = await QuizAttempt.findOne({ 
      student: studentId, 
      course: courseId 
    }).sort({ createdAt: -1 });

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startQuiz,
  submitQuiz,
  getLessonAnalytics,
  getLatestAttempt,
};
