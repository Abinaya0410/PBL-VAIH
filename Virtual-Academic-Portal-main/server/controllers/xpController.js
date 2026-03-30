const AssignmentSubmission = require("../models/AssignmentSubmission");
const QuizAttempt = require("../models/QuizAttempt");
const Assignment = require("../models/Assignment");
const Course = require("../models/Course");

// ===========================
// QUIZ EFFICIENCY POINTS
// ===========================
function quizEfficiencyPoints(attemptCount) {
  if (attemptCount === 1) return 100;
  if (attemptCount === 2) return 70;
  if (attemptCount === 3) return 40;
  return 20; // 4 or more attempts
}

// ======================================================
// GET STUDENT SCORE (REAL DATA — SIMPLE POINT SYSTEM)
// ======================================================
exports.getStudentXP = async (req, res) => {
  try {
    const studentId = req.user.id;

    // ============================
    // 1. ASSIGNMENT POINTS — +50 per submission
    // ============================
    const submissions = await AssignmentSubmission.find({
      student: studentId,
    })
    .populate({
      path: "assignment",
      model: "Assignment",
      select: "title course",
      populate: {
        path: "course",
        model: "Course",
        select: "title",
      },
    })
    .sort({ createdAt: -1 });

    const assignmentPoints = submissions.length * 50;

    // Build assignment details list
    const assignmentDetails = submissions.map(s => {
      let courseTitle = s.assignment?.course?.title;
      let label = "Assignment Submitted";
      
      if (courseTitle) {
        label = `${courseTitle} Assignment Submitted`;
      } else if (s.assignment && !s.assignment.course) {
        label = "Unknown Course Assignment Submitted";
      }

      return {
        label,
        points: 50,
        date: s.createdAt,
      };
    });

    // ============================
    // 2. QUIZ EFFICIENCY POINTS — based on attempts per course
    // ============================
    const allAttempts = await QuizAttempt.find({ student: studentId })
      .populate("course", "title")
      .sort({ createdAt: 1 }); // oldest first for counting

    // Group attempts by course — count total attempts and take latest
    const attemptsByCourse = {};
    for (const attempt of allAttempts) {
      const courseId = attempt.course?._id?.toString() || "unknown";
      if (!attemptsByCourse[courseId]) {
        attemptsByCourse[courseId] = {
          title: attempt.course?.title || "Unknown Course",
          count: 0,
          latestDate: null,
        };
      }
      attemptsByCourse[courseId].count += 1;
      attemptsByCourse[courseId].latestDate = attempt.createdAt;
    }

    let quizPoints = 0;
    const quizDetails = [];
    for (const [, data] of Object.entries(attemptsByCourse)) {
      const pts = quizEfficiencyPoints(data.count);
      quizPoints += pts;
      quizDetails.push({
        label: `${data.title} — completed in ${data.count} attempt${data.count !== 1 ? "s" : ""}`,
        points: pts,
        date: data.latestDate,
      });
    }

    // ============================
    // 3. TOTAL
    // ============================
    const totalPoints = assignmentPoints + quizPoints;

    res.json({
      totalXP: totalPoints,
      assignmentXP: assignmentPoints,
      quizXP: quizPoints,
      lessonXP: 0,
      assignmentDetails,
      quizDetails,
    });

  } catch (error) {
    console.error("Score Controller error:", error);
    res.status(500).json({ message: error.message });
  }
};
