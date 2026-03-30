const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    contentType: {
      type: String,
      enum: ["text", "video"],
      
    },

    textContent: {
      type: String,
    },

    videoUrl: {
      type: String,
    },

    pdfUrl: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aiNotes: {
      type: String, // AI-generated summary/notes from PDF
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
