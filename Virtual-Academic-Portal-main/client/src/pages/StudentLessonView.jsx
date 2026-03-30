import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Sparkles, Bot, Loader2, BookOpen, PlayCircle, FileText, CheckCircle } from "lucide-react";
import PDFSummary from "../components/PDFSummary";

export default function StudentLessonView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLesson(res.data);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Failed to load lesson content.");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
    
    // Check completion status
    const stored = JSON.parse(localStorage.getItem("completedLessons")) || [];
    if (stored.includes(id)) {
      setCompleted(true);
    }
  }, [id, token]);

  const markCompleted = () => {
    setCompleted(true);
    const stored = JSON.parse(localStorage.getItem("completedLessons")) || [];
    if (!stored.includes(id)) {
      stored.push(id);
      localStorage.setItem("completedLessons", JSON.stringify(stored));
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">{error || "Lesson not found"}</p>
          <button onClick={() => navigate(-1)} className="text-indigo-400 hover:underline">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="bg-slate-900/60 p-8 rounded-3xl border border-indigo-500/20 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
                {lesson.title}
              </h1>
              <p className="text-indigo-300 font-medium opacity-80">{lesson.description}</p>
            </div>
            {completed && (
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 text-xs font-black uppercase tracking-widest">
                <CheckCircle size={14} /> Completed
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* CONTENT */}
            {lesson.textContent && (
              <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-indigo-400" size={24} />
                  <h2 className="text-xl font-black uppercase tracking-tight text-indigo-300">
                    Lesson Material
                  </h2>
                </div>
                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {lesson.textContent}
                </div>
              </div>
            )}

            {/* PDF VIEWER */}
            {lesson.pdfUrl && (
              <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
                 <div className="flex items-center gap-3 mb-6">
                  <FileText className="text-rose-400" size={24} />
                  <h2 className="text-xl font-black uppercase tracking-tight text-rose-300">
                    PDF Document
                  </h2>
                </div>
                <iframe
                  src={`http://localhost:5000${lesson.pdfUrl}`}
                  className="w-full h-[600px] rounded-2xl border border-white/10"
                  title="Lesson PDF"
                ></iframe>
              </div>
            )}

            {/* VIDEO */}
            {lesson.videoUrl && (
              <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <PlayCircle className="text-amber-400" size={24} />
                  <h2 className="text-xl font-black uppercase tracking-tight text-amber-300">
                    Video Explanation
                  </h2>
                </div>
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={lesson.videoUrl.replace("watch?v=", "embed/")}
                    title="Lesson Video"
                    className="rounded-2xl shadow-2xl"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR - AI SUMMARY */}
          <div className="space-y-8">
            <PDFSummary lessonId={id} textContent={lesson.textContent} initialSummary={lesson.aiNotes} />

            {!completed && (
              <button
                onClick={markCompleted}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}