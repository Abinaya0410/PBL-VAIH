const mongoose = require("mongoose");
const path = require("path");
const dns = require("node:dns/promises");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Models
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");

async function validate() {
  try {
    // Fix Windows DNS SRV issues
    dns.setServers(["1.1.1.1", "8.8.8.8"]);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in .env");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("✅ Connected to MongoDB");

    const records = await CourseProgress.find({});
    console.log(`Analyzing ${records.length} records...\n`);

    let issuesCount = 0;
    const studentCourseMap = new Map();

    for (const record of records) {
      const studentId = record.student.toString();
      const courseId = record.course.toString();
      const key = `${studentId}-${courseId}`;

      // 1. Check for duplicates
      if (studentCourseMap.has(key)) {
        console.error(`❌ DUPLICATE: Student ${studentId} has multiple records for Course ${courseId}`);
        issuesCount++;
      } else {
        studentCourseMap.set(key, record._id);
      }

      // 2. Check status vs progress consistency
      if (record.status === "completed" && record.progress < 100) {
        console.error(`❌ INCONSISTENCY: Record ${record._id} is "completed" but progress is ${record.progress}%`);
        issuesCount++;
      }

      if (record.progress === 100 && record.status !== "completed") {
        console.error(`❌ INCONSISTENCY: Record ${record._id} is ${record.progress}% but status is "${record.status}"`);
        issuesCount++;
      }

      // 3. Check progress bounds
      if (record.progress < 0 || record.progress > 100) {
        console.error(`❌ INVALID PROGRESS: Record ${record._id} has progress ${record.progress}%`);
        issuesCount++;
      }

      // 4. Verify Orphan records (optional but good)
      const studentExists = await User.exists({ _id: record.student });
      const courseExists = await Course.exists({ _id: record.course });

      if (!studentExists) {
        console.error(`❌ ORPHAN: Record ${record._id} references non-existent Student ${studentId}`);
        issuesCount++;
      }
      if (!courseExists) {
        console.error(`❌ ORPHAN: Record ${record._id} references non-existent Course ${courseId}`);
        issuesCount++;
      }
    }

    if (issuesCount === 0) {
      console.log("\n✅ ALL CHECKS PASSED. SYSTEM IS VALID.");
    } else {
      console.log(`\n⚠️ FOUND ${issuesCount} ISSUES. NEEDS MANUAL ATTENTION.`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Validation Error:", err);
    process.exit(1);
  }
}

validate();
