const mongoose = require("mongoose");
const path = require("path");
const dns = require("node:dns/promises");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Models
const Models = {
  Course: require("../models/Course"),
  Lesson: require("../models/Lesson"),
  LessonProgress: require("../models/LessonProgress"),
  CourseProgress: require("../models/CourseProgress"),
  Assignment: require("../models/Assignment"),
  AssignmentSubmission: require("../models/AssignmentSubmission"),
  Quiz: require("../models/Quiz"),
  QuizAttempt: require("../models/QuizAttempt"),
  Announcement: require("../models/Announcement"),
  StudentFeedback: require("../models/StudentFeedback"),
  ModuleQuestion: require("../models/ModuleQuestion"),
  QuestionBank: require("../models/QuestionBank")
};

async function checkCleanup(courseId) {
  try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log("Checking cleanup for Course ID:", courseId);

    const results = {};
    
    results.Course = await Models.Course.exists({ _id: courseId });
    results.Lesson = await Models.Lesson.exists({ course: courseId });
    results.Assignment = await Models.Assignment.exists({ course: courseId });
    results.Quiz = await Models.Quiz.exists({ course: courseId });
    results.Announcement = await Models.Announcement.exists({ course: courseId });
    results.CourseProgress = await Models.CourseProgress.exists({ course: courseId });
    results.AssignmentSubmission = await Models.AssignmentSubmission.exists({ course: courseId });
    results.QuizAttempt = await Models.QuizAttempt.exists({ course: courseId });
    results.StudentFeedback = await Models.StudentFeedback.exists({ course: courseId });

    // Lesson related
    const lessons = await Models.Lesson.find({ course: courseId }).distinct("_id");
    results.LessonProgress = await Models.LessonProgress.exists({ lesson: { $in: lessons } });
    results.ModuleQuestion = await Models.ModuleQuestion.exists({ lesson: { $in: lessons } });
    results.QuestionBank = await Models.QuestionBank.exists({ lesson: { $in: lessons } });

    console.table(results);
    
    const orphansFound = Object.values(results).some(v => v === true);
    if (!orphansFound) {
      console.log("✅ CLEANUP SUCCESSFUL: No related data found.");
    } else {
      console.log("❌ CLEANUP FAILED: Orphans still exist.");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const targetId = process.argv[2];
if (!targetId) {
  console.log("Usage: node checkCleanup.js <courseId>");
  process.exit(1);
}

checkCleanup(targetId);
