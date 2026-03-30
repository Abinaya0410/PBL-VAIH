const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const { getPDFContentSummary } = require("../services/aiService");

// =======================
// CREATE LESSON (Teacher)
// =======================
// const createLesson = async (req, res) => {
//   try {
//     const { title, description, contentType, textContent, videoUrl, order } =
//       req.body;
//     const { courseId } = req.params;

//     if (!title || !contentType || order === undefined) {
//       return res.status(400).json({ message: "Required fields missing" });
//     }

//     if (
//       (contentType === "text" && !textContent) ||
//       (contentType === "video" && !videoUrl)
//     ) {
//       return res.status(400).json({ message: "Invalid lesson content" });
//     }

//     const course = await Course.findById(courseId);

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     if (course.teacher.toString() !== req.user.id.toString()) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const lesson = await Lesson.create({
//       title,
//       description,
//       course: courseId,
//       contentType,
//       textContent,
//       videoUrl,
//       order,
//       createdBy: req.user.id,
//     });

//     res.status(201).json(lesson);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// =======================
// HELPERS
// =======================
const generateAISummaryFromPDF = async (pdfFilename) => {
  try {
    const pdfPath = path.join(__dirname, "..", "uploads", pdfFilename);
    console.log("PDF Helper - looking for:", pdfPath);
    if (!fs.existsSync(pdfPath)) {
      console.log("PDF Helper - File NOT found");
      return null;
    }

    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    // Extract first 10000 chars to avoid token limits
    const text = data.text.substring(0, 10000);
    if (!text.trim()) return null;

    return await getPDFContentSummary(text);
  } catch (err) {
    console.error("AI Lesson Summary Helper Error:", err);
    return null;
  }
};

const createLesson = async (req, res) => {
  try {
    const { title, description, textContent, videoUrl, order } = req.body;
    const { courseId } = req.params;

    if (!title || !order) {
      return res.status(400).json({ message: "Title and order are required" });
    }

    if (!textContent && !videoUrl) {
      return res.status(400).json({ message: "Add text or video content" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;
    console.log("Saved PDF:", pdfUrl);

    const lesson = await Lesson.create({
      title,
      description,
      course: courseId,
      textContent,
      videoUrl,
      pdfUrl,
      order,
      createdBy: req.user.id,
    });

    // 🚀 NEW: Generate AI Notes if PDF or text exists
    if (pdfUrl || textContent) {
      (async () => {
        try {
          let summary = null;
          if (pdfUrl) {
            summary = await generateAISummaryFromPDF(req.file.filename);
          } else if (textContent) {
            summary = await getPDFContentSummary(textContent.substring(0, 5000));
          }
          
          if (summary) {
            lesson.aiNotes = summary;
            await lesson.save();
          }
        } catch (aiErr) {
          console.error("Delayed AI Note Generation Failed:", aiErr);
        }
      })();
    }

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// GET LESSONS BY COURSE
// =======================
const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      course: req.params.courseId,
    }).sort({ order: 1 });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// UPDATE LESSON (Teacher)
// =======================
const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (lesson.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(lesson, req.body);
    
    if (req.file) {
      lesson.pdfUrl = `/uploads/${req.file.filename}`;
      console.log("Saved PDF (Update):", lesson.pdfUrl);
    }

    await lesson.save();

    // 🚀 NEW: Regenerate AI Notes if PDF or text updated
    if (req.file || req.body.textContent) {
      (async () => {
        try {
          let summary = null;
          if (req.file) {
            summary = await generateAISummaryFromPDF(req.file.filename);
          } else if (lesson.textContent) {
            summary = await getPDFContentSummary(lesson.textContent.substring(0, 5000));
          }
          
          if (summary) {
            lesson.aiNotes = summary;
            await lesson.save();
          }
        } catch (aiErr) {
          console.error("Delayed AI Note Update Failed:", aiErr);
        }
      })();
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// DELETE LESSON (Teacher)
// =======================
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (lesson.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await lesson.deleteOne();
    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ COMMONJS EXPORT (CRITICAL)
module.exports = {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
};
