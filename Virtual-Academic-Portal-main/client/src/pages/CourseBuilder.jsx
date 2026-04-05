
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Plus, 
  FileText, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  Trash2, 
  Edit3, 
  Eye, 
  Users,
  GraduationCap,
  Layout,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function CourseBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourse();
    fetchLessons();
    fetchAssignments();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/teacher`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const current = data.find((c) => c._id === id);
      setCourse(current);
    } catch (err) {
      console.log("Course error:", err);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}/lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      console.log("Lesson fetch error:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAssignments(data);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      console.log("Assignment fetch error:", err);
    }
  };

  const viewAssignment = (pdfUrl) => {
    if (!pdfUrl) {
      alert("No file found");
      return;
    }
    const cleanPath = pdfUrl.includes("assignments/") ? pdfUrl : `assignments/${pdfUrl}`;
    const fileUrl = `${import.meta.env.VITE_API_URL}/uploads/${cleanPath}`;
    window.open(fileUrl, "_blank");
  };

  const deleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments/${assignmentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      setAssignments(assignments.filter(a => a._id !== assignmentId));
      setMessage("Assignment removed from curriculum");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.log("Delete assignment error:", err);
    }
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lessons/${lessonId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete lesson failed");
      setLessons(lessons.filter(l => l._id !== lessonId));
      setMessage("Lesson deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.log("Delete lesson error:", err);
    }
  };

  const deleteCourse = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Delete course failed");
      }

      setToast({ isOpen: true, message: "Course deleted successfully", type: "success" });
      setTimeout(() => navigate("/my-courses"), 2000);
    } catch (err) {
      console.error("Delete course error:", err);
      setToast({ isOpen: true, message: err.message, type: "error" });
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-12">
      
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/my-courses')}
              className="flex items-center gap-1 text-indigo-500 hover:text-indigo-400 transition-all font-bold uppercase tracking-widest text-[10px]"
            >
              <ChevronLeft size={14} />
              Back to Courses
            </button>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight uppercase text-slate-900 dark:text-white">
                {course ? course.title : "Loading Course..."}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic opacity-80">{course?.description}</p>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Modules: <span className="text-slate-900 dark:text-white">{lessons.length}</span></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Assignments: <span className="text-slate-900 dark:text-white">{assignments.length}</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button
               onClick={() => navigate(`/edit-course/${id}`)}
               className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
             >
               <Settings size={14} />
               Settings
             </button>
             <button
               onClick={() => setShowConfirmModal(true)}
               className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/25"
             >
               <Trash2 size={14} />
               Delete Course
             </button>
          </div>
        </header>

        <ConfirmModal 
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={deleteCourse}
          title="Delete Course?"
          message={`Are you sure you want to delete "${course?.title || 'this course'}"? All progress, assignments, and student feedback will be permanently removed.`}
          confirmLabel="Delete Course"
          isLoading={isDeleting}
        />

        <Toast 
          isOpen={toast.isOpen}
          onClose={() => setToast({ ...toast, isOpen: false })}
          message={toast.message}
          type={toast.type}
        />

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-lg shadow-emerald-500/5">
            <div className="p-2 bg-emerald-500 text-white rounded-xl">
               <CheckCircle size={18} />
            </div>
            <p className="font-black uppercase tracking-tight text-sm">{message}</p>
          </div>
        )}

        {/* SMALL ACTION CARDS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SmallActionCard onClick={() => navigate(`/add-lesson/${id}`)} icon="📘" label="Add Lesson" />
          <SmallActionCard onClick={() => navigate(`/create-quiz/${id}`)} icon="📝" label="Create Quiz" />
          <SmallActionCard onClick={() => navigate(`/add-assignment/${id}`)} icon="📂" label="Add Assignment" />
          <SmallActionCard onClick={() => navigate(`/teacher/course/${id}/analytics`)} icon="📊" label="Course Analytics" />
        </section>

        {/* CURRICULUM GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          
          {/* ASSIGNMENTS */}
          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
               ASSIGNMENTS
            </h2>

            {assignments.length === 0 ? (
              <EmptyState message="No Assignments" sub="Start by adding an assignment to the course." />
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{assignment.title}</h3>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Assignment</p>
                    </div>
                    <div className="flex gap-2">
                       <CompactIconButton icon={<Eye size={14}/>} onClick={() => viewAssignment(assignment.pdfUrl)} />
                       <CompactIconButton icon={<Edit3 size={14}/>} onClick={() => navigate(`/edit-assignment/${assignment._id}`)} />
                       <CompactIconButton icon={<Users size={14}/>} onClick={() => navigate(`/assignment-submissions/${assignment._id}`)} />
                       <CompactIconButton icon={<Trash2 size={14}/>} onClick={() => deleteAssignment(assignment._id)} color="rose" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* MODULES */}
          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
               COURSE MODULES
            </h2>

            {lessons.length === 0 ? (
              <EmptyState message="No Modules" sub="Add your first lesson module to the course." />
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div key={lesson._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        Module {index + 1} — {lesson.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                       <CompactIconButton icon={<Eye size={14}/>} onClick={() => navigate(`/lesson-details/${lesson._id}`)} />
                       <CompactIconButton icon={<Edit3 size={14}/>} onClick={() => navigate(`/edit-lesson/${lesson._id}`)} />
                       <CompactIconButton icon={<Plus size={14}/>} onClick={() => navigate(`/upload-questions/${lesson._id}`)} />
                       <CompactIconButton icon={<Trash2 size={14}/>} onClick={() => deleteLesson(lesson._id)} color="rose" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

function SmallActionCard({ onClick, icon, label }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-3 transition-all active:scale-95"
    >
      <span className="text-xl">{icon}</span>
      <span className="font-bold text-sm text-slate-900 dark:text-white">{label}</span>
    </div>
  );
}

function CompactIconButton({ icon, onClick, color = 'indigo' }) {
  const themes = {
    indigo: 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-slate-200 dark:border-slate-700',
    rose: 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-slate-200 dark:border-slate-700'
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg border flex items-center justify-center transition-all ${themes[color]}`}
    >
      {icon}
    </button>
  );
}

function EmptyState({ message, sub }) {
  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 p-16 rounded-[3rem] text-center flex flex-col items-center gap-6 shadow-xl transition-all">
       <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
          <GraduationCap className="text-slate-400 dark:text-slate-300 dark:text-slate-600" size={48}/>
       </div>
       <div>
          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">{message}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">{sub}</p>
       </div>
    </div>
  );
}