const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["assignment_graded", "quiz_completed", "announcement", "general", "assignment_submitted"],
      default: "general",
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // Optional link to a specific page
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
