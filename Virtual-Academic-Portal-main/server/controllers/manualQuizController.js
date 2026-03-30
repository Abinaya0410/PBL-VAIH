
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const CourseProgress = require("../models/CourseProgress");
const { evaluateCourseCompletion } = require("../services/completionHelper");
//const { getEnhancedStudentAttempts } = require("../services/quizService");

// ======================================================
// 🟢 CREATE OR UPDATE COURSE QUIZ (TEACHER)
// ======================================================
exports.createQuiz = async (req, res) => {
  try {
    const { title, courseId, questions } = req.body;

    let quiz = await Quiz.findOne({ course: courseId });

    if (quiz) {
      quiz.title = title;
      quiz.questions = questions;
      await quiz.save();
    } else {
      quiz = await Quiz.create({
        title,
        course: courseId,
        questions,
        createdBy: req.user.id,
      });
    }

    res.status(200).json(quiz);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ======================================================
// 🟢 GET QUIZ BY COURSE (STUDENT / TEACHER)
// ======================================================
exports.getQuizByCourse = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      course: req.params.courseId,
    });

    res.json(quiz);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ======================================================
// 🟢 SUBMIT COURSE QUIZ (STUDENT)
// ======================================================
exports.submitCourseQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;

    const {
      score,
      correctCount,
      wrongCount,
      answers,      // ✅ detailed answers
      startTime,    // ✅ real start time from frontend
      endTime       // ✅ real end time from frontend
    } = req.body;

    // Calculate time spent (in seconds)
    let timeSpent = 0;
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      timeSpent = Math.floor((end - start) / 1000);
    }

    // 1️⃣ Save quiz attempt with full details
    const attempt = await QuizAttempt.create({
      student: req.user.id,
      course: courseId,
      score,
      correctCount,
      wrongCount,
      answers: answers || [],
      startTime,
      endTime,
      timeSpent,
    });



    // 🔄 Sync Course Completion (Strict)
    await evaluateCourseCompletion(req.user.id, courseId);

    res.json({
      message: "Quiz attempt saved",
      attempt,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// ======================================================
// 🟢 GET COMPLETED COURSES (STUDENT)
// ======================================================
exports.getCompletedCourses = async (req, res) => {
  try {
    const completed = await CourseProgress.find({
      student: req.user.id,
      status: "completed",
    }).populate("course");

    // 🛡️ Safety Check: Ignore progress records where course does not exist
    const validCompleted = completed.filter(p => p.course !== null);

    res.json(validCompleted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ======================================================
// 🟢 EDIT SINGLE QUIZ QUESTION (TEACHER)
// ======================================================
exports.editQuizQuestion = async (req, res) => {
  try {
    const { quizId, questionIndex } = req.params;
    const { question, options, correctAnswer } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions[questionIndex] = {
      question,
      options,
      correctAnswer,
    };

    await quiz.save();

    res.json({ message: "Question updated", quiz });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ======================================================
// 🟢 DELETE SINGLE QUIZ QUESTION (TEACHER)
// ======================================================
exports.deleteQuizQuestion = async (req, res) => {
  try {
    const { quizId, questionIndex } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions.splice(questionIndex, 1);
    await quiz.save();

    res.json({ message: "Question deleted", quiz });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================================
// 🟢 GET ALL QUIZ ATTEMPTS (STUDENT)
// ======================================================
exports.getStudentQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      student: req.user.id,
    })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(attempts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ======================================================
// 🟢 GET ATTEMPTS BY COURSE (STUDENT)
// ======================================================
exports.getAttemptsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const attempts = await QuizAttempt.find({
      student: req.user.id,
      course: courseId
    })
    .populate("course", "title")
    .sort({ createdAt: -1 });

    res.json(attempts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// // ======================================================
// // 🟢 GET ALL QUIZ ATTEMPTS (STUDENT) - WITH BASIC COMPARISON
// // ======================================================
// exports.getStudentQuizAttempts = async (req, res) => {
//   try {

//     // Get all attempts sorted by course + date (oldest first)
//     const attempts = await QuizAttempt.find({
//       student: req.user.id,
//     })
//       .populate("course", "title")
//       .sort({ course: 1, createdAt: 1 });

//     const enhancedAttempts = [];
//     const lastScoreByCourse = {};

//     for (let attempt of attempts) {
//       const courseId = attempt.course._id.toString();

//       const previousScore = lastScoreByCourse[courseId] ?? null;

//       enhancedAttempts.push({
//         ...attempt._doc,
//         previousScore,
//         scoreDifference:
//           previousScore !== null
//             ? attempt.score - previousScore
//             : null,
//         improved:
//           previousScore !== null
//             ? attempt.score > previousScore
//             : null,
//       });

//       // update last score for this course
//       lastScoreByCourse[courseId] = attempt.score;
//     }

//     // Show latest attempts first in UI
//     res.json(enhancedAttempts.reverse());

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// ======================================================
// 🟢 GET SINGLE QUIZ ATTEMPT (FOR REVIEW)
// ======================================================
exports.getSingleAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findById(attemptId)
      .populate("course", "title");

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    // Security check
    if (attempt.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Fetch REAL quiz questions to ensure current options/text are available if needed
    // The user wants REAL data from Quiz model matched by questionId
    const quiz = await Quiz.findOne({ course: attempt.course._id });
    
    if (quiz) {
      // Enrich answers with real question data if questionId matches
      const enrichedAnswers = attempt.answers.map(ans => {
        const realQ = quiz.questions.id(ans.questionId) || quiz.questions.find(q => q._id.toString() === ans.questionId?.toString());
        if (realQ) {
          return {
            ...ans.toObject(),
            question: realQ.question,
            options: realQ.options,
            correctAnswer: realQ.correctAnswer
          };
        }
        return ans;
      });
      
      const enrichedAttempt = attempt.toObject();
      enrichedAttempt.answers = enrichedAnswers;
      return res.json(enrichedAttempt);
    }

    res.json(attempt);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// const Quiz = require("../models/Quiz");
// const QuizAttempt = require("../models/QuizAttempt");
// const CourseProgress = require("../models/CourseProgress");
// const Course = require("../models/Course"); // ✅ NEW: to fetch course title
// //const { getEnhancedStudentAttempts } = require("../services/quizService");


// // ======================================================
// // 🟢 CREATE OR UPDATE COURSE QUIZ (TEACHER)
// // ======================================================
// exports.createQuiz = async (req, res) => {
//   try {
//     const { title, courseId, questions } = req.body;

//     let quiz = await Quiz.findOne({ course: courseId });

//     if (quiz) {
//       quiz.title = title;
//       quiz.questions = questions;
//       await quiz.save();
//     } else {
//       quiz = await Quiz.create({
//         title,
//         course: courseId,
//         questions,
//         createdBy: req.user.id,
//       });
//     }

//     res.status(200).json(quiz);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // ======================================================
// // 🟢 GET QUIZ BY COURSE (STUDENT / TEACHER)
// // ======================================================
// exports.getQuizByCourse = async (req, res) => {
//   try {
//     const quiz = await Quiz.findOne({
//       course: req.params.courseId,
//     });

//     res.json(quiz);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // ======================================================
// // 🟢 SUBMIT COURSE QUIZ (STUDENT)
// // ======================================================
// exports.submitCourseQuiz = async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     const {
//       score,
//       correctCount,
//       wrongCount,
//       answers,
//       startTime,
//       endTime
//     } = req.body;

//     // ✅ Fetch course title for analytics safety
//     const course = await Course.findById(courseId);

//     // Calculate time spent (in seconds)
//     let timeSpent = 0;
//     if (startTime && endTime) {
//       const start = new Date(startTime);
//       const end = new Date(endTime);
//       timeSpent = Math.floor((end - start) / 1000);
//     }

//     // 1️⃣ Save quiz attempt with full details
//     const attempt = await QuizAttempt.create({
//       student: req.user.id,
//       course: courseId,
//       courseTitle: course?.title, // ✅ NEW
//       score,
//       correctCount,
//       wrongCount,
//       answers: answers || [],
//       startTime,
//       endTime,
//       timeSpent,
//     });

//     // 2️⃣ If passed → mark course completed
//     if (score >= 60) {
//       await CourseProgress.findOneAndUpdate(
//         { student: req.user.id, course: courseId },
//         {
//           completed: true,
//           completedAt: new Date(),
//         },
//         { upsert: true, new: true }
//       );
//     }

//     res.json({
//       message: "Quiz attempt saved",
//       attempt,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };


// // ======================================================
// // 🟢 GET COMPLETED COURSES (STUDENT)
// // ======================================================
// exports.getCompletedCourses = async (req, res) => {
//   try {
//     const completed = await CourseProgress.find({
//       student: req.user.id,
//       completed: true,
//     }).populate("course");

//     res.json(completed);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // ======================================================
// // 🟢 EDIT SINGLE QUIZ QUESTION (TEACHER)
// // ======================================================
// exports.editQuizQuestion = async (req, res) => {
//   try {
//     const { quizId, questionIndex } = req.params;
//     const { question, options, correctAnswer } = req.body;

//     const quiz = await Quiz.findById(quizId);

//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     quiz.questions[questionIndex] = {
//       question,
//       options,
//       correctAnswer,
//     };

//     await quiz.save();

//     res.json({ message: "Question updated", quiz });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // ======================================================
// // 🟢 DELETE SINGLE QUIZ QUESTION (TEACHER)
// // ======================================================
// exports.deleteQuizQuestion = async (req, res) => {
//   try {
//     const { quizId, questionIndex } = req.params;

//     const quiz = await Quiz.findById(quizId);

//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     quiz.questions.splice(questionIndex, 1);
//     await quiz.save();

//     res.json({ message: "Question deleted", quiz });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // ======================================================
// // 🟢 GET ALL QUIZ ATTEMPTS (STUDENT)
// // ======================================================
// exports.getStudentQuizAttempts = async (req, res) => {
//   try {
//     const attempts = await QuizAttempt.find({
//       student: req.user.id,
//     })
//       .populate("course", "title")
//       .sort({ createdAt: -1 });

//     res.json(attempts);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };


// // ======================================================
// // 🟢 GET SINGLE QUIZ ATTEMPT (FOR REVIEW)
// // ======================================================
// exports.getSingleAttempt = async (req, res) => {
//   try {
//     const { attemptId } = req.params;

//     const attempt = await QuizAttempt.findById(attemptId)
//       .populate("course", "title");

//     if (!attempt) {
//       return res.status(404).json({ message: "Attempt not found" });
//     }

//     if (attempt.student.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Unauthorized access" });
//     }

//     res.json(attempt);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// ======================================================
// 🟢 GET ALL QUIZ ACTIVITY FOR TEACHER'S COURSES
// ======================================================
exports.getTeacherQuizActivity = async (req, res) => {
  try {
    const Course = require("../models/Course");
    const teacherCourses = await Course.find({ teacher: req.user.id }).distinct("_id");

    const attempts = await QuizAttempt.find({
      course: { $in: teacherCourses }
    })
    .populate("student", "name email")
    .populate("course", "title")
    .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};