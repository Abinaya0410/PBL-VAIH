# 📚 Virtual Academic Intelligence Hub

A full-stack Learning Management System (LMS) built using the MERN Stack.  
This platform enables structured digital learning with role-based access, quiz management, analytics tracking, gamification, and AI-assisted doubt support.

---

## 🚀 Project Description

Virtual Academic Intelligence Hub is designed to provide an interactive and structured online learning environment for students and teachers.

The system allows:

- Teachers to create and manage courses
- Students to enroll and complete lessons
- Time-limited quiz assessments
- Performance tracking through analytics
- Engagement using streaks and rewards
- AI-based doubt clarification support

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- JWT (JSON Web Token Authentication)
- Bcrypt (Password Hashing)

### Database
- MongoDB
- Mongoose (ODM - Object Data Modeling)

---

## 🔐 Core Features

### 👩‍🏫 Teacher Module
- Register and Login
- Create Courses
- Add Lessons
- Create Question Banks
- Monitor Student Progress
- View Analytics Dashboard

### 👨‍🎓 Student Module
- Register and Login
- Enroll in Courses
- Complete Lessons
- Unlock Quizzes After Lesson Completion
- Attempt Time-Limited Quizzes (Single Attempt)
- Earn Streak Points and Rewards
- Access AI Doubt Support

---

## 📊 System Highlights

- Role-Based Access Control (RBAC)
- JWT-Based Authentication
- Password Encryption using Bcrypt
- Schema-Based Data Modeling using Mongoose
- Structured Lesson Unlocking Mechanism
- Automatic Quiz Evaluation
- Performance Analytics Tracking
- Gamification (Streak & Rewards System)

---

## 🧠 Database Design

### Main Collections

- Users
- StudentProfile
- TeacherProfile
- Course
- Lesson
- QuestionBank
- LessonCompletion
- QuizAttempt

### Relationships

- One Teacher → Many Courses
- One Course → Many Lessons
- One Lesson → Many Questions
- One Student → Many Quiz Attempts

---

## 🔄 Application Flow

1. User registers as Student or Teacher.
2. Profile details are stored securely.
3. Teacher creates courses and lessons.
4. Student enrolls in courses.
5. Student completes lessons.
6. Quiz unlocks after lesson completion.
7. Student attempts quiz (single attempt, time-bound).
8. System evaluates answers automatically.
9. Score, rewards, and streak updated.
10. Teacher monitors student analytics.

---

## ⚙️ Installation and Setup

### Prerequisites

- Node.js installed
- MongoDB (Local or MongoDB Atlas)
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/virtual-academic-intelligence-hub.git
cd virtual-academic-intelligence-hub
