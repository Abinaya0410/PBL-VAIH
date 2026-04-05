

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("node:dns/promises");
require("dotenv").config();

// =====================
// Routes
// =====================
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const lessonProgressRoutes = require("./routes/lessonProgressRoutes");
const questionBankRoutes = require("./routes/questionBankRoutes");
const moduleQuestionRoutes = require("./routes/moduleQuestionRoutes");
const quizRoutes = require("./routes/quizRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { getTeacherAnalytics } = require("./controllers/analyticsController");
const assignmentRoutes = require("./routes/assignmentRoutes");
const xpRoutes = require("./routes/xpRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const aiRoutes = require("./routes/aiRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
// =====================
// Middleware
// =====================
const authMiddleware = require("./middleware/authMiddleware");
const {
  isStudent,
  isTeacher,
  isAdmin,
} = require("./middleware/roleMiddleware");

// =====================
// Create app
// =====================
const app = express();

// Fix Windows DNS SRV issues (MongoDB Atlas)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// =====================
// Global Middleware
// =====================
app.use(cors({
  origin: [
    "http://localhost:5173", // allow local testing
    process.env.CLIENT_URL  // production frontend (Vercel)
  ],
  credentials: true
}));
app.use(express.json());

// =====================
// Route Middleware
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", lessonRoutes);
app.use("/api", lessonProgressRoutes);
app.use("/api", questionBankRoutes);
app.use("/api", moduleQuestionRoutes);
app.use("/api", quizRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/analytics", analyticsRoutes);
app.get("/api/teacher/analytics", authMiddleware, isTeacher, getTeacherAnalytics);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/xp", xpRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static("uploads"));
// =====================
// Test Routes
// =====================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Protected test route
app.get("/api/test/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

// Student-only route
app.get("/api/test/student", authMiddleware, isStudent, (req, res) => {
  res.json({ message: "Student access granted" });
});

// Teacher-only route
app.get("/api/test/teacher", authMiddleware, isTeacher, (req, res) => {
  res.json({ message: "Teacher access granted" });
});

// Admin-only route
app.get("/api/test/admin", authMiddleware, isAdmin, (req, res) => {
  res.json({ message: "Admin access granted" });
});

// =====================
// Server & DB
// =====================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
