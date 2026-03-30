const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    submissionUrl: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
    },

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);