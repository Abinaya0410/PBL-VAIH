
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

// Setup paths for models
const QuizAttempt = require('./server/models/QuizAttempt');
const Quiz = require('./server/models/Quiz');
const Course = require('./server/models/Course');
const Assignment = require('./server/models/Assignment');
const AssignmentSubmission = require('./server/models/AssignmentSubmission');
const User = require('./server/models/User');
const Lesson = require('./server/models/Lesson');

async function testAnalytics() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find a teacher
    const teacher = await User.findOne({ role: 'teacher' });
    if (!teacher) {
      console.log("❌ No teacher found in database");
      process.exit(0);
    }
    console.log(`Testing for teacher: ${teacher.name} (${teacher._id})`);

    const req = { 
      user: { id: teacher._id.toString() } 
    };
    
    const res = {
      json: (data) => {
        console.log("\n✅ Success Response Received");
        // console.log(JSON.stringify(data, null, 2));
        console.log("Engagement Rate:", data.engagementRate + "%");
        console.log("Assignment Performance items:", data.assignmentPerformance.length);
        console.log("Quiz Performance items:", data.quizPerformance.length);
        console.log("Top Students count:", data.topStudents.length);
        console.log("At Risk Students count:", data.atRiskStudents.length);
      },
      status: (code) => ({ 
        json: (data) => console.log(`❌ Error ${code}:`, data) 
      })
    };

    const { getTeacherAnalytics } = require('./server/controllers/analyticsController');
    
    console.log("\nCalling getTeacherAnalytics...");
    await getTeacherAnalytics(req, res);

  } catch (err) {
    console.error("❌ Test failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

testAnalytics();
