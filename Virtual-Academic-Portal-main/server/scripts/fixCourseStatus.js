const mongoose = require("mongoose");
const path = require("path");
const dns = require("node:dns/promises");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// models & services
const CourseProgress = require("../models/CourseProgress");
const { evaluateCourseCompletion } = require("../services/completionHelper");

async function fixStatus() {
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
    console.log(`Found ${records.length} records to re-evaluate.`);

    for (const record of records) {
      console.log(`Re-evaluating: Student ${record.student} | Course ${record.course}`);
      try {
        await evaluateCourseCompletion(record.student, record.course);
      } catch (innerErr) {
        console.error(`Failed to fix record ${record._id}:`, innerErr.message);
      }
    }

    console.log("✅ All records re-evaluated and fixed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during fix:", err);
    process.exit(1);
  }
}

fixStatus();
