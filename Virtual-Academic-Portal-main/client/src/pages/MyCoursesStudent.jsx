
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  ArrowUpRight, 
  Clock, 
  GraduationCap 
} from "lucide-react";

export default function MyCoursesStudent() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const storedName = localStorage.getItem("name") || "Student";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/courses/my", {
        headers: { Authorization: `Bearer ${token}` }
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

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && c.status !== "completed";
  });

  return (
    <div className="p-8 lg:p-12 space-y-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Your Active Learning</h2>
          <p className="text-[var(--secondary)] font-bold italic opacity-80">Track your progress and continue your educational journey.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">Syncing with HQ...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="glass-card p-20 text-center border-dashed border-2 flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-3xl flex items-center justify-center shadow-inner">
               <BookOpen size={40} />
            </div>
            <div>
               <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No Active Courses</h3>
               <p className="text-sm text-gray-600 dark:text-gray-500 italic max-w-sm">
                 {courses.length > 0 
                   ? "Everything is complete! Check your certificates in the Completed section." 
                   : "You haven't enrolled in any courses yet. Visit the Explore page to get started."}
               </p>
            </div>
            <button 
              onClick={() => navigate("/available-courses")}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all font-black uppercase tracking-widest text-[10px]"
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div 
                key={course._id}
                onClick={() => navigate(`/student-course/${course._id}`)}
                className="glass-card p-8 group cursor-pointer hover:border-indigo-500 transition-all hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                      <GraduationCap size={24} />
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500 dark:text-gray-400">Progress</p>
                      <p className="text-xl font-black text-indigo-500">{course.progress || 0}%</p>
                   </div>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                   <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-indigo-500 transition-colors leading-tight">{course.title}</h3>
                   <p className="text-xs text-gray-600 dark:text-gray-500 font-bold italic line-clamp-2 leading-relaxed opacity-80">{course.description}</p>
                </div>

                <div className="space-y-6 pt-6 border-t border-[var(--border)]">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5"><Clock size={12}/> ACTIVE</span>
                      <span className="text-indigo-500">{course.progress || 0}%</span>
                   </div>
                   <div className="h-2 w-full bg-[var(--background)] border border-[var(--border)] rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                   </div>
                   <button className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-active:scale-95 flex items-center justify-center gap-2">
                      Resume Course <ArrowUpRight size={14} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}