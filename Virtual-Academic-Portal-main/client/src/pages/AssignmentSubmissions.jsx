import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  ChevronLeft, 
  Trophy,
  Search,
  BookOpen,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import axios from "axios";

export default function AssignmentSubmissions() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assignments"); // 'assignments' or 'quizzes'
  const [viewLevel, setViewLevel] = useState("hub"); // 'hub', 'courses', 'details'
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const [submissions, setSubmissions] = useState([]);
  const [quizActivity, setQuizActivity] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [gradingId, setGradingId] = useState(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const [subsRes, quizRes, coursesRes] = await Promise.all([
        axios.get(`${API_URL}/api/assignments/teacher/all`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/teacher/activity`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/courses/teacher`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      if (!Array.isArray(subsRes.data)) {
        console.error("Submissions API returned non-array:", subsRes.data);
      }
      setSubmissions(Array.isArray(subsRes.data) ? subsRes.data : []);
      
      if (!Array.isArray(quizRes.data)) {
        console.error("Quiz activity API returned non-array:", quizRes.data);
      }
      setQuizActivity(Array.isArray(quizRes.data) ? quizRes.data : []);
      
      if (!Array.isArray(coursesRes.data)) {
        console.error("Courses API returned non-array:", coursesRes.data);
      }
      setTeacherCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      
    } catch (err) {
      console.error(err);
      setError("Failed to fetch academic data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId) => {
    if (!score || isNaN(score) || score < 0 || score > 100) {
      setError("Enter numeric score (0-100)");
      return;
    }
    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      await axios.put(`${API_URL}/api/assignments/grade/${submissionId}`, {
        score: Number(score),
        feedback
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Grade saved");
      setScore("");
      setFeedback("");
      setGradingId(null);
      fetchData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Grading failed.");
    }
  };

  const resetView = () => {
    setViewLevel("hub");
    setSelectedCourse(null);
    setSearchTerm("");
  };

  if (loading && viewLevel === "hub") {
    return (
      <div className="p-8 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        Synchronizing...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
        <div>
          {viewLevel !== "hub" && (
            <button onClick={() => viewLevel === "details" ? setViewLevel("courses") : setViewLevel("hub")} className="flex items-center gap-1 text-cyan-600 hover:underline text-[10px] font-black uppercase tracking-widest mb-1">
              <ChevronLeft size={14} /> Back to {viewLevel === "details" ? "Courses" : "Hub"}
            </button>
          )}
          <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Task Management</h1>
        </div>
        
        {viewLevel !== "hub" && (
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" size={12} />
            <input 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold outline-none focus:border-cyan-500"
            />
          </div>
        )}
      </div>

      {message && <p className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 p-2 rounded-lg">{message}</p>}
      {error && <p className="text-[10px] font-black text-rose-600 uppercase bg-rose-50 p-2 rounded-lg">{error}</p>}

      {/* HUB LEVEL */}
      {viewLevel === "hub" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <HubCard 
            icon={<FileText size={32} />} 
            title="Assignments" 
            desc="Review and grade student PDF submissions"
            count={submissions.filter(s => s.status === 'submitted').length}
            onClick={() => { setActiveTab("assignments"); setViewLevel("courses"); }}
          />
          <HubCard 
            icon={<Trophy size={32} />} 
            title="Quiz Activity" 
            desc="Monitor student quiz performance and pass rates"
            count={quizActivity.length}
            onClick={() => { setActiveTab("quizzes"); setViewLevel("courses"); }}
          />
        </div>
      )}

      {/* COURSE LIST LEVEL */}
      {viewLevel === "courses" && (
        <div className="space-y-3">
          <h2 className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4">Select a {activeTab === 'assignments' ? 'Course' : 'Quiz'} to review</h2>
          <div className="grid gap-2">
            {teacherCourses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map(course => {
              const count = activeTab === 'assignments' 
                ? submissions.filter(s => s.course?._id === course._id && s.status === 'submitted').length
                : quizActivity.filter(q => q.course?._id === course._id).length;

              return (
                <button 
                  key={course._id}
                  onClick={() => { setSelectedCourse(course); setViewLevel("details"); }}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-cyan-500 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 transition-colors">
                      <BookOpen size={20} />
                    </div>
                    <div className="text-left flex items-center gap-3">
                      <p className="text-base font-black text-slate-800 dark:text-slate-100 uppercase leading-none">{course.title}</p>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-black ${count > 0 ? 'bg-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                        {count}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 dark:text-slate-400 dark:text-slate-300 group-hover:text-cyan-500" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILS LEVEL */}
      {viewLevel === "details" && selectedCourse && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-cyan-600 text-white text-[10px] font-black uppercase rounded-lg">
                {activeTab === 'assignments' ? 'Assignment Monitor' : 'Quiz Metrics'}
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedCourse.title}</h2>
            </div>
          </div>

          {activeTab === 'assignments' ? (
            <div className="space-y-12">
              <AssignmentTable 
                title="Ungraded Assignments"
                list={submissions.filter(s => s.course?._id === selectedCourse._id && s.status !== 'graded' && (s.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.assignment?.title?.toLowerCase().includes(searchTerm.toLowerCase())))}
                isGraded={false}
                gradingId={gradingId}
                setGradingId={setGradingId}
                score={score}
                setScore={setScore}
                feedback={feedback}
                setFeedback={setFeedback}
                handleGrade={handleGrade}
              />
              <AssignmentTable 
                title="Graded Assignments"
                list={submissions.filter(s => s.course?._id === selectedCourse._id && s.status === 'graded' && (s.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.assignment?.title?.toLowerCase().includes(searchTerm.toLowerCase())))}
                isGraded={true}
                gradingId={gradingId}
                setGradingId={setGradingId}
                score={score}
                setScore={setScore}
                feedback={feedback}
                setFeedback={setFeedback}
                handleGrade={handleGrade}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Full Quiz Activity Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left py-3 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-4">Student</th>
                      <th className="text-left py-3 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Quiz Title</th>
                      <th className="text-center py-3 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Score</th>
                      <th className="text-right py-3 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pr-4">Attempt Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {quizActivity.filter(q => q.course?._id === selectedCourse._id && (q.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || q.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()))).map(q => (
                      <tr key={q._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-[10px] text-slate-500 dark:text-slate-400 uppercase">{q.student?.name?.charAt(0)}</div>
                            <span className="text-base font-bold text-slate-800 dark:text-slate-200">{q.student?.name}</span>
                          </div>
                        </td>
                        <td className="py-4">
                           <span className="text-[10px] font-black text-slate-500 uppercase">{q.course?.title} {q.lesson ? `- ${q.lesson.title}` : 'Final Quiz'}</span>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${q.score >= 60 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{q.score}%</span>
                        </td>
                        <td className="py-4 text-right text-[10px] font-bold text-slate-500 dark:text-slate-400 pr-4">{new Date(q.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HubCard({ icon, title, desc, count, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-start p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-cyan-500 transition-all text-left group">
      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 transition-colors mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
        {title}
        {count > 0 && <span className="bg-cyan-600 text-white text-[9px] px-2 py-0.5 rounded-full">{count}</span>}
      </h3>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 italic">{desc}</p>
    </button>
  );
}

function AssignmentTable({ title, list, isGraded, gradingId, setGradingId, score, setScore, feedback, setFeedback, handleGrade }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 dark:text-slate-300">{list.length} Records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left pb-4 text-[9px] font-black text-slate-500 dark:text-slate-400 dark:text-slate-300 uppercase tracking-widest pl-4">Student</th>
              <th className="text-left pb-4 text-[9px] font-black text-slate-500 dark:text-slate-400 dark:text-slate-300 uppercase tracking-widest">Assignment</th>
              {isGraded ? (
                <>
                  <th className="text-center pb-4 text-[9px] font-black text-slate-500 dark:text-slate-400 dark:text-slate-300 uppercase tracking-widest">Grade</th>
                  <th className="text-left pb-4 text-[9px] font-black text-slate-500 dark:text-slate-400 dark:text-slate-300 uppercase tracking-widest">Feedback</th>
                </>
              ) : (
                <>
                  <th className="text-center pb-4 text-[9px] font-black text-slate-500 dark:text-slate-400 dark:text-slate-300 uppercase tracking-widest">Submitted</th>
                  <th className="text-center pb-4 text-[9px] font-black text-slate-500 dark:text-slate-400 dark:text-slate-300 uppercase tracking-widest">Action</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {list.map(sub => (
              <tr key={sub._id} className="group">
                <td className="py-3 pl-4">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">{sub.student?.name}</span>
                </td>
                <td className="py-3">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{sub.assignment?.title}</span>
                </td>
                {isGraded ? (
                  <>
                    <td className="py-3 text-center">
                      <span className="text-sm font-black text-cyan-600">{sub.score}%</span>
                    </td>
                    <td className="py-3">
                      <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400 italic max-w-xs truncate">"{sub.feedback || 'No remarks'}"</p>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-2">
                        <a 
                          href={`${import.meta.env.VITE_API_URL}/uploads/${sub.submissionUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-slate-500 dark:text-slate-400 dark:text-slate-300 hover:text-cyan-500 transition-colors"
                        >
                          <Download size={14} />
                        </a>
                        <button 
                          onClick={() => setGradingId(sub._id)}
                          className="bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm hover:scale-105 transition-transform"
                        >
                          Grade
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={isGraded ? 4 : 4} className="py-8 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400 italic">
                  No records matching search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {gradingId && list.some(s => s._id === gradingId) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
             <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-4 py-2 border-b">Grade Assessment</h4>
             <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Numeric Score (0-100)</label>
                  <input 
                    type="number" 
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xl font-black outline-none focus:border-cyan-500"
                    placeholder="00"
                  />
               </div>
               <div>
                  <label className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Strategic Feedback</label>
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-cyan-500 h-24"
                    placeholder="Remarks..."
                  />
               </div>
               <div className="flex gap-2">
                 <button onClick={() => handleGrade(gradingId)} className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">Update Grade</button>
                 <button onClick={() => setGradingId(null)} className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors">Cancel</button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}