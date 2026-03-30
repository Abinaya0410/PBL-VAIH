
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Search, Filter, BookOpen, User, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function AvailableCourses() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const storedName = localStorage.getItem("name") || "Student";
  const initial = storedName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAvailableCourses(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCourses();
  }, []);

  const confirmEnroll = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/courses/enroll/${selectedCourse._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Enrollment failed");
      }

      // Remove the course from Explore Courses after successful enrollment
      setAvailableCourses(prev => 
        prev.filter(c => c._id !== selectedCourse._id)
      );

      setSelectedCourse(null);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredCourses = availableCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 space-y-8">
      
      <div className="max-w-6xl mx-auto space-y-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Available Opportunities</h2>
              <p className="text-[var(--secondary)] font-medium">Expand your knowledge with our premium curated courses.</p>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <div className="inline-flex p-4 bg-indigo-500/10 rounded-3xl mb-6">
                  <BookOpen size={48} className="text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Courses Found</h3>
                <p className="text-[var(--secondary)]">We couldn't find any courses matching your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <div key={course._id} className="glass-card overflow-hidden hover-lift">
                    <div className="h-40 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 bg-grid-white/5 mask-image-linear-gradient"></div>
                       <BookOpen size={40} className="text-indigo-500 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {course.category && (
                        <div className="flex justify-between items-start">
                          <span className="bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                            {course.category}
                          </span>
                        </div>
                      )}

                      <h3 className="text-xl font-black group-hover:text-indigo-500 transition-colors uppercase tracking-tight leading-tight">
                        {course.title}
                      </h3>

                      <p className="text-sm text-[var(--secondary)] line-clamp-2 leading-relaxed h-10 font-medium italic">
                        {course.description}
                      </p>

                      <div className="pt-4 flex items-center justify-between gap-4 border-t border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                             <User size={14} className="text-slate-500" />
                          </div>
                          <span className="text-xs font-bold text-[var(--secondary)]">{course.teacher?.name || 'Top Instructor'}</span>
                        </div>
                        
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="flex items-center gap-2 py-2 px-4 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 font-black uppercase tracking-widest text-[10px]"
                        >
                          Enroll Now <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>

      {/* ENROLLMENT CONFIRMATION DIALOG */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setSelectedCourse(null)}
          ></div>
          <div className="relative glass-card bg-white dark:bg-slate-900 max-w-md w-full p-10 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Confirm Enrollment</h3>
              <p className="text-sm text-[var(--secondary)] font-medium italic">
                Are you sure you want to enroll in <span className="text-indigo-500 font-bold">"{selectedCourse.title}"</span>? 
                This will add the course to your learning dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmEnroll}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
              >
                Confirm & Start Learning
              </button>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-[var(--secondary)] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}