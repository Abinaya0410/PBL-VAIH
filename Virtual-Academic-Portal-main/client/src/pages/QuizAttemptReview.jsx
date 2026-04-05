
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Trophy, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  AlertCircle
} from "lucide-react";
import QuizSummary from "../components/QuizSummary";

export default function QuizAttemptReview() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/quiz-attempt/${attemptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAttempt(res.data);
      } catch (err) {
        console.error("Error fetching attempt:", err);
        setError("Failed to load attempt details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId, token]);


  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] animate-pulse">Loading Review...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="glass-card p-10 text-center max-w-md w-full border-dashed border-2">
           <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
           <h3 className="text-xl font-black uppercase tracking-tight mb-2">Review Unavailable</h3>
           <p className="text-sm text-gray-600 dark:text-gray-500 italic mb-6">{error || "Attempt not found."}</p>
           <button onClick={() => navigate("/quiz-attempts")} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">Return Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6 md:p-10 lg:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-[var(--border)]">
          <div className="space-y-4">
            <button 
              onClick={() => navigate("/quiz-attempts")}
              className="flex items-center gap-2 text-primary hover:translate-x-1 transition-all font-black uppercase tracking-widest text-[10px]"
            >
              <ArrowLeft size={16} />
              Return to History
            </button>
            <div className="space-y-2">
               <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">{attempt.course?.title || "Quiz Review"}</h1>
               <p className="text-[var(--secondary)] font-bold italic opacity-80 text-sm">Detailed performance breakdown for this attempt.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500 dark:text-gray-400 mb-1">Final Score</p>
                <p className={`text-4xl font-black ${attempt.score >= 60 ? 'text-emerald-500' : 'text-rose-500'}`}>{attempt.score}%</p>
             </div>
             <div className={`w-20 h-20 rounded-3xl ${attempt.score >= 60 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'} border flex items-center justify-center shadow-xl`}>
                {attempt.score >= 60 ? <CheckCircle size={32} className="text-emerald-500" /> : <XCircle size={32} className="text-rose-500" />}
             </div>
          </div>
        </header>

        {/* STATS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatBox icon={<Trophy size={18} className="text-amber-500"/>} label="Result" value={attempt.score >= 60 ? "Passed" : "Failed"} subtext="60% required to pass" />
           <StatBox icon={<Clock size={18} className="text-indigo-500"/>} label="Duration" value={`${attempt.timeSpent}s`} subtext="Completion time" />
           <StatBox icon={<Calendar size={18} className="text-emerald-500"/>} label="Date" value={new Date(attempt.createdAt).toLocaleDateString()} subtext={new Date(attempt.createdAt).toLocaleTimeString()} />
        </section>

        {/* AI SUMMARY */}
        <QuizSummary quizData={attempt} />

        <section className="space-y-8">
  <h3 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">Question Breakdown</h3>
  <div className="space-y-6">
    {attempt.answers.map((q, index) => (
      <div key={index} className="glass-card p-8 space-y-6 border-l-4 transition-all hover:translate-x-1" style={{ borderLeftColor: q.isCorrect ? '#10b981' : '#f43f5e' }}>
         <div className="flex justify-between items-start gap-4">
            <h4 className="font-bold text-lg leading-relaxed text-slate-800 dark:text-slate-100">
              {index + 1}. {q.question || "Real Question from Database"}
            </h4>
            {q.isCorrect ? (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 shrink-0">Correct</span>
            ) : (
              <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-500/20 shrink-0">Incorrect</span>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options && q.options.map((opt, i) => {
              const isSelected = opt === q.selectedAnswer;
              const isCorrectAnswer = opt === q.correctAnswer;
              
              let stateStyle = "border-[var(--border)] text-gray-600 dark:text-gray-500 dark:text-gray-400";
              if (isSelected && q.isCorrect) stateStyle = "border-emerald-500 bg-emerald-500/5 text-emerald-500";
              if (isSelected && !q.isCorrect) stateStyle = "border-rose-500 bg-rose-500/5 text-rose-500";
              if (!isSelected && isCorrectAnswer && !q.isCorrect) stateStyle = "border-emerald-500/30 bg-emerald-500/5 text-emerald-500/60";

              return (
                <div key={i} className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${stateStyle}`}>
                   <span>{opt}</span>
                   {isSelected && (q.isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />)}
                </div>
              );
            })}
         </div>

         <div className="pt-6 border-t border-[var(--border)] flex flex-wrap gap-6">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500">Your Selection</p>
               <p className={`text-sm font-bold ${q.isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>{q.selectedAnswer || "No Answer"}</p>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500">Correct Solution</p>
               <p className="text-sm font-bold text-emerald-500">{q.correctAnswer}</p>
            </div>
         </div>
      </div>
    ))}
  </div>
</section>

      </div>
    </div>
  );
}

function StatBox({ icon, label, value, subtext }) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4">
       <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-inner">
             {icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500 dark:text-gray-400">{label}</span>
       </div>
       <div>
          <p className="text-2xl font-black">{value}</p>
          <p className="text-[9px] font-bold text-gray-600 dark:text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 opacity-70">{subtext}</p>
       </div>
    </div>
  );
}