import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Layout, 
  ChevronRight, 
  Plus,
  Search,
  BookMarked,
  LayoutDashboard
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    console.log("MyCourses Loaded");
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/courses/teacher", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("MyCourses API Response:", data);
      
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error("API Error: Expected array but received:", data);
        setCourses([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = Array.isArray(courses) ? courses.filter(course => 
    course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Loading Repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500">
            <BookMarked size={20}/>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Intellectual Assets</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">My Courses</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic">Manage and refine your instructional course repository.</p>
        </div>

        <button 
          onClick={() => navigate("/create-course")}
          className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.05] transition-all shadow-2xl active:scale-95 shadow-cyan-500/10"
        >
          <Plus size={18}/>
          Initialize New Course
        </button>
      </header>

      {/* Filter Bar */}
      <div className="relative max-w-xl group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Search curriculum nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] pl-16 pr-8 py-5 outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/50 transition-all font-bold text-slate-900 dark:text-white"
        />
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 p-24 rounded-[3rem] text-center flex flex-col items-center shadow-2xl">
           <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-400 dark:text-slate-300 dark:text-slate-700 shadow-inner">
             <LayoutDashboard size={48} />
           </div>
           <h3 className="text-2xl font-black mb-3 uppercase tracking-tight text-slate-900 dark:text-white">Empty Repository</h3>
           <p className="text-slate-500 dark:text-slate-400 font-bold italic opacity-80">You have not deployed any instructional courses yet.</p>
           <button onClick={() => navigate("/create-course")} className="mt-8 text-cyan-500 font-black uppercase text-xs tracking-widest hover:underline">Start Creating →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map((course) => (
            <div 
              key={course._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 flex flex-col shadow-sm h-full"
            >
              <div className="p-6 flex-col flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-lg flex items-center justify-center">
                    <BookOpen size={20}/>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 font-medium leading-relaxed italic opacity-80 h-8">
                    {course.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                   <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Students Enrolled: <span className="text-slate-900 dark:text-white">{course.stats?.students || 0}</span>
                   </p>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/course/${course._id}`)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 py-4 px-6 flex items-center justify-center group/btn hover:bg-slate-900 dark:hover:bg-white transition-all"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/btn:text-white dark:group-hover/btn:text-slate-900 transition-colors">View Course</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}