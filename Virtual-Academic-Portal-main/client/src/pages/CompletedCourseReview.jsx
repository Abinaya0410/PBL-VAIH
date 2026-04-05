
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Trophy, 
  Calendar, 
  Award, 
  ChevronLeft, 
  CheckCircle,
  FileText,
  Clock
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const CompletedCourseReview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/completed/${courseId}/review`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching review data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [courseId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] animate-pulse">Generating Summary...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight">Data Not Found</h2>
          <button 
            onClick={() => navigate('/completed-courses')}
            className="text-emerald-500 font-black uppercase tracking-widest text-xs flex items-center gap-2 mx-auto"
          >
            <ChevronLeft size={16} /> Back to Achievements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6 md:p-10 lg:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate('/completed-courses')}
          className="flex items-center gap-2 text-emerald-500 hover:translate-x-1 transition-all font-black uppercase tracking-widest text-[10px]"
        >
          <ChevronLeft size={16} />
          Back to Achievements
        </button>

        {/* HEADER SECTION */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
            <Award size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Achievement Verified</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none uppercase">{data.courseTitle}</h1>
          <p className="text-[var(--secondary)] font-bold italic opacity-70">Sector Mastered Successfully</p>
        </div>

        {/* MAIN SUMMARY CARD */}
        <div className="glass-card p-8 md:p-12 border-2 border-emerald-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <Trophy size={200} className="text-emerald-500" />
          </div>

          <div className="relative z-10 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-8 border-b border-[var(--border)]">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500 dark:text-gray-400">Completion Date</p>
                <div className="flex items-center gap-2 text-xl font-black">
                  <Calendar size={18} className="text-emerald-500" />
                  {new Date(data.completionDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="space-y-1 md:text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500 dark:text-gray-400">Official Status</p>
                <div className="flex items-center gap-2 text-xl font-black text-emerald-500 md:justify-end">
                  <CheckCircle size={18} />
                  {data.status}
                </div>
              </div>
            </div>

            {/* SCORE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 bg-[var(--background)] border-emerald-500/10">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500 dark:text-gray-400">Quiz Score</p>
                  <p className="text-4xl font-black text-indigo-500">{data.quizScore}%</p>
                </div>
              </div>

              <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 bg-[var(--background)] border-emerald-500/10">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-500 dark:text-gray-400">Assignment Score</p>
                  <p className="text-4xl font-black text-emerald-500">
                    {data.assignmentScore === "No assignments" ? "No assignments" : `${data.assignmentScore ?? "N/A"}${typeof data.assignmentScore === "number" ? "%" : ""}`}
                  </p>
                </div>
              </div>
            </div>

            {/* COMPLETION CARD TITLE */}
            <div className="pt-8 text-center border-t border-[var(--border)]">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-2">Academic Record Summary</p>
              <h3 className="text-2xl font-black uppercase tracking-tight">Course Completion Summary</h3>
            </div>
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="flex justify-center pt-8">
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="px-10 py-5 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-600 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95"
          >
            Return to Academic Portal
          </button>
        </div>

      </div>
    </div>
  );
};

export default CompletedCourseReview;
