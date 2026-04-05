import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  BookOpen, 
  FileText, 
  Bell, 
  CheckCircle, 
  Lock, 
  Play, 
  ChevronRight, 
  GraduationCap,
  Clock,
  ArrowRight,
  ChevronLeft,
  Layout,
  Star,
  Trophy,
  Award,
  Search
} from "lucide-react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

export default function StudentCourseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [assignmentStatus, setAssignmentStatus] = useState({ unlocked: false, message: "" });
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const courseRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const currentCourse = courseRes.data.find(c => c._id === id);
      setCourse(currentCourse);

      if (currentCourse && currentCourse.completed) {
        fetchAchievementDetails();
      }

      await Promise.all([
        fetchLessons(),
        fetchAnnouncements(),
        checkAssignmentStatus()
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievementDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/quiz-attempts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const courseAttempts = res.data.filter(a => a.course?._id === id);
      if (courseAttempts.length > 0) {
        const bestAttempt = courseAttempts.reduce((prev, curr) => (prev.score > curr.score ? prev : curr));
        setAchievement(bestAttempt);
      }
    } catch (err) {
      console.error("Error fetching achievement:", err);
    }
  };

  const fetchLessons = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}/lessons`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLessons(res.data);
    await checkAllProgress(res.data);
  };

  const fetchAnnouncements = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}/announcements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAnnouncements(res.data);
  };

  const checkAllProgress = async (lessonList) => {
    let count = 0;
    const updatedLessons = [];
    
    for (let lesson of lessonList) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/lessons/${lesson._id}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        updatedLessons.push({
          ...lesson,
          completed: !!res.data.completed
        });
        
        if (res.data.completed) count++;
      } catch (err) {
        console.error(`Error checking progress for lesson ${lesson._id}:`, err);
        updatedLessons.push({
          ...lesson,
          completed: false
        });
      }
    }
    
    setLessons(updatedLessons);
    setCompletedCount(count);
  };

  const checkAssignmentStatus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/assignments/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const assignmentsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/assignments/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const courseAssignments = assignmentsRes.data;
      const hasAssignment = courseAssignments.length > 0;
      
      let msg = "";
      if (!hasAssignment) {
        msg = "No assignments required.";
      } else {
        const submission = courseAssignments.find(a => a.submissionStatus !== 'not-submitted');
        if (!submission) {
          msg = "Pending assignment submission.";
        } else if (submission.submissionStatus === 'submitted') {
          msg = "Grading in progress.";
        } else if (submission.submissionStatus === 'graded') {
          msg = "Assignment graded & approved.";
        }
      }

      setAssignmentStatus({
        unlocked: res.data.unlocked,
        message: msg
      });
    } catch (err) {
      console.error(err);
    }
  };

  const allLessonsCompleted = lessons.length > 0 && completedCount === lessons.length;
  const quizUnlocked = allLessonsCompleted && assignmentStatus.unlocked;
  const progressPercent = Math.round((completedCount/lessons.length)*100) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] animate-pulse">Checking Permissions...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-card p-16 max-w-md w-full space-y-8 border-dashed border-2 flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-3xl flex items-center justify-center shadow-inner">
             <Lock size={40} />
          </div>
          <div className="space-y-2">
             <h3 className="text-2xl font-black uppercase tracking-tight">Access Restricted</h3>
             <p className="text-sm text-gray-600 dark:text-gray-500 italic leading-relaxed">
               You must enroll in this course first to access its curriculum and learning materials.
             </p>
          </div>
          <button 
            onClick={() => navigate("/available-courses")}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
          >
            Go to Explore Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 lg:p-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/student-dashboard')}
              className="flex items-center gap-2 text-primary hover:translate-x-1 transition-all font-black uppercase tracking-widest text-[10px]"
            >
              <ChevronLeft size={16} />
              Back to Dashboard
            </button>
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">Learning Path</span>
                  {course?.completed && (
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-pulse">
                      <CheckCircle size={10} />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Course Completed</span>
                    </div>
                  )}
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">{course?.title || "Course Content"}</h1>
               <p className="text-[var(--secondary)] font-bold italic flex items-center gap-2 text-sm opacity-80">
                 <GraduationCap size={16}/> {course?.completed ? "Domain fully mastered. Certification verified." : "Master all modules to unlock final certification."}
               </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* LESSONS LIST */}
            <section className="space-y-6">
              <h3 className="text-xl font-black uppercase tracking-widest text-indigo-500">Modules</h3>
              <div className="space-y-4">
                {lessons.map((lesson, idx) => (
                  <div 
                    key={lesson._id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 border-l-4 border-l-indigo-500 rounded-3xl flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between group cursor-pointer hover:border-indigo-400 hover:-translate-y-1 transition-all shadow-lg"
                    onClick={() => navigate(`/student-lesson/${lesson._id}`)}
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                          {idx + 1}
                        </div>
                        {lesson.completed && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 animate-in zoom-in duration-300">
                            <CheckCircle size={12} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                          {lesson.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold italic line-clamp-1">{lesson.description}</p>
                      </div>
                    </div>
                    
                    <button className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Play size={16} className="ml-1"/>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* FINAL ASSESSMENT OR ACHIEVEMENT BOX */}
            {course?.completed ? (
              <section className="bg-white dark:bg-slate-900 border-2 border-emerald-500/30 p-10 rounded-[3rem] relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-transparent shadow-2xl shadow-emerald-500/10 group/achievement">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover/achievement:opacity-10 transition-opacity">
                   <Award size={160} className="text-emerald-500" />
                </div>
                
                <div className="relative z-10 space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-widest text-[10px]">
                      <Award size={16} /> Achievement Unlocked
                    </div>
                    <h3 className="text-4xl font-black uppercase tracking-tight leading-none text-slate-900 dark:text-white">Academic Excellence</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold italic opacity-80 max-w-lg">You have successfully mastered this domain. Your academic record has been updated with your final performance metrics.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Final Grade</p>
                       <p className="text-4xl font-black text-emerald-500">{achievement?.score || 100}%</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Completion Date</p>
                       <p className="text-lg font-black text-slate-900 dark:text-white">{achievement ? new Date(achievement.createdAt).toLocaleDateString() : 'Today'}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Validation</p>
                       <p className="text-[10px] font-black uppercase tracking-tight text-emerald-500">Verified System</p>
                    </div>
                  </div>

                  <button
                    onClick={() => achievement && navigate(`/quiz-attempt-review/${achievement._id}`)}
                    className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-500 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Search size={18} /> Review Quiz Performance
                  </button>
                </div>
              </section>
            ) : (
              <section className="glass-card p-10 border-2 border-indigo-500/20 relative overflow-hidden group/assessment">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover/assessment:opacity-10 transition-opacity">
                   <Trophy size={160} className="text-indigo-500" />
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 mb-10 relative z-10 text-center sm:text-left">
                   <div className="space-y-3">
                      <h3 className="text-3xl font-black uppercase tracking-[0.05em] leading-none">Final Quiz</h3>
                      <p className="text-sm text-[var(--secondary)] font-bold italic opacity-80">Unlock the certification exam to validate your mastery of this sector.</p>
                   </div>
                   <div className={`p-5 rounded-[2rem] shadow-2xl transition-all duration-700 ${quizUnlocked ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-[var(--background)] border border-[var(--border)] text-gray-300 shadow-inner'}`}>
                      {quizUnlocked ? <CheckCircle size={32}/> : <Lock size={32}/>}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 relative z-10">
                   <RequirementItem 
                      done={allLessonsCompleted} 
                      label="Module Completion" 
                      text={allLessonsCompleted ? "All Modules Finished" : `${lessons.length - completedCount} Modules Remaining`} 
                   />
                   <RequirementItem 
                      done={assignmentStatus.unlocked} 
                      label="Assignment Status" 
                      text={assignmentStatus.message} 
                   />
                </div>

                <button
                  disabled={!quizUnlocked}
                  onClick={() => navigate(`/quiz-instructions/${id}`)}
                  className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all relative z-10 overflow-hidden group/btn ${
                    quizUnlocked 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-2xl shadow-indigo-500/40 hover:-translate-y-1 active:scale-95' 
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-500 dark:text-gray-400 cursor-not-allowed italic'
                  }`}
                >
                  {quizUnlocked ? (
                    <span className="flex items-center justify-center gap-3">
                       <Star size={18} fill="white"/> Start Final Quiz
                    </span>
                  ) : "Locked (Complete Requirements)"}
                </button>
              </section>
            )}
          </div>

          {/* SIDEBAR WIDGETS */}
          <aside className="space-y-8">
            
            {/* PROGRESS BOX */}
            <div className="glass-card p-8 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-3">
                 <Layout size={16}/> Progress Overview
               </h4>
               <div className="space-y-5">
                  <div className="flex justify-between items-end">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] opacity-60">Course Progress</span>
                     <span className="text-2xl font-black text-indigo-500">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--background)] border border-[var(--border)] rounded-full overflow-hidden p-0.5">
                     <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-indigo-500/20" style={{ width: `${progressPercent}%` }}></div>
                  </div>
               </div>
            </div>

            {/* ASSIGNMENT WIDGET */}
            <div className="glass-card p-8 space-y-6 relative overflow-hidden group/portal">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/portal:rotate-12 transition-transform">
                  <FileText size={48}/>
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-3">
                 <FileText size={16}/> Assignments
               </h4>
               <p className="text-xs text-[var(--secondary)] font-bold italic leading-relaxed opacity-80">View and submit assignments for this course.</p>
               <button 
                  onClick={() => navigate(`/student-assignments/${id}`)}
                  className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all group/link shadow-xl"
               >
                 View Assignments
                 <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform duration-500"/>
               </button>
            </div>

            {/* ANNOUNCEMENTS */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 px-2 flex items-center gap-3">
                 <Bell size={16}/> Announcements
               </h4>
               <div className="space-y-4">
                 {announcements.length === 0 ? (
                   <div className="glass-card p-8 text-center border-dashed border">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500 dark:text-gray-400 italic">No announcements yet</p>
                   </div>
                 ) : (
                   announcements.slice(0, 3).map((ann, i) => (
                     <div key={i} className="glass-card p-5 border-l-4 border-l-indigo-600 hover:translate-x-1 transition-transform duration-500 shadow-md">
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{ann.type || 'Notice'}</span>
                        </div>
                        <p className="text-xs font-bold leading-relaxed italic opacity-90">"{ann.message}"</p>
                        <p className="text-[8px] font-black text-gray-600 dark:text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-3 text-right">Sent by Instructor</p>
                     </div>
                   ))
                 )}
               </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}

function RequirementItem({ done, label, text }) {
  return (
    <div className={`p-6 rounded-3xl border flex items-center gap-4 transition-all duration-500 ${
      done ? 'bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'bg-[var(--background)] border-[var(--border)] shadow-inner'
    }`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-700 ${
        done ? 'bg-emerald-500 text-white rotate-3 scale-110' : 'bg-[var(--card)] text-gray-300'
      }`}>
        <CheckCircle size={18}/>
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-500 dark:text-gray-400 leading-none mb-1.5">{label}</p>
        <p className={`text-xs font-black uppercase tracking-tight truncate ${done ? 'text-emerald-500' : 'text-gray-600 dark:text-gray-500'}`}>{text}</p>
      </div>
    </div>
  );
}
