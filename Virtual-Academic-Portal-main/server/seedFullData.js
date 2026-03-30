const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Course = require("./models/Course");
const Lesson = require("./models/Lesson");
const Quiz = require("./models/Quiz");
const QuizAttempt = require("./models/QuizAttempt");

const seedFullData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log("Connected to MongoDB for full seeding...");

    // 1. Get/Create Test Users
    let teacher = await User.findOne({ email: "teacher@test.com" });
    if (!teacher) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);
        teacher = await User.create({
            name: "Test Teacher",
            email: "teacher@test.com",
            password: hashedPassword,
            role: "teacher",
            mobileNumber: "9876543210",
            profileCompleted: true,
            institutionName: "PBL Academy",
        });
    }

    let student = await User.findOne({ email: "student@test.com" });
    if (!student) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);
        student = await User.create({
            name: "Test Student",
            email: "student@test.com",
            password: hashedPassword,
            role: "student",
            mobileNumber: "8876543210",
            profileCompleted: true,
            collegeName: "PBL College",
        });
    }

    // 2. Create a Course
    let course = await Course.findOne({ title: "Introduction to AI & Gemini" });
    if (!course) {
        course = await Course.create({
            title: "Introduction to AI & Gemini",
            description: "A comprehensive guide to leveraging Large Language Models for academic success.",
            teacher: teacher._id,
            enrolledStudents: [student._id]
        });
        console.log("Course created: Introduction to AI & Gemini");
    }

    // 3. Create a Lesson
    let lesson = await Lesson.findOne({ title: "Module 1: Understanding LLMs" });
    if (!lesson) {
        lesson = await Lesson.create({
            title: "Module 1: Understanding LLMs",
            description: "How Gemini and other models work.",
            course: course._id,
            contentType: "text",
            textContent: "Large Language Models (LLMs) like Gemini are trained on massive datasets to understand and generate human-like text. They can help with summaries, question generation, and answering doubts.",
            order: 1,
            createdBy: teacher._id
        });
        console.log("Lesson created: Module 1");
    }

    // 4. Create a Quiz
    let quiz = await Quiz.findOne({ title: "AI Basics Quiz" });
    if (!quiz) {
        quiz = await Quiz.create({
            title: "AI Basics Quiz",
            course: course._id,
            questions: [
                {
                    question: "What does LLM stand for?",
                    options: ["Large Language Model", "Low Level Memory", "Logic Learning Machine", "Legacy Layer Module"],
                    correctAnswer: "Large Language Model"
                },
                {
                    question: "Which company developed Gemini?",
                    options: ["Microsoft", "Google", "Meta", "OpenAI"],
                    correctAnswer: "Google"
                }
            ],
            createdBy: teacher._id
        });
        console.log("Quiz created: AI Basics");
    }

    // 5. Create a Quiz Attempt (for Analysis testing)
    let attempt = await QuizAttempt.findOne({ student: student._id, course: course._id });
    if (!attempt) {
        attempt = await QuizAttempt.create({
            student: student._id,
            course: course._id,
            score: 50,
            correctCount: 1,
            wrongCount: 1,
            timeSpent: 30,
            answers: [
                {
                    question: "What does LLM stand for?",
                    options: ["Large Language Model", "Low Level Memory", "Logic Learning Machine", "Legacy Layer Module"],
                    selectedAnswer: "Large Language Model",
                    correctAnswer: "Large Language Model",
                    isCorrect: true
                },
                {
                    question: "Which company developed Gemini?",
                    options: ["Microsoft", "Google", "Meta", "OpenAI"],
                    selectedAnswer: "Microsoft",
                    correctAnswer: "Google",
                    isCorrect: false
                }
            ]
        });
        console.log("Quiz Attempt created for Student (so they can test AI analysis!)");
    }

    console.log("Full data seeding complete! You are ready to test.");
  } catch (err) {
    console.error("Full Seeding Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedFullData();
