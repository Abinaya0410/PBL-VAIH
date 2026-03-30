// const mongoose = require("mongoose");

// const courseProgressSchema = new mongoose.Schema(
//   {
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },

//     completed: {
//       type: Boolean,
//       default: false,
//     },

//     completedAt: {
//       type: Date,
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("CourseProgress", courseProgressSchema);



const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    progress: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["enrolled", "in-progress", "completed"],
      default: "enrolled",
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseProgress", courseProgressSchema);