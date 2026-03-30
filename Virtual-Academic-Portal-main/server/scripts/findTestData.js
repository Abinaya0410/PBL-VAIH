const mongoose = require("mongoose");
const path = require("path");
const dns = require("node:dns/promises");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function findData() {
  try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    
    // Define minimal schemas
    const User = mongoose.model('User', new mongoose.Schema({ name: String, email: String, role: String, password: String }));
    const AssignmentSubmission = mongoose.model('AssignmentSubmission', new mongoose.Schema({ 
        status: String, 
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }
    }));
    const Course = mongoose.model('Course', new mongoose.Schema({ title: String, teacher: mongoose.Schema.Types.ObjectId }));
    const Assignment = mongoose.model('Assignment', new mongoose.Schema({ title: String }));

    const teacher = await User.findOne({ role: 'teacher' });
    const submission = await AssignmentSubmission.findOne({ status: { $ne: 'graded' } }).populate('student assignment course');

    console.log('TEACHER:', JSON.stringify(teacher));
    console.log('SUBMISSION:', JSON.stringify(submission));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findData();
