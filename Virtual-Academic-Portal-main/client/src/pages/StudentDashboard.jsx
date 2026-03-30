
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  LogOut, 
  Search, 
  Bell, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  BarChart3
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    coursesDone: 0,
    assignmentsSubmitted: 0,
    avgScore: 0
  });
  const storedName = localStorage.getItem("name") || "Student";

  useEffect(() => {
    fetchEnrolledCourses();
    fetchAnnouncements();
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/analytics/student-stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data && !data.message) {
        setDashboardStats(data);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/courses/my-announcements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAnnouncements(data);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/courses/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-12">
      
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-white shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight">Keep up the momentum, {storedName}! 🚀</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8 font-medium italic opacity-90">
            Keep pushing towards your goals!
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate("/my-courses-student")} className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform active:scale-95">
              Continue Learning
            </button>
            <button onClick={() => navigate("/available-courses")} className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all">
              Browse New
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <StatCard
          icon={<CheckCircle className="text-emerald-500"/>}
          label="Courses Done"
          value={dashboardStats?.coursesDone || 0}
          trend="Real-time"
          color="emerald"
        />
        <StatCard
          icon={<LayoutDashboard className="text-indigo-500"/>}
          label="Assignments Submitted"
          value={dashboardStats?.assignmentsSubmitted || 0}
          trend="Total"
          color="indigo"
        />
        <StatCard
          icon={<BarChart3 className="text-blue-500"/>}
          label="Avg Score"
          value={dashboardStats?.avgScore || 0}
          unit="pts"
          trend="Overall"
          color="blue"
        />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* CONTINUE LEARNING */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black">Current Progress</h3>
            <button onClick={() => navigate("/my-courses-student")} className="text-indigo-500 font-bold flex items-center gap-1 hover:underline text-sm">
              My Classroom <ArrowUpRight size={14}/>
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-10 text-center text-slate-500 dark:text-slate-400 italic">Preparing your curriculum...</div>
            ) : courses.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl text-center text-slate-500 font-medium border-dashed border-2">
                {courses.length > 0 ? "You've mastered all active courses!" : "Navigate to discovery to begin your learning journey."}
              </div>
            ) : (
              courses
                .filter(c => c.status !== "completed")
                .slice(0, 3)
                .map(course => (
                  <CourseProgressCard
                    key={course._id}
                    title={course.title}
                    progress={course.progress || 0}
                    nextLesson="Continue where you left off"
                    instructor={course.teacher?.name || "Expert Teacher"}
                    onClick={() => navigate(`/student-course/${course._id}`)}
                  />
                ))
            )}
          </div>
        </div>

        {/* UPCOMING DEADLINES / ANNOUNCEMENTS */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black uppercase tracking-tight leading-none">ANNOUNCEMENTS</h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl h-full flex flex-col gap-6 overflow-y-auto max-h-[400px] shadow-lg hover-lift">
            {loadingAnnouncements ? (
              <div className="text-center text-gray-600 dark:text-gray-500 italic py-10">Searching for updates...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-500 italic py-10">No new announcements</div>
            ) : (
              announcements.map((ann) => (
                <div key={ann._id} className="flex gap-4 group cursor-pointer border-b border-[var(--border)] pb-6 last:border-0">
                  <div className={`w-10 h-10 ${ann.type === 'assignment' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'} rounded-xl flex items-center justify-center shrink-0`}>
                    {ann.type === 'assignment' ? <Clock size={20}/> : <CheckCircle size={20}/>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{ann.type || 'Notice'}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1 italic font-medium">{ann.message}</p>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Node: {ann.course?.title || 'System'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, trend, color }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl flex items-center gap-5 hover-lift group transition-colors duration-300">
      <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 bg-${color}-500/10`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-500">{label}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white">{value}</h3>
          {unit && (
            <span className={`text-base font-bold text-${color}-600 dark:text-${color}-400`}>{unit}</span>
          )}
          <span className={`text-[9px] font-bold mb-1.5 px-1.5 py-0.5 rounded-md bg-${color}-500/10 text-${color}-500 ml-2`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function CourseProgressCard({ title, progress, nextLesson, instructor, onClick }) {
  return (
    <div onClick={onClick} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] group cursor-pointer hover:border-indigo-500 transition-all active:scale-[0.99] shadow-md hover-lift">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <h4 className="text-lg font-bold group-hover:text-indigo-500 transition-colors">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-500 font-medium">Instructor: {instructor}</p>
          <div className="pt-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-1.5">
              <span>Next: {nextLesson}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-[var(--background)] border border-[var(--border)] rounded-full overflow-hidden">
               <div 
                 className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                 style={{ width: `${progress}%` }}
               ></div>
            </div>
          </div>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-colors shrink-0">
          Resume Course
        </button>
      </div>
    </div>
  );
}