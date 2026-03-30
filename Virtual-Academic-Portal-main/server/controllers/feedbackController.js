const StudentFeedback = require("../models/StudentFeedback");
const Announcement = require("../models/Announcement");

// ===============================
// SEND FEEDBACK (Teacher to Student)
// ===============================
exports.sendFeedback = async (req, res) => {
  try {
    const { student, course, message } = req.body;
    const teacherId = req.user.id;

    if (!student || !course || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await StudentFeedback.create({
      teacher: teacherId,
      student,
      course,
      message,
    });

    // Also create an announcement for the student to see
    // We might need to adjust the Announcement model or just use a generic one
    // But the prompt says students should see feedback in announcements area
    await Announcement.create({
      course,
      message: `New Feedback from teacher: ${message}`,
      type: "general",
      createdBy: teacherId,
      targetStudent: student,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("SEND FEEDBACK ERROR:", error);
    res.status(500).json({ message: "Failed to send feedback" });
  }
};

// ===============================
// GET STUDENT FEEDBACK
// ===============================
exports.getStudentFeedback = async (req, res) => {
  try {
    const studentId = req.user.id;
    const feedbacks = await StudentFeedback.find({ student: studentId })
      .populate("teacher", "name")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    console.error("GET FEEDBACK ERROR:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

exports.getCourseFeedbackForTeacher = async (req, res) => {
    try {
      const { courseId } = req.params;
      const feedbacks = await StudentFeedback.find({ course: courseId })
        .populate("student", "name email")
        .sort({ createdAt: -1 });
  
      res.json(feedbacks);
    } catch (error) {
      console.error("GET COURSE FEEDBACK ERROR:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  };
