
// ======================================================
// 🟢 STUDENT ANALYTICS DASHBOARD (POLISHED VERSION)
// ======================================================
// exports.getStudentAnalytics = async (req, res) => {
//   try {
//     const studentId = new mongoose.Types.ObjectId(req.user.id);

//     // ======================================================
//     // 1️⃣ GET ENROLLED COURSES
//     // ======================================================
//     const enrolledCourses = await CourseProgress.find({
//       student: studentId,
//     }).populate("course");

//     const totalEnrolled = enrolledCourses.length;

//     const completedList = enrolledCourses.filter(
//       (c) => c.completed === true
//     );

//     const completedCourses = completedList.length;

//     // ======================================================
//     // 2️⃣ GET ALL ATTEMPTS
//     // ======================================================
//     const attempts = await QuizAttempt.find({
//       student: studentId,
//     }).populate("course");

//     const totalAttempts = attempts.length;

//     let passCount = 0;
//     let failCount = 0;

//     attempts.forEach((attempt) => {
//       if (attempt.score >= 60) passCount++;
//       else failCount++;
//     });

//     // ======================================================
//     // 3️⃣ GROUP BY COURSE
//     // ======================================================
//     const courseMap = {};

//     attempts.forEach((attempt) => {
//       if (!attempt.course) return;

//       const courseId = attempt.course._id.toString();

//       if (!courseMap[courseId]) {
//         courseMap[courseId] = {
//           courseId,
//           courseTitle: attempt.course.title,
//           attempts: 0,
//           bestScore: 0,
//           totalScore: 0,
//           lastAttemptDate: attempt.createdAt,
//         };
//       }

//       courseMap[courseId].attempts += 1;
//       courseMap[courseId].totalScore += attempt.score;

//       if (attempt.score > courseMap[courseId].bestScore) {
//         courseMap[courseId].bestScore = attempt.score;
//       }

//       // Track latest attempt
//       if (attempt.createdAt > courseMap[courseId].lastAttemptDate) {
//         courseMap[courseId].lastAttemptDate = attempt.createdAt;
//       }
//     });

//     const coursePerformance = Object.values(courseMap).map((course) => {
//       const progress = enrolledCourses.find(
//         (e) =>
//           e.course &&
//           e.course._id.toString() === course.courseId
//       );

//       return {
//         courseId: course.courseId,
//         courseTitle: course.courseTitle,
//         attempts: course.attempts,
//         bestScore: course.bestScore,
//         averageScore: Math.round(
//           course.totalScore / course.attempts
//         ),
//         lastAttemptDate: course.lastAttemptDate,
//         status:
//           progress && progress.completed
//             ? "Completed"
//             : "In Progress",
//       };
//     });

//     // ======================================================
//     // 4️⃣ OVERALL AVERAGE = AVERAGE OF BEST SCORES
//     // ======================================================
//     let averageScore = 0;

//     if (coursePerformance.length > 0) {
//       const totalBestScores = coursePerformance.reduce(
//         (sum, course) => sum + course.bestScore,
//         0
//       );

//       averageScore = Math.round(
//         totalBestScores / coursePerformance.length
//       );
//     }

//     // ======================================================
//     // 5️⃣ RECENT ATTEMPTS (LAST 5)
//     // ======================================================
//     const recentAttempts = attempts
//       .sort((a, b) => b.createdAt - a.createdAt)
//       .slice(0, 5);


//       // ======================================================
// // 🟢 STUDENT ANALYTICS DASHBOARD (POLISHED VERSION)
// // ======================================================
// exports.getStudentAnalytics = async (req, res) => {
//   try {
//     const studentId = new mongoose.Types.ObjectId(req.user.id);

//     const enrolledCourses = await CourseProgress.find({
//       student: studentId,
//     }).populate("course");

//     const totalEnrolled = enrolledCourses.length;

//     const completedList = enrolledCourses.filter(
//       (c) => c.completed === true
//     );

//     const completedCourses = completedList.length;

//     const attempts = await QuizAttempt.find({
//       student: studentId,
//     }).populate("course");

//     const totalAttempts = attempts.length;

//     let passCount = 0;
//     let failCount = 0;

//     attempts.forEach((attempt) => {
//       if (attempt.score >= 60) passCount++;
//       else failCount++;
//     });

//     const courseMap = {};

//     attempts.forEach((attempt) => {
//       if (!attempt.course) return;

//       const courseId = attempt.course._id.toString();

//       if (!courseMap[courseId]) {
//         courseMap[courseId] = {
//           courseId,
//           courseTitle: attempt.course.title,
//           attempts: 0,
//           bestScore: 0,
//           totalScore: 0,
//           lastAttemptDate: attempt.createdAt,
//         };
//       }

//       courseMap[courseId].attempts += 1;
//       courseMap[courseId].totalScore += attempt.score;

//       if (attempt.score > courseMap[courseId].bestScore) {
//         courseMap[courseId].bestScore = attempt.score;
//       }

//       if (attempt.createdAt > courseMap[courseId].lastAttemptDate) {
//         courseMap[courseId].lastAttemptDate = attempt.createdAt;
//       }
//     });

//     const coursePerformance = Object.values(courseMap).map((course) => {
//       const progress = enrolledCourses.find(
//         (e) =>
//           e.course &&
//           e.course._id.toString() === course.courseId
//       );

//       return {
//         courseId: course.courseId,
//         courseTitle: course.courseTitle,
//         attempts: course.attempts,
//         bestScore: course.bestScore,
//         averageScore: Math.round(
//           course.totalScore / course.attempts
//         ),
//         lastAttemptDate: course.lastAttemptDate,
//         status:
//           progress && progress.completed
//             ? "Completed"
//             : "In Progress",
//       };
//     });

//     let averageScore = 0;

//     if (coursePerformance.length > 0) {
//       const totalBestScores = coursePerformance.reduce(
//         (sum, course) => sum + course.bestScore,
//         0
//       );

//       averageScore = Math.round(
//         totalBestScores / coursePerformance.length
//       );
//     }

//     const recentAttempts = attempts
//       .sort((a, b) => b.createdAt - a.createdAt)
//       .slice(0, 5);

//     res.json({
//       totalEnrolled,
//       completedCourses,
//       averageScore,
//       totalAttempts,
//       passCount,
//       failCount,
//       coursePerformance,
//       recentAttempts,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ======================================================
// // 🟣 TEACHER DASHBOARD ANALYTICS (NEW)
// // ======================================================
// exports.getTeacherAnalytics = async (req, res) => {
//   try {
//     const teacherId = new mongoose.Types.ObjectId(req.user.id);

//     // 1️⃣ Get teacher courses
//     const courses = await Course.find({
//       teacher: teacherId,
//     });

//     const totalCourses = courses.length;

//     // 2️⃣ Count total students
//     let totalStudents = 0;

//     courses.forEach((course) => {
//       totalStudents += course.enrolledStudents.length;
//     });

//     const courseIds = courses.map((course) => course._id);

//     // 3️⃣ Count lessons
//     const totalLessons = await Lesson.countDocuments({
//       course: { $in: courseIds },
//     });

//     // 4️⃣ Count quiz attempts
//     const totalAttempts = await QuizAttempt.countDocuments({
//       course: { $in: courseIds },
//     });

//     // 5️⃣ Recent courses
//     const recentCourses = await Course.find({
//       teacher: teacherId,
//     })
//       .sort({ createdAt: -1 })
//       .limit(5);

//     res.json({
//       totalCourses,
//       totalStudents,
//       totalLessons,
//       totalAttempts,
//       recentCourses,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

//     // ======================================================
//     // FINAL RESPONSE
//     // ======================================================
//     res.json({
//       totalEnrolled,
//       completedCourses,
//       averageScore,
//       totalAttempts,
//       passCount,
//       failCount,
//       coursePerformance,
//       recentAttempts,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };


const QuizAttempt = require("../models/QuizAttempt");
const Quiz = require("../models/Quiz");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Assignment = require("../models/Assignment");
const User = require("../models/User");
const mongoose = require("mongoose");

// ======================================================
// 🟢 STUDENT ANALYTICS DASHBOARD
// ======================================================
exports.getStudentAnalytics = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.user.id);

    // 1️⃣ GET ENROLLED COURSES
    const enrolledCourses = await CourseProgress.find({
      student: studentId,
    }).populate("course");

    const totalEnrolled = enrolledCourses.length;

    const completedList = enrolledCourses.filter(
      (c) => c.status === "completed"
    );

    const completedCourses = completedList.length;

    // 2️⃣ GET QUIZ ATTEMPTS
    const attempts = await QuizAttempt.find({
      student: studentId,
    }).populate("course");

    const totalAttempts = attempts.length;

    let passCount = 0;
    let failCount = 0;

    attempts.forEach((attempt) => {
      if (attempt.score >= 60) passCount++;
      else failCount++;
    });

    // 3️⃣ GROUP PERFORMANCE BY COURSE
    const courseMap = {};

    attempts.forEach((attempt) => {
      if (!attempt.course) return;

      const courseId = attempt.course._id.toString();

      if (!courseMap[courseId]) {
        courseMap[courseId] = {
          courseId,
          courseTitle: attempt.course.title,
          attempts: 0,
          bestScore: 0,
          totalScore: 0,
          lastAttemptDate: attempt.createdAt,
        };
      }

      courseMap[courseId].attempts += 1;
      courseMap[courseId].totalScore += attempt.score;

      if (attempt.score > courseMap[courseId].bestScore) {
        courseMap[courseId].bestScore = attempt.score;
      }

      if (attempt.createdAt > courseMap[courseId].lastAttemptDate) {
        courseMap[courseId].lastAttemptDate = attempt.createdAt;
      }
    });

    const coursePerformance = Object.values(courseMap).map((course) => {
      const progress = enrolledCourses.find(
        (e) =>
          e.course &&
          e.course._id.toString() === course.courseId
      );

      return {
        courseId: course.courseId,
        courseTitle: course.courseTitle,
        attempts: course.attempts,
        bestScore: course.bestScore,
        averageScore: Math.round(
          course.totalScore / course.attempts
        ),
        lastAttemptDate: course.lastAttemptDate,
        status:
          progress && progress.status === "completed"
            ? "Completed"
            : progress && progress.status === "in-progress"
            ? "In Progress"
            : "Enrolled",
      };
    });

    // 4️⃣ OVERALL AVERAGE SCORE
    let averageScore = 0;

    if (coursePerformance.length > 0) {
      const totalBestScores = coursePerformance.reduce(
        (sum, course) => sum + course.bestScore,
        0
      );

      averageScore = Math.round(
        totalBestScores / coursePerformance.length
      );
    }

    // 5️⃣ RECENT ATTEMPTS
    const recentAttempts = attempts
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    res.json({
      totalEnrolled,
      completedCourses,
      averageScore,
      totalAttempts,
      passCount,
      failCount,
      coursePerformance,
      recentAttempts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ======================================================
// 📊 GET STUDENT DASHBOARD STATS (REAL DATA)
// ======================================================
exports.getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Courses Done
    const coursesDone = await CourseProgress.countDocuments({
      student: studentId,
      status: "completed"
    });

    // 2. Total Assignments Submitted
    const assignmentsSubmitted = await AssignmentSubmission.countDocuments({
      student: studentId
    });

    // 3. Average Quiz Score
    const quizAttempts = await QuizAttempt.find({ student: studentId });
    let avgScore = 0;
    if (quizAttempts.length > 0) {
      const totalScore = quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
      avgScore = Math.round(totalScore / quizAttempts.length);
    }

    res.json({
      coursesDone,
      assignmentsSubmitted,
      avgScore
    });
  } catch (err) {
    console.error("STUDENT DASHBOARD STATS ERROR:", err);
    res.status(500).json({ message: "Server error calculating stats" });
  }
};

// ======================================================
// 📊 GET COURSE ANALYTICS (TEACHER)
// ======================================================
exports.getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId || courseId === "undefined" || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID provided" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 1. Total students enrolled
    const totalStudents = course.enrolledStudents.length;

    // 2. Assignments submitted
    const assignments = await Assignment.find({ course: courseId });
    const assignmentIds = assignments.map(a => a._id);
    const totalSubmissions = await AssignmentSubmission.countDocuments({
      assignment: { $in: assignmentIds },
      status: "submitted"
    });

    // 3. Average quiz score & pass rate
    const quizAttempts = await QuizAttempt.find({ course: courseId });
    const totalAttempts = quizAttempts.length;
    let totalScore = 0;
    let passCount = 0;

    quizAttempts.forEach(attempt => {
      totalScore += attempt.score;
      if (attempt.score >= 60) passCount++;
    });

    const averageQuizScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;
    const quizPassRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;

    // 4. Student performance table
    // We need to fetch progress for each student
    const studentPerformance = await Promise.all(course.enrolledStudents.map(async (studentId) => {
      const student = await User.findById(studentId).select("name email");
      if (!student) return null;

      // Lessons progress
      const progress = await CourseProgress.findOne({ student: studentId, course: courseId });
      const completedLessons = progress ? progress.completedLessons.length : 0;
      const totalLessons = await Lesson.countDocuments({ course: courseId });

      // Assignments status
      const studentSubmissions = await AssignmentSubmission.find({
        student: studentId,
        assignment: { $in: assignmentIds }
      });

      // Quiz score
      const studentAttempts = quizAttempts.filter(a => a.student.toString() === studentId.toString());
      const bestScore = studentAttempts.length > 0 ? Math.max(...studentAttempts.map(a => a.score)) : 0;

      // Status logic: Completed / In Progress / Not Attempted
      let status = "Not Attempted";
      if (progress && progress.status === "completed") {
        status = "Completed";
      } else if (progress && progress.status === "in-progress") {
        status = "In Progress";
      } else if (studentSubmissions.length > 0 || studentAttempts.length > 0 || (progress && progress.completedLessons.length > 0)) {
        status = "Enrolled";
      }

      return {
        student: student.name,
        email: student.email,
        lessons: `${completedLessons}/${totalLessons}`,
        assignments: studentSubmissions.length,
        quizScore: bestScore,
        attempts: studentAttempts.length,
        status
      };
    }));

    res.json({
      totalStudents,
      totalSubmissions,
      averageQuizScore,
      quizPassRate,
      studentPerformance: studentPerformance.filter(s => s !== null)
    });

  } catch (err) {
    console.error("COURSE ANALYTICS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ======================================================
// 🟣 TEACHER DASHBOARD ANALYTICS
// ======================================================
exports.getTeacherAnalytics = async (req, res) => {
  console.log("Teacher Analytics API HIT - User:", req.user?.id);
  try {
    const teacherId = new mongoose.Types.ObjectId(req.user.id);
    const teacherIdStr = req.user.id;

    // 1️⃣ GET TEACHER COURSES (Robust: Match BOTH ObjectId and String)
    const courses = await Course.find({ 
      $or: [
        { teacher: teacherId },
        { teacher: teacherIdStr }
      ]
    });
    const totalCourses = courses.length;

    const fs = require('fs');
    const logData = `[DEBUG] Time: ${new Date().toISOString()}, UserID: ${req.user.id}, Role: ${req.user.role}, Courses Found: ${totalCourses}\n`;
    fs.appendFileSync('server_debug.txt', logData);

    if (totalCourses === 0) {
      const allC = await Course.find({}).limit(5);
      const diagData = `[DIAGNOSE] System has ${await Course.countDocuments()} total courses. Sample Teachers in DB: ${allC.map(c => c.teacher).join(', ')}\n`;
      fs.appendFileSync('server_debug.txt', diagData);
    }
    
    const courseIds = courses.map((course) => course._id);

    // 2️⃣ TOTAL STUDENTS (UNIQUE ENROLLED)
    const uniqueStudents = new Set();
    courses.forEach((course) => {
      course.enrolledStudents.forEach((studentId) => {
        uniqueStudents.add(studentId.toString());
      });
    });
    const totalStudents = uniqueStudents.size;
    const studentIds = Array.from(uniqueStudents).map(id => new mongoose.Types.ObjectId(id));

    // 3️⃣ FETCH RELEVANT CONTENT (Robust: Match BOTH ObjectId and String)
    const totalLessons = await Lesson.countDocuments({ course: { $in: [...courseIds, ...courseIds.map(id => id.toString())] } });
    
    // Assignments
    const assignments = await Assignment.find({ course: { $in: [...courseIds, ...courseIds.map(id => id.toString())] } });
    const totalAssignments = assignments.length;
    const assignmentIds = assignments.map((a) => a._id);
    const assignmentIdsStr = assignmentIds.map(id => id.toString());

    // Submissions (Only for teacher's assignments)
    const submissions = await AssignmentSubmission.find({ assignment: { $in: [...assignmentIds, ...assignmentIdsStr] } });

    // Quizzes (Directly from Quiz model)
    const quizzes = await Quiz.find({ course: { $in: [...courseIds, ...courseIds.map(id => id.toString())] } });
    const quizIds = quizzes.map(q => q._id);

    // QuizAttempts (Strictly for teacher's courses)
    const quizAttempts = await QuizAttempt.find({ 
      course: { $in: [...courseIds, ...courseIds.map(id => id.toString())] } 
    }).populate("student", "name email");

    const totalAttempts = quizAttempts.length;

    // 4️⃣ DEBUG LOGS
    console.log("Analytics Debug Log:");
    console.log("- Teacher ID:", teacherId);
    console.log("- Courses found:", totalCourses);
    console.log("- Unique Students:", totalStudents);
    console.log("- Assignments:", totalAssignments);
    console.log("- Submissions:", submissions.length);
    console.log("- Quizzes:", quizzes.length);
    console.log("- Quiz Attempts:", totalAttempts);

    // 5️⃣ CALCULATE PERFORMANCE METRICS
    
    // Assignment Performance
    const assignmentPerformance = assignments.map((a) => {
      const aSubs = submissions.filter(s => s.assignment.toString() === a._id.toString());
      const graded = aSubs.filter(s => s.status === "graded");
      const avgScore = graded.length > 0 ? Math.round(graded.reduce((acc, curr) => acc + (curr.score || curr.grade || 0), 0) / graded.length) : 0;
      return {
        assignmentName: a.title,
        submissionRate: totalStudents > 0 ? Math.round((aSubs.length / totalStudents) * 100) : 0,
        averageScore: avgScore
      };
    });

    // Quiz Performance (Group by Course Quiz Title or Course Name)
    const quizMap = {};
    quizAttempts.forEach(attempt => {
      // Find matching quiz title if possible
      const qTitle = quizzes.find(q => q.course.toString() === attempt.course?.toString())?.title || "Course Quiz";
      const groupKey = attempt.course?.toString() || 'unknown';
      
      if (!quizMap[groupKey]) {
        quizMap[groupKey] = { name: qTitle, attempts: 0, totalScore: 0 };
      }
      quizMap[groupKey].attempts += 1;
      quizMap[groupKey].totalScore += attempt.score || 0;
    });

    const quizPerformance = Object.values(quizMap).map(q => ({
      quizName: q.name,
      totalAttempts: q.attempts,
      averageScore: q.attempts > 0 ? Math.round(q.totalScore / q.attempts) : 0
    }));

    // Summary Average Score (Average of all filtered quiz attempts)
    let totalQuizScoreSum = 0;
    quizAttempts.forEach(a => totalQuizScoreSum += (a.score || 0));
    const avgQuizScore = totalAttempts > 0 ? Math.round(totalQuizScoreSum / totalAttempts) : 0;
    const averageScore = avgQuizScore;

    // 6️⃣ RECENT ACTIVITY & LEADERBOARD
    
    // Recent Submissions (for dashboard backward compatibility)
    const recentSubmissions = await AssignmentSubmission.find({
      assignment: { $in: assignmentIds },
    })
      .populate("student", "name email")
      .populate({
        path: "assignment",
        populate: { path: "course", select: "title" },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentCourses = await Course.find({ teacher: teacherId }).sort({ createdAt: -1 }).limit(5);

    // Leaderboard (Top students from teacher's courses)
    const allStudents = await User.find({
      _id: { $in: studentIds },
      role: "student",
    }).select("name points email");

    const leaderboard = allStudents.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 10);

    // 7️⃣ ADVANCED INSIGHTS
    
    // At Risk Students
    const atRiskStudents = [];
    allStudents.forEach(student => {
      const sId = student._id.toString();
      const sSubs = submissions.filter(s => s.student && s.student.toString() === sId);
      const sAtts = quizAttempts.filter(a => a.student && a.student.toString() === sId);
      const avgQS = sAtts.length > 0 ? (sAtts.reduce((acc, curr) => acc + (curr.score || 0), 0) / sAtts.length) : 0;

      if (sSubs.length === 0 && sAtts.length === 0) {
        atRiskStudents.push({ name: student.name, reason: "No activity recorded" });
      } else if (avgQS < 50 && sAtts.length > 0) {
        atRiskStudents.push({ name: student.name, reason: `Low quiz average: ${Math.round(avgQS)}%` });
      } else if (sSubs.length === 0 && assignments.length > 0) {
        atRiskStudents.push({ name: student.name, reason: "No assignments submitted" });
      }
    });

    // Engagement Rate (Active students / Total Enrolled)
    const activeStudentIds = new Set([
      ...submissions.map(s => s.student?.toString()),
      ...quizAttempts.map(a => a.student?._id?.toString() || a.student?.toString())
    ]);
    activeStudentIds.delete(undefined);
    const activeStudentsCount = activeStudentIds.size;
    const engagementRate = totalStudents > 0 ? Math.round((activeStudentsCount / totalStudents) * 100) : 0;

    // Final Response
    res.json({
      totalCourses,
      totalStudents,
      totalLessons,
      totalAssignments,
      totalAttempts, // Dashboard expects this at root
      averageScore,
      avgQuizScore, // Dashboard expects this at root
      assignmentInfo: {
        totalSubmissions: submissions.length,
        pending: submissions.filter((s) => s.status === "submitted").length,
        graded: submissions.filter((s) => s.status === "graded").length,
      },
      quizInfo: {
        totalAttempts,
        averageScore: avgQuizScore,
      },
      leaderboard: leaderboard.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        points: user.points || 0,
      })),
      recentCourses,
      recentSubmissions,
      assignmentPerformance,
      quizPerformance,
      topStudents: leaderboard.slice(0, 5).map(u => ({ name: u.name, points: u.points || 0 })),
      atRiskStudents: atRiskStudents.slice(0, 5),
      engagementRate
    });

  } catch (err) {
    console.error("TEACHER ANALYTICS ERROR:", err);
    return res.status(500).json({ message: "Error calculating analytics" });
  }
};

// ======================================================
// 📊 GET ENGAGEMENT ANALYTICS (TEACHER)
// ======================================================
// ======================================================
// 📊 NOTIFY AT RISK STUDENT (TEACHER ACTION)
// ======================================================
exports.notifyAtRiskStudent = async (req, res) => {
  try {
    const { studentId, studentName, reason } = req.body;
    const teacherName = req.user.name || "Your Instructor";

    if (!studentId) {
      return res.status(400).json({ message: "Student ID required" });
    }

    const Notification = require("../models/Notification");

    const message = `Message from ${teacherName}: You need to engage more in your course. (Reason: ${reason})`;

    await Notification.create({
      recipient: studentId,
      message,
      type: "alert",
      link: "/my-courses", // Direct them back to their courses
    });

    res.json({ message: `Notification sent to ${studentName}` });
  } catch (err) {
    console.error("NOTIFY AT RISK ERROR:", err);
    res.status(500).json({ message: "Failed to send notification" });
  }
};

exports.getEngagementAnalytics = async (req, res) => {
  try {
    const teacherId = new mongoose.Types.ObjectId(req.user.id);

    const courses = await Course.find({ teacher: teacherId });
    const courseIds = courses.map(c => c._id);
    if (courseIds.length === 0) return res.json([]);

    const assignments = await Assignment.find({ course: { $in: courseIds } });
    const assignmentIds = assignments.map(a => a._id);

    const submissions = await AssignmentSubmission.find({ 
      assignment: { $in: assignmentIds }
    });

    const attempts = await QuizAttempt.find({ course: { $in: courseIds } });
    if (submissions.length === 0 && attempts.length === 0) return res.json([]);

    const engagementMap = {};

    submissions.forEach(sub => {
      const dateVal = sub.submittedAt || sub.createdAt;
      if (!dateVal) return;
      const date = new Date(dateVal).toISOString().split('T')[0];
      if (!engagementMap[date]) engagementMap[date] = { date, submissions: 0, attempts: 0 };
      engagementMap[date].submissions += 1;
    });

    attempts.forEach(att => {
      const dateVal = att.attemptedAt || att.createdAt;
      if (!dateVal) return;
      const date = new Date(dateVal).toISOString().split('T')[0];
      if (!engagementMap[date]) engagementMap[date] = { date, submissions: 0, attempts: 0 };
      engagementMap[date].attempts += 1;
    });

    const formattedData = Object.values(engagementMap).sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(formattedData);
  } catch (err) {
    console.error("ENGAGEMENT ANALYTICS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};