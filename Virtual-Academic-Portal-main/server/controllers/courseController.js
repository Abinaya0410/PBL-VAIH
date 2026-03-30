const mongoose = require("mongoose");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const CourseProgress = require("../models/CourseProgress");
const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Announcement = require("../models/Announcement");
const User = require("../models/User");

// =======================
// CREATE COURSE (Teacher)
// =======================
const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.create({
      title,
      description,
      teacher: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET ALL COURSES (Student - exclude enrolled)
// =======================
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      enrolledStudents: { $ne: req.user.id }
    }).populate("teacher", "name email");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// STUDENT ENROLL COURSE
// =======================
const enrollCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const studentId = req.user.id;
    const isAlreadyEnrolled = course.enrolledStudents.some(
      (sId) => sId.toString() === studentId.toString()
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.enrolledStudents.push(studentId);
    await course.save();

    // 🆕 INITIALIZE COURSE PROGRESS (STATUS = ENROLLED)
    await CourseProgress.findOneAndUpdate(
      { student: studentId, course: id },
      { 
        status: "enrolled", 
        progress: 0, 
        completed: false 
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// TEACHER VIEW OWN COURSES
// =======================
const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ 
      $or: [
        { teacher: req.user.id },
        { teacher: new mongoose.Types.ObjectId(req.user.id) }
      ]
    }).populate("teacher", "name email");

    console.log(`[DEBUG] Teacher Courses: Found ${courses.length} courses for teacher ${req.user.id}`);

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const cId = course._id;
        const cIdStr = course._id.toString();
        
        const lessonsCount = await Lesson.countDocuments({ course: { $in: [cId, cIdStr] } });
        const assignmentsCount = await Assignment.countDocuments({ course: { $in: [cId, cIdStr] } });
        const quizzesCount = await Quiz.countDocuments({ course: { $in: [cId, cIdStr] } });
        
        return {
          ...course.toObject(),
          stats: {
            students: course.enrolledStudents.length,
            modules: lessonsCount,
            assignments: assignmentsCount,
            quizzes: quizzesCount
          }
        };
      })
    );

    res.json(coursesWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// UPDATE COURSE (Teacher)
// =======================
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    course.title = title || course.title;
    course.description = description || course.description;

    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// DELETE COURSE (Teacher)
// =======================
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🏆 --- POINT DEDUCTION LOGIC ---
    // We need to find all students who earned points in this course and deduct them.
    const enrolledStudents = course.enrolledStudents;

    for (const studentId of enrolledStudents) {
      let totalPointsToDeduct = 0;

      // 1. Lesson Points (10 per lesson)
      const lessons = await Lesson.find({ course: id }).distinct("_id");
      const completedLessonsCount = await LessonProgress.countDocuments({
        student: studentId,
        lesson: { $in: lessons },
        completed: true
      });
      totalPointsToDeduct += (completedLessonsCount * 10);

      // 2. Assignment Points (20 for submission + tiered grading)
      const submissions = await AssignmentSubmission.find({
        student: studentId,
        course: id
      });

      for (const sub of submissions) {
        totalPointsToDeduct += 20; // submission points
        if (sub.status === "graded") {
          const score = sub.score;
          if (score >= 90) totalPointsToDeduct += 40;
          else if (score >= 70) totalPointsToDeduct += 30;
          else if (score >= 50) totalPointsToDeduct += 20;
          else totalPointsToDeduct += 10;
        }
      }

      // 3. Quiz Points (10 for start + completion bonus)
      const quizAttempts = await QuizAttempt.find({
        student: studentId,
        course: id
      });

      for (const attempt of quizAttempts) {
        totalPointsToDeduct += 10; // start points
        if (attempt.score !== undefined) {
          const percentage = (attempt.score / 20) * 100;
          if (percentage >= 90) totalPointsToDeduct += 50;
          else if (percentage >= 70) totalPointsToDeduct += 40;
          else if (percentage >= 50) totalPointsToDeduct += 25;
          else totalPointsToDeduct += 10;
        }
      }

      // Perform deduction
      if (totalPointsToDeduct > 0) {
        await User.findByIdAndUpdate(studentId, {
          $inc: { points: -totalPointsToDeduct }
        });
      }
    }

    // 🧹 --- CASCADE DELETION ---
    
    // 1️⃣ Delete Announcements
    await Announcement.deleteMany({ course: id });

    // 2️⃣ Delete Quiz Attempts
    await QuizAttempt.deleteMany({ course: id });

    // 3️⃣ Delete Quizzes
    const Quiz = require("../models/Quiz");
    await Quiz.deleteMany({ course: id });

    // 4️⃣ Delete Assignment Submissions
    await AssignmentSubmission.deleteMany({ course: id });

    // 5️⃣ Delete Assignments
    await Assignment.deleteMany({ course: id });

    // 6️⃣ Delete Lesson Progress
    const lessonIds = await Lesson.find({ course: id }).distinct("_id");
    await LessonProgress.deleteMany({ lesson: { $in: lessonIds } });

    // 7️⃣ Delete Lessons
    await Lesson.deleteMany({ course: id });

    // 8️⃣ Delete Course Progress
    await CourseProgress.deleteMany({ course: id });

    // 9️⃣ Delete Additional Models
    const StudentFeedback = require("../models/StudentFeedback");
    const ModuleQuestion = require("../models/ModuleQuestion");
    const QuestionBank = require("../models/QuestionBank");

    await StudentFeedback.deleteMany({ course: id });
    await ModuleQuestion.deleteMany({ lesson: { $in: lessonIds } });
    await QuestionBank.deleteMany({ lesson: { $in: lessonIds } });

    // 🔟 Finally, Delete the Course
    await course.deleteOne();

    res.json({ message: "Course and all related data deleted successfully, points deducted from students." });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET STUDENT ENROLLED COURSES
// =======================
const getEnrolledCourses = async (req, res) => {
  try {
    const courseProgressRecords = await CourseProgress.find({
      student: req.user.id,
    });

    const courses = await Course.find({
      enrolledStudents: req.user.id
    }).populate("teacher", "name email");

    const coursesWithProgress = courses.map((course) => {
      const progressRecord = courseProgressRecords.find(
        (r) => r.course.toString() === course._id.toString()
      );

      return {
        ...course.toObject(),
        progress: progressRecord ? progressRecord.progress : 0,
        status: progressRecord ? progressRecord.status : "enrolled",
        completed: progressRecord ? progressRecord.completed : false,
      };
    });

    res.json(coursesWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET STUDENT COMPLETED COURSES
// =======================
const getCompletedCourses = async (req, res) => {
  try {
    const completedCourses = await CourseProgress.find({
      student: req.user.id,
      status: "completed"
    }).populate({
      path: "course",
      populate: { path: "teacher", select: "name email" }
    });

    res.json(completedCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const Announcement = require("../models/Announcement");
    const announcements = await Announcement.find({
      course: req.params.courseId,
    })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAnnouncements = async (req, res) => {
  try {
    const Announcement = require("../models/Announcement");
    const Course = require("../models/Course");
    
    const enrolledCourses = await Course.find({
      enrolledStudents: req.user.id
    }).distinct("_id");

    const announcements = await Announcement.find({
      course: { $in: enrolledCourses }
    })
      .populate("createdBy", "name")
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompletedCourseReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Fetch Best Quiz Score
    const bestQuizAttempt = await QuizAttempt.findOne({ 
      course: courseId, 
      student: studentId 
    }).sort({ score: -1 });

    // Fetch ALL Graded Assignment Scores for this student in this course
    const gradedSubmissions = await AssignmentSubmission.find({
      course: courseId,
      student: studentId,
      status: "graded"
    });

    let assignmentScore = null;
    if (gradedSubmissions.length > 0) {
      const totalScore = gradedSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0);
      assignmentScore = Math.round(totalScore / gradedSubmissions.length);
    } else {
      // Check if any assignments even exist for this course
      const totalCourseAssignments = await Assignment.countDocuments({ course: courseId });
      if (totalCourseAssignments === 0) {
        assignmentScore = "No assignments";
      } else {
        assignmentScore = 0; // Default to 0 if assignments exist but none are graded
      }
    }

    res.json({
      courseTitle: course.title,
      quizScore: bestQuizAttempt ? bestQuizAttempt.score : 0,
      assignmentScore: assignmentScore,
      completionDate: bestQuizAttempt ? bestQuizAttempt.createdAt : new Date(),
      status: "Course Successfully Completed"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  enrollCourse,
  getTeacherCourses,
  getEnrolledCourses,
  getCompletedCourses,
  updateCourse,
  deleteCourse,
  getAnnouncements,
  getMyAnnouncements,
  getCompletedCourseReview
};