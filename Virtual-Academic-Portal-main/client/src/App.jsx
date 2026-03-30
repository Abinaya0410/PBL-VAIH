
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentOnboarding from "./pages/StudentOnboarding";
import TeacherOnboarding from "./pages/TeacherOnboarding";
import CreateCourse from "./pages/CreateCourse";
import MyCourses from "./pages/MyCourses";
import CourseBuilder from "./pages/CourseBuilder";
import AddLesson from "./pages/AddLesson";
import EditLesson from "./pages/EditLesson";
import UploadQuestions from "./pages/UploadQuestions";
import LessonDetails from "./pages/LessonDetails";
import CreateQuiz from "./pages/CreateQuiz";
import StudentCourses from "./pages/StudentCourses";
import AvailableCourses from "./pages/AvailableCourses";
import StudentCourseView from "./pages/StudentCourseView";
import MyCoursesStudent from "./pages/MyCoursesStudent";
import StudentLessonView from "./pages/StudentLessonView";
import AttemptQuiz from "./pages/AttemptQuiz";
import QuizInstructions from "./pages/QuizInstructions";
import CompletedCourses from "./pages/CompletedCourses";
import QuizAttempts from "./pages/QuizAttempts";
import Profile from "./pages/Profile";
import EditQuestion from "./pages/EditQuestion";
import StudentAnalytics from "./pages/StudentAnalytics";
import QuizAttemptReview from "./pages/QuizAttemptReview";
import AddAssignment from "./pages/AddAssignment";
import EditAssignment from "./pages/EditAssignment";
import AssignmentSubmissions from "./pages/AssignmentSubmissions";
import StudentAssignments from "./pages/StudentAssignments";
import CompletedCourseReview from "./pages/CompletedCourseReview";
import LearnerXP from "./pages/Student/LearnerXP";
import { ThemeProvider } from "./context/ThemeContext";
import StudentLayout from "./layouts/StudentLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import ThemeToggle from "./components/ThemeToggle";
import CourseAnalytics from "./pages/CourseAnalytics";
import TeacherAnalytics from "./pages/TeacherAnalytics";
import CompleteProfile from "./pages/CompleteProfile";
import NotFound from "./pages/NotFound";
import AIQuestionGenerator from "./pages/Teacher/AIQuestionGenerator";
import AIChatbot from "./components/AIChatbot";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/";
  const isQuizPage = location.pathname.startsWith("/attempt-quiz") || location.pathname.startsWith("/quiz-instructions");

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        
        <Route path="/student-onboarding" element={<StudentOnboarding />} />
        <Route path="/teacher-onboarding" element={<TeacherOnboarding />} />
        
        {/* DYNAMIC PROFILE ROUTE (Resolves Collision) */}
        <Route 
          path="/profile" 
          element={
            localStorage.getItem("role") === "teacher" 
            ? <TeacherLayout /> 
            : <StudentLayout />
          }
        >
          <Route index element={<Profile />} />
        </Route>

        {/* TEACHER PORTAL LAYOUT */}
        <Route 
          element={
            localStorage.getItem("role") === "teacher" 
            ? <TeacherLayout /> 
            : <Login /> // Fallback or redirect logic in AppContent handles this
          }
        >
          <Route path="/teacher" element={
            localStorage.getItem("role") === "teacher" 
            ? <TeacherDashboard /> 
            : <Login />
          } />
          <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/course/:id" element={<CourseBuilder />} />
          <Route path="/teacher/course/:id" element={<CourseBuilder />} />
          <Route path="/add-lesson/:id" element={<AddLesson />} />
          <Route path="/edit-lesson/:lessonId" element={<EditLesson />} />
          <Route path="/upload-questions/:lessonId" element={<UploadQuestions />} />
          <Route path="/create-quiz/:courseId" element={<CreateQuiz />} />
          <Route path="/edit-question/:questionId" element={<EditQuestion />} />
          <Route path="/add-assignment/:id" element={<AddAssignment />} />
          <Route path="/edit-assignment/:id" element={<EditAssignment/>}/>
          <Route path="/assignment-submissions/:id?" element={<AssignmentSubmissions/>}/>
          <Route path="/teacher/submissions" element={<AssignmentSubmissions/>}/>
          <Route path="/teacher/course/:courseId/analytics" element={<CourseAnalytics />} />
          <Route path="/teacher/ai-questions" element={<AIQuestionGenerator />} />
          <Route path="/analytics" element={<TeacherDashboard />} />
        </Route>

        {/* STUDENT PORTAL LAYOUT */}
        <Route 
          element={
            localStorage.getItem("role") === "student" 
            ? <StudentLayout /> 
            : <Login />
          }
        >
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-courses" element={<StudentCourses />} />
          <Route path="/available-courses" element={<AvailableCourses />} />
          <Route path="/my-courses-student" element={<MyCoursesStudent />} />
          <Route path="/completed-courses" element={<CompletedCourses />} />
          <Route path="/quiz-attempts" element={<QuizAttempts />} />
          <Route path="/learner-xp" element={<LearnerXP />} />
          <Route path="/student-analytics" element={<StudentAnalytics />} />
        </Route>

        {/* SPECIAL PAGES */}
        <Route path="/lesson-details/:lessonId" element={<LessonDetails />} />
        <Route path="/student-course/:id" element={<StudentCourseView />} />
        <Route path="/student-lesson/:lessonId" element={<LessonDetails />} />
        <Route path="/attempt-quiz/:courseId" element={<AttemptQuiz />} />
        <Route path="/quiz-instructions/:courseId" element={<QuizInstructions />} />
        <Route path="/quiz-attempt/:attemptId" element={<QuizAttemptReview />} />
        <Route path="/student-assignments/:courseId" element={<StudentAssignments/>}/>
        <Route path="/completed-course/:courseId" element={<CompletedCourseReview />} />

        {/* FALLBACK */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAuthPage && !isQuizPage && <AIChatbot />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
