const LessonProgress = require("../models/LessonProgress");
const User = require("../models/User");
const Lesson = require("../models/Lesson");
const { evaluateCourseCompletion } = require("../services/completionHelper");

// =======================
// MARK LESSON COMPLETED
// =======================
const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user.id;

    const progress = await LessonProgress.findOneAndUpdate(
      { student: studentId, lesson: lessonId },
      {
        completed: true,
        completedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // 🏆 Award Points (+10 per lesson)
    await User.findByIdAndUpdate(studentId, {
      $inc: { points: 10 }
    });

    // 🔄 Sync Course Completion
    const lesson = await Lesson.findById(lessonId);
    if (lesson) {
      await evaluateCourseCompletion(studentId, lesson.course);
    }

    res.json({
      message: "Lesson marked as completed (+10 points)",
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET LESSON PROGRESS
// =======================
const getLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user.id;

    const progress = await LessonProgress.findOne({
      student: studentId,
      lesson: lessonId,
    });

    res.json({
      completed: progress ? progress.completed : false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  completeLesson,
  getLessonProgress,
};
