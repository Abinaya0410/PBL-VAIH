/**
 * Migration Script: Fix QuizAttempt records missing the `course` field
 *
 * Run once from /server directory:
 *   node scripts/fixQuizAttemptCourse.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const QuizAttempt = require("../models/QuizAttempt");
const Lesson = require("../models/Lesson");

// ─── Configure your MongoDB URI ───────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/lms";
// ──────────────────────────────────────────────────────────────────────────────

async function migrate() {
  await mongoose.connect(MONGO_URI, { family: 4 });
  console.log("✅ Connected to MongoDB");

  // Find all attempts that are missing the course field
  const attempts = await QuizAttempt.find({ course: { $exists: false } });
  console.log(`Found ${attempts.length} QuizAttempt records missing 'course' field.`);

  let fixed = 0;
  let skipped = 0;

  for (const attempt of attempts) {
    if (!attempt.lesson) {
      console.warn(`  ⚠ Attempt ${attempt._id} has no lesson — skipping.`);
      skipped++;
      continue;
    }

    const lesson = await Lesson.findById(attempt.lesson);
    if (!lesson || !lesson.course) {
      console.warn(`  ⚠ Lesson ${attempt.lesson} not found or has no course — skipping attempt ${attempt._id}.`);
      skipped++;
      continue;
    }

    attempt.course = lesson.course;
    await attempt.save();
    console.log(`  ✔ Fixed attempt ${attempt._id} → course: ${lesson.course}`);
    fixed++;
  }

  console.log(`\nMigration complete: ${fixed} fixed, ${skipped} skipped.`);
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
