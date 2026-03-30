const Assignment = require("../models/Assignment");
const Announcement = require("../models/Announcement");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const User = require("../models/User");
const Course = require("../models/Course");
const Notification = require("../models/Notification");
const QuizAttempt = require("../models/QuizAttempt");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const { evaluateCourseCompletion } = require("../services/completionHelper");

// // ===============================
// // CREATE ASSIGNMENT (Teacher)
// // ===============================

exports.createAssignment = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, description, course, dueDate } = req.body;

    if (!title || !course) {
      return res.status(400).json({
        message: "Title and course are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Assignment PDF is required"
      });
    }

    const pdfUrl = `assignments/${req.file.filename}`;

    const assignment = await Assignment.create({
      title,
      description,
      course,
      dueDate,
      pdfUrl,
      createdBy: req.user.id,
    });

    await Announcement.create({
      course,
      message: `New assignment uploaded: ${title}`,
      type: "assignment",
      createdBy: req.user.id,
    });

    res.status(201).json(assignment);

  } catch (error) {

    console.error("CREATE ASSIGNMENT ERROR:", error);

    res.status(500).json({
      message: "Assignment creation failed"
    });

  }
};
// ===============================
// GET ASSIGNMENTS FOR COURSE
// ===============================
exports.getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
    })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    // if student, also fetch their submissions for these assignments
    if (req.user.role === "student") {
      const submissions = await AssignmentSubmission.find({
        assignment: { $in: assignments.map((a) => a._id) },
        student: req.user.id,
      });

      const assignmentsWithStatus = assignments.map((a) => {
        const submission = submissions.find(
          (s) => s.assignment.toString() === a._id.toString()
        );
        return {
          ...a.toObject(),
          submissionStatus: submission ? submission.status : "not-submitted",
          submission: submission || null,
        };
      });

      return res.json(assignmentsWithStatus);
    }

    res.json(assignments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// STUDENT SUBMIT ASSIGNMENT
// ===============================
exports.submitAssignment = async (req, res) => {
  try {

    const { assignmentId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Submission file required" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // ENFORCE MODULE COMPLETION BEFORE SUBMISSION
    const courseLessons = await Lesson.find({ course: assignment.course }, "_id");
    const totalModules = courseLessons.length;
    
    if (totalModules > 0) {
      const completedModules = await LessonProgress.countDocuments({
        student: req.user.id,
        lesson: { $in: courseLessons.map(l => l._id) },
        completed: true
      });

      if (completedModules < totalModules) {
        return res.status(403).json({
          message: "Please complete all course modules before submitting the assignment."
        });
      }
    }

    const submissionUrl = `assignments/${req.file.filename}`;

    // prevent multiple submissions
    const existing = await AssignmentSubmission.findOne({
      assignment: assignmentId,
      student: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already submitted this assignment",
      });
    }

    const submission = await AssignmentSubmission.create({
      assignment: assignmentId,
      student: req.user.id,
      course: assignment.course, // ✅ Added course ID
      submissionUrl,
    });

    // ✅ Fetch user and course for correct announcement message
    const user = await User.findById(req.user.id);
    const courseObj = await Course.findById(assignment.course);

    // Notify teacher via Announcement (submission type)
    await Announcement.create({
      course: assignment.course,
      message: `Assignment submitted by ${user.name} for ${courseObj.title}`,
      type: "submission",
      createdBy: req.user.id,
    });

    // 🔔 Notify Teacher via Notification System
    await Notification.create({
      recipient: courseObj.teacher,
      message: `New assignment submitted by ${user.name} for ${courseObj.title}`,
      type: "assignment_submitted",
      link: `/teacher/assignment-submissions`
    });

    // 🏆 Award Points (+20 for submission)
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: 20 }
    });

    res.status(201).json(submission);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// TEACHER VIEW SUBMISSIONS
// ===============================
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({
      assignment: req.params.assignmentId,
    })
      .populate("student", "name email")
      .populate("assignment", "title")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// TEACHER VIEW ALL SUBMISSIONS
// ===============================
exports.getTeacherAllSubmissions = async (req, res) => {
  try {
    const teacherCourses = await Course.find({ teacher: req.user.id }).distinct("_id");
    
    const submissions = await AssignmentSubmission.find({
      course: { $in: teacherCourses }
    })
      .populate("student", "name email")
      .populate("assignment", "title")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// GET PENDING SUBMISSIONS COUNT
// ===============================
exports.getPendingSubmissionsCount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error("PENDING COUNT ERROR: User info missing");
      return res.status(401).json({ message: "Authentication required" });
    }

    const teacherCourses = await Course.find({ teacher: req.user.id }).distinct("_id");
    
    // Use $ne: "graded" as suggested for broader coverage
    const count = await AssignmentSubmission.countDocuments({
      course: { $in: teacherCourses },
      status: { $ne: "graded" }
    });

    res.json({ count });
  } catch (error) {
    console.error("PENDING COUNT ERROR (500):", error);
    res.status(500).json({ message: "Server error calculating pending count" });
  }
};

// DELETE ASSIGNMENT
exports.deleteAssignment = async (req, res) => {
  try {

    const assignment = await Assignment.findByIdAndDelete(
      req.params.assignmentId
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    res.json({
      message: "Assignment deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to delete assignment"
    });

  }
};

// ===============================
// TEACHER GRADES ASSIGNMENT
// ===============================
exports.gradeSubmission = async (req, res) => {
  try {

    const { score, feedback } = req.body;

    const submission = await AssignmentSubmission.findByIdAndUpdate(
      req.params.submissionId,
      {
        score,
        feedback,
        status: "graded",
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // 🏆 Award Points (Tiered based on score)
    let pointsToAward = 10;
    if (score >= 90) pointsToAward = 40;
    else if (score >= 70) pointsToAward = 30;
    else if (score >= 50) pointsToAward = 20;

    await User.findByIdAndUpdate(submission.student, {
      $inc: { points: pointsToAward }
    });

    // 🔄 Sync Course Completion & Notify Student
    const assignmentObj = await Assignment.findById(submission.assignment);
    if (assignmentObj) {
      await evaluateCourseCompletion(submission.student, assignmentObj.course);
      
      await Notification.create({
        recipient: submission.student,
        message: `Your assignment '${assignmentObj.title}' has been graded.`,
        type: "assignment_graded",
        link: `/student-course/${assignmentObj.course}`
      });
    }

    res.json(submission);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// CHECK QUIZ UNLOCK
// ===============================
exports.checkQuizUnlock = async (req, res) => {
  try {

    const studentId = req.user.id;
    const courseId = req.params.courseId;

    // find assignment for this course
    const assignment = await Assignment.findOne({ course: courseId });

    // if no assignment exists → quiz unlocked
    if (!assignment) {
      return res.json({ unlocked: true });
    }

    const submission = await AssignmentSubmission.findOne({
      assignment: assignment._id,
      student: studentId,
      status: "graded",
    });

    if (submission) {
      return res.json({ unlocked: true });
    }

    res.json({ unlocked: false });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE ASSIGNMENT
exports.getAssignment = async (req, res) => {

  try {

    const assignment = await Assignment.findById(req.params.id);

    res.json(assignment);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// UPDATE ASSIGNMENT
// exports.updateAssignment = async (req, res) => {

//   try {

//     const { title, description, dueDate } = req.body;

//     const assignment = await Assignment.findByIdAndUpdate(
//       req.params.id,
//       { title, description, dueDate },
//       { new: true }
//     );

//     res.json(assignment);

//   } catch (error) {

//     res.status(500).json({ message: error.message });

//   }

// };
exports.updateAssignment = async (req, res) => {
  try {

    const { title, description, dueDate } = req.body;

    const updateData = {
      title,
      description,
      dueDate
    };

    // if teacher uploads new pdf
    if (req.file) {
      updateData.pdfUrl = `assignments/${req.file.filename}`;
    }

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(assignment);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to update assignment"
    });

  }
};

// ===============================
// TEACHER VIEW ALL QUIZ ATTEMPTS
// ===============================
exports.getTeacherQuizAttempts = async (req, res) => {
  try {
    const teacherCourses = await Course.find({ teacher: req.user.id }).distinct("_id");
    
    const attempts = await QuizAttempt.find({
      course: { $in: teacherCourses }
    })
      .populate("student", "name email")
      .populate("course", "title")
      .populate("lesson", "title")
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};