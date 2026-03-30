
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Trophy, 
  Calendar, 
  ChevronRight, 
  ArrowLeft,
  BookOpen
} from "lucide-react";

export default function QuizAttempts() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const token = localStorage.getItem("token");

  const fetchAttempts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/quiz-attempts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttempts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, [token]);

  // Group attempts by course
  const grouped = attempts.reduce((acc, attempt) => {
    const title = attempt.course?.title || "Unknown Course";
    if (!acc[title]) acc[title] = [];
    acc[title].push(attempt);
    return acc;
  }, {});

  const fetchCourseAttempts = async (courseId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/quiz-attempts/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // We can update the grouped data or just show these attempts
      // Since 'grouped' is derived from 'attempts', we should update 'attempts' or handle it separately
      // The user wants: "When a course is selected, display all quiz attempts for that course."
      // Actually, if we already have all attempts, we don't strictly NEED another fetch,
      // but the user's Step 3 explicitly asks for GET /api/quiz-attempts/course/:courseId.
      // So I will update the local state with the fetched attempts for that course.
      setAttempts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (title) => {
    setSelectedCourse(title);
    const courseId = grouped[title][0].course?._id;
    if (courseId) {
      fetchCourseAttempts(courseId);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    fetchAttempts();
  };

  const courseTitles = Object.keys(grouped).filter(key => 
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 space-y-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {selectedCourse ? (
          <button 
            onClick={handleBackToCourses}
            className="flex items-center gap-2 text-indigo-500 font-bold hover:translate-x-1 transition-transform uppercase tracking-widest text-[10px]"
          >
            <ArrowLeft size={16} /> Back to Courses
          </button>
        ) : null}

        <div className="space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tight leading-none">
            {selectedCourse ? selectedCourse : "Quiz Attempts"}
          </h2>
          <p className="text-[var(--secondary)] font-bold italic opacity-80">
            {selectedCourse ? "Detailed history for this course." : "Select a course to view your quiz history."}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] animate-pulse">Loading Archives...</p>
          </div>
        ) : attempts.length === 0 ? (
          <div className="glass-card p-20 text-center border-dashed border-2 flex flex-col items-center gap-6">
             <div className="w-16 h-16 bg-[var(--background)] border border-[var(--border)] rounded-3xl flex items-center justify-center text-gray-300 shadow-inner">
                <Trophy size={32} />
             </div>
             <div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-1">No Attempts</h3>
                <p className="text-xs text-[var(--secondary)] font-bold italic">You haven't attempted any quizzes yet.</p>
             </div>
          </div>
        ) : !selectedCourse ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseTitles.map(title => (
              <div 
                key={title}
                onClick={() => handleCourseClick(title)}
                className="glass-card p-8 group cursor-pointer hover:border-indigo-500/50 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-indigo-500 transition-colors text-[var(--foreground)]">{title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-500 font-bold">{grouped[title].length} Attempts Recorded</p>
                <div className="mt-8 flex items-center gap-2 text-indigo-500 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  View History <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {grouped[selectedCourse].map((attempt, index) => (
              <div
                key={attempt._id}
                onClick={() => navigate(`/quiz-attempt/${attempt._id}`)}
                className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer hov border-transparent hover:border-indigo-500 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[var(--background)] border border-[var(--border)] rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-600 transition-all">
                    <Trophy size={24} className={attempt.score >= 60 ? 'text-amber-500' : 'text-gray-300'}/>
                  </div>
                  <div>
                    <p className="font-black text-lg uppercase tracking-tight group-hover:text-indigo-500 text-[var(--foreground)]">Attempt #{grouped[selectedCourse].length - index}</p>
                    <p className="text-[10px] font-bold text-gray-600 dark:text-gray-500 uppercase flex items-center gap-1">
                      <Calendar size={12}/> {new Date(attempt.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center hidden sm:block">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1">Score</p>
                    <div className="h-1.5 w-24 bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border)]">
                      <div 
                        className={`h-full ${attempt.score >= 60 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${attempt.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-black leading-none ${attempt.score >= 60 ? 'text-emerald-500' : 'text-rose-500'}`}>{attempt.score}%</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${attempt.score >= 60 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {attempt.score >= 60 ? 'Passed' : 'Failed'}
                    </p>
                  </div>
                  <div className="p-2 bg-indigo-500/5 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <ChevronRight size={20}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}