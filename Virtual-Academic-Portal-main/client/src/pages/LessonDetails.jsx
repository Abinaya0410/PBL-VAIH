
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  ChevronLeft, 
  BookOpen, 
  Play, 
  FileText, 
  Trash2, 
  Edit3,
  HelpCircle,
  HelpCircle as QuestionIcon,
  Video
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function LessonDetails() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [lesson, setLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
      fetchQuestions();
      if (role === "student") checkProgress();
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      setLesson(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/lessons/${lessonId}/question-bank`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const checkProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/lessons/${lessonId}/progress`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data?.completed) setCompleted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const markCompleted = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompleted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerClick = (qId, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: option,
    });
  };

  const deleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/question-bank/${questionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(questions.filter((q) => q._id !== questionId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 p-6 md:p-10 lg:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-500 hover:translate-x-1 transition-all font-black uppercase tracking-widest text-[10px]"
        >
          <ChevronLeft size={16} />
          Back to Module
        </button>

        {/* LESSON CONTENT */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="p-8 md:p-12 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">Learning Unit</span>
                 {completed && (
                   <span className="flex items-center gap-1.5 text-emerald-500 font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                     <CheckCircle size={12} /> Mastery Achieved
                   </span>
                 )}
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase text-slate-900 dark:text-white">
                {lesson?.title}
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic opacity-80">
                {lesson?.description}
              </p>
            </div>

            {lesson?.textContent && (
              <div className="space-y-4 p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-slate-900 dark:text-white">
                   <FileText size={80} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Transcript & Notes</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-loose font-medium relative z-10">{lesson.textContent}</p>
              </div>
            )}

            {/* PDF MATERIALS SECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                 <FileText size={16}/> Academic Material (PDF)
               </h3>
               
               {lesson?.pdfUrl ? (
                 <div className="flex flex-wrap gap-4">
                    {(() => {
                      const fullPdfUrl = `http://localhost:5000${lesson.pdfUrl.startsWith('/') ? '' : '/'}${lesson.pdfUrl}`;
                      
                      return (
                        <>
                          <a
                            href={fullPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-emerald-500/30 rounded-2xl group hover:border-emerald-500 transition-all shadow-lg shadow-emerald-500/5 font-black text-sm text-slate-900 dark:text-white"
                          >
                            <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                               <FileText size={18} />
                            </div>
                            View PDF Document
                          </a>

                          <a
                            href={fullPdfUrl}
                            download
                            className="inline-flex items-center gap-3 px-6 py-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl group hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 hover:text-white transition-all font-black text-sm text-slate-600 dark:text-slate-400"
                          >
                            Download Material
                          </a>
                        </>
                      );
                    })()}
                 </div>
               ) : (
                 <p className="text-xs font-bold text-slate-500 italic opacity-60">No PDF material available for this unit.</p>
               )}
            </div>

            {lesson?.videoUrl && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                   <Video size={16}/> Cinematic Resource
                 </h3>
                 <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-indigo-500/30 rounded-2xl group hover:border-indigo-500 transition-all shadow-lg shadow-indigo-500/5 font-black text-sm text-slate-900 dark:text-white"
                >
                  <div className="p-2 bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                     <Play size={18} fill="white"/>
                  </div>
                  Watch Masterclass Session
                </a>
              </div>
            )}

            {/* STUDENT COMPLETE BUTTON */}
            {role === "student" && !completed && (
              <div className="pt-8 flex justify-center border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={markCompleted}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-3 px-10 py-5 text-lg rounded-2xl font-black shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                >
                  <CheckCircle size={24} />
                  Validate Completion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PRACTICE QUESTIONS */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tight">
              <div className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/30">
                <HelpCircle size={24}/>
              </div>
              Knowledge Assessment
            </h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] bg-[var(--card)] px-3 py-1 rounded-full border border-[var(--border)]">{questions.length} Concepts</span>
          </div>

          {questions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 p-16 rounded-[3rem] text-center">
               <QuestionIcon className="mx-auto text-slate-400 dark:text-slate-300 dark:text-slate-700 mb-4" size={48}/>
               <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest italic leading-none mb-1">Assessment Pending</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">Practice queries will appear here once published.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {questions.map((q, index) => (
                <div
                  key={q._id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-[2.5rem] space-y-8 group transition-all duration-500 overflow-hidden relative shadow-xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                     <QuestionIcon size={120} className="text-accent" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Query 0{index + 1}</span>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight">
                      {q.question}
                    </h3>
                  </div>

                  <div className="grid gap-3 relative z-10">
                    {q.options.map((opt, i) => {
                      const selected = selectedAnswers[q._id];
                      const isCorrect = q.correctAnswer === opt;
                      const isChosen = selected === opt;

                      let buttonClasses = "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-accent hover:bg-accent/5";
                      let indicator = null;

                      if (role === "student" && isChosen) {
                        buttonClasses = isCorrect 
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" 
                          : "border-rose-500 bg-rose-500/10 text-rose-600";
                        indicator = isCorrect ? "✔ Correct" : "✖ Incorrect";
                      }

                      return (
                        <button
                          key={i}
                          disabled={role !== "student" || !!selected}
                          onClick={() => handleAnswerClick(q._id, opt)}
                          className={`group/opt flex items-center justify-between w-full text-left px-6 py-4 rounded-2xl border transition-all font-bold ${buttonClasses}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs font-black group-hover/opt:bg-accent group-hover/opt:text-white group-hover/opt:border-accent transition-all">
                               {String.fromCharCode(65 + i)}
                            </span>
                            {opt}
                          </div>
                          {indicator && <span className="text-[10px] font-black uppercase tracking-widest">{indicator}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* TEACHER: SHOW CORRECT ANSWER */}
                  {role === "teacher" && (
                    <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <CheckCircle size={14}/>
                         </div>
                         <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
                           Key: <span className="ml-1 opacity-80">{q.correctAnswer}</span>
                         </p>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => navigate(`/edit-question/${q._id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-amber-500 hover:text-white transition-all shadow-lg shadow-amber-500/10"
                        >
                          <Edit3 size={14}/> Refactor
                        </button>

                        <button
                          onClick={() => deleteQuestion(q._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                        >
                          <Trash2 size={14}/> Eradicate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
