
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  LogOut,
  GraduationCap,
  Search,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalLessons: 0,
    totalAttempts: 0,
    recentSubmissions: [],
  });

  const [courses, setCourses] = useState([]);
  const storedName = localStorage.getItem("name") || "Teacher";
  const initial = storedName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchAnalytics();
    fetchCourses();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_URL}/api/analytics/teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats({
        totalCourses: data.totalCourses || 0,
        totalStudents: data.totalStudents || 0,
        totalLessons: data.totalLessons || 0,
        totalAttempts: data.totalAttempts || 0,
        recentSubmissions: data.recentSubmissions || [],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_URL}/api/courses/teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!Array.isArray(data)) console.error("Courses API returned non-array:", data);
      setCourses(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-10">
      
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-10 text-white shadow-2xl shadow-cyan-500/20">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight uppercase">Welcome Back, {storedName}</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8 italic">
            {stats.totalStudents > 0 
              ? `Empowering ${stats.totalStudents} students across ${stats.totalCourses} courses.`
              : "Start your teaching journey today by creating your first course."}
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate("/create-course")} className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform active:scale-95">
              Create Course
            </button>
            <button onClick={() => navigate("/teacher/analytics")} className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all">
              Course Analytics
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<BookOpen className="text-cyan-500"/>} label="Live Courses" value={stats.totalCourses} trend="Active" color="cyan" />
        <StatCard icon={<FileText className="text-blue-500"/>} label="Total Lessons" value={stats.totalLessons} trend="Ongoing" color="blue" />
        <StatCard icon={<Users className="text-emerald-500"/>} label="Enrolled Talent" value={stats.totalStudents} trend="Growing" color="emerald" />
        <StatCard icon={<BarChart3 className="text-violet-500"/>} label="Quiz Engagement" value={stats.totalAttempts} trend="Monitored" color="violet" />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* RECENT COURSES */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black uppercase tracking-tight leading-none">My Courses</h3>
            <button onClick={() => navigate("/my-courses")} className="text-cyan-500 font-bold flex items-center gap-1 hover:underline text-xs tracking-widest uppercase">
              My Courses <ArrowUpRight size={14}/>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {courses.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center col-span-2 rounded-3xl">
                <p className="text-slate-500 italic">No courses found in your repository.</p>
              </div>
            ) : (
              courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-cyan-500 group cursor-pointer p-8 relative overflow-hidden h-full flex flex-col justify-between transition-all hover-lift"
                >
                  <div>
                    <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                      <BookOpen size={20}/>
                    </div>
                    <h4 className="text-xl font-black group-hover:text-cyan-500 transition-colors mb-3 line-clamp-1 uppercase tracking-tight">{course.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed mb-6 italic h-10 font-medium">
                      {course.description || "No description available."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-4 border-t border-slate-100 dark:border-slate-800 font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1 text-slate-500"><Clock size={12}/> Last Updated</span>
                    <span className="text-cyan-500">View Course →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* STUDENT ACTIVITY FEED */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black uppercase tracking-tight leading-none">Recent Submissions</h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden h-full flex flex-col shadow-lg">
            {stats.recentSubmissions.length === 0 ? (
              <div className="p-16 text-center flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-300">
                  <FileText size={24}/>
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">No pending submissions</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 overflow-y-auto max-h-[500px]">
                {stats.recentSubmissions.map((sub) => (
                  <div 
                    key={sub._id} 
                    className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition cursor-pointer flex gap-4 group"
                    onClick={() => navigate(`/assignment-submissions/${sub.assignment?._id}`)}
                  >
                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10 border border-indigo-500/20">
                      {sub.student?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-sm uppercase tracking-tight truncate">
                        {sub.student?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 italic font-medium">
                        {sub.assignment?.title}
                      </p>
                      <div className="flex items-center justify-between gap-3 mt-3">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border shadow-sm ${
                          sub.status === 'graded' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {sub.status}
                        </span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-4 group hover-lift shadow-lg">
       <div className={`p-4 bg-${color}-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform shadow-sm`}>
          {icon}
       </div>
       <div>
          <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{label}</h4>
          <div className="flex items-baseline gap-2">
             <span className="text-3xl font-black">{value}</span>
             <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-${color}-500/10 text-${color}-500 border border-${color}-500/20`}>
                {trend}
             </span>
          </div>
       </div>
    </div>
  );
}