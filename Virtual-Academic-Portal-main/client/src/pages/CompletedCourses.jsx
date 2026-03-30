
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Award, 
  ArrowRight 
} from "lucide-react";

export default function CompletedCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  const fetchCompletedCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/courses/my-completed", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (err) {
      console.error("Error fetching completed courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.course && c.course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tight leading-none text-emerald-500">Completed Courses</h2>
          <p className="text-[var(--secondary)] font-bold italic opacity-80">Your successfully finished learning paths and certifications.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">Gathering Intel...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="glass-card p-20 text-center border-dashed border-2 flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center shadow-inner">
               <Award size={40} />
            </div>
            <div>
               <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No Certifications Yet</h3>
               <p className="text-sm text-gray-600 dark:text-gray-500 italic max-w-sm">Complete all lessons and pass the final quiz in a course to see it here.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((item) => (
              <div 
                key={item.course?._id}
                className="glass-card p-8 group hover:border-emerald-500 transition-all hover:-translate-y-2 flex flex-col h-full bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10"
              >
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
                      <CheckCircle size={24} />
                   </div>
                   <Award className="text-emerald-500 opacity-20" size={32} />
                </div>

                <div className="flex-1 space-y-3 mb-8">
                   <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-emerald-500 transition-colors leading-tight">{item.course?.title}</h3>
                </div>

                <div className="space-y-4 pt-6 mt-auto">
                   <button 
                     onClick={() => navigate(`/completed-course/${item.course?._id}`)}
                     className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-500 transition-all transform group-active:scale-95 flex items-center justify-center gap-2"
                   >
                     Review Course <ArrowRight size={14} />
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