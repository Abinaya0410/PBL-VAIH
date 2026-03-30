const mongoose = require('mongoose');
const dns = require('node:dns/promises');
require('dotenv').config();

// Fix Windows DNS SRV issues (MongoDB Atlas)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Models
const AssignmentSubmissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  submissionUrl: String
}, { strict: false });

const AssignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
}, { strict: false });

const AssignmentSubmission = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);
const Assignment = mongoose.model('Assignment', AssignmentSchema);

async function repair() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const submissions = await AssignmentSubmission.find({});
    console.log(`Total submissions: ${submissions.length}`);

    let updatedCount = 0;
    for (const sub of submissions) {
      let needsUpdate = false;
      const updateData = {};

      // 1. Fix missing course
      if (!sub.course && sub.assignment) {
        const assignment = await Assignment.findById(sub.assignment);
        if (assignment && assignment.course) {
          updateData.course = assignment.course;
          needsUpdate = true;
          console.log(`Setting course for submission ${sub._id}`);
        }
      }

      // 2. Fix absolute paths in submissionUrl
      if (sub.submissionUrl && sub.submissionUrl.includes("server/uploads/")) {
        const parts = sub.submissionUrl.split("server/uploads/");
        if (parts.length > 1) {
          updateData.submissionUrl = parts[1];
          needsUpdate = true;
          console.log(`Cleaning path for submission ${sub._id}: ${updateData.submissionUrl}`);
        }
      } else if (sub.submissionUrl && sub.submissionUrl.includes("\\uploads\\")) {
         const parts = sub.submissionUrl.split("\\uploads\\");
         if (parts.length > 1) {
             updateData.submissionUrl = parts[1].replace(/\\/g, '/');
             needsUpdate = true;
             console.log(`Cleaning windows path for submission ${sub._id}: ${updateData.submissionUrl}`);
         }
      }

      if (needsUpdate) {
        await AssignmentSubmission.findByIdAndUpdate(sub._id, updateData);
        updatedCount++;
      }
    }

    console.log(`Repair complete. ${updatedCount} submissions updated.`);
    process.exit(0);
  } catch (err) {
    console.error("Repair failed:", err);
    process.exit(1);
  }
}

repair();
