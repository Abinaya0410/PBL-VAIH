
import { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, ClipboardCheck, Star, Zap, CheckCircle } from "lucide-react";

const API_BASE = "http://localhost:5000";

export default function LearnerXP() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/xp/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Score fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] animate-pulse">
            Calculating Score...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-gray-600 dark:text-gray-500 font-bold">
        Failed to load score data. Please refresh.
      </div>
    );
  }

  const {
    totalXP = 0,
    assignmentXP = 0,
    quizXP = 0,
    assignmentDetails = [],
    quizDetails = [],
  } = data;



  return (
    <div className="p-8 lg:p-12 space-y-10 max-w-5xl mx-auto">

      {/* PAGE HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/20">
          <Zap size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">My Score</h1>
          <p className="text-[var(--secondary)] text-sm font-bold italic opacity-80">
            Points earned from assignments and quiz efficiency.
          </p>
        </div>
      </div>

      {/* ── SECTION 1: TOTAL POINTS ── */}
      <div className="glass-card p-8 py-10 text-center bg-gradient-to-br from-indigo-600/15 to-purple-600/5 border-indigo-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 mx-auto mb-4">
            <Trophy size={28} className="text-white" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Total Score</p>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-none">
            {totalXP}
            <span className="text-2xl text-slate-500 dark:text-slate-400 ml-3 font-bold">pts</span>
          </h2>
        </div>
      </div>

      {/* ── SECTION 2: XP BREAKDOWN ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assignment Points */}
        <div className="glass-card p-8 bg-gradient-to-br from-emerald-500/8 to-transparent border-emerald-500/20 flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center shrink-0">
            <ClipboardCheck size={28} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Assignment Points</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white">{assignmentXP}<span className="text-lg text-slate-500 dark:text-slate-400 ml-2">pts</span></p>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">+50 pts per submission</p>
          </div>
        </div>

        {/* Quiz Points */}
        <div className="glass-card p-8 bg-gradient-to-br from-amber-500/8 to-transparent border-amber-500/20 flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center justify-center shrink-0">
            <Star size={28} className="text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Quiz Efficiency</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white">{quizXP}<span className="text-lg text-slate-500 dark:text-slate-400 ml-2">pts</span></p>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">Fewer attempts = more pts</p>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: ASSIGNMENT CONTRIBUTION ── */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--secondary)] mb-5 flex items-center gap-2">
          <ClipboardCheck size={13} className="text-emerald-400" />
          Assignment Contributions
        </h3>
        {assignmentDetails.length > 0 ? (
          <div className="space-y-3">
            {assignmentDetails.map((a, i) => (
              <div
                key={i}
                className="glass-card px-6 py-4 flex items-center justify-between border-emerald-500/10 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <p className="font-bold text-sm text-[var(--foreground)]">{a.label}</p>
                </div>
                <span className="text-emerald-400 font-black text-sm">+50 pts</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No assignments submitted yet. Submit an assignment to earn points!" />
        )}
      </div>

      {/* ── SECTION 4: QUIZ EFFICIENCY ── */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--secondary)] mb-5 flex items-center gap-2">
          <Star size={13} className="text-amber-400" />
          Quiz Efficiency
        </h3>
        {quizDetails.length > 0 ? (
          <div className="space-y-3">
            {quizDetails.map((q, i) => (
              <div
                key={i}
                className="glass-card px-6 py-4 flex items-center justify-between border-amber-500/10 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Trophy size={16} className="text-amber-400 shrink-0" />
                  <p className="font-bold text-sm text-[var(--foreground)]">{q.label}</p>
                </div>
                <span className="text-amber-400 font-black text-sm">+{q.points} pts</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No quiz attempts yet. Complete a quiz to earn points!" />
        )}
      </div>


    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="glass-card p-10 text-center border-dashed border-2">
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 italic">{message}</p>
    </div>
  );
}
