import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, FileText, BarChart3, TrendingUp, CheckCircle, Clock, AlertCircle, ChevronLeft } from "lucide-react";

export default function CourseAnalytics() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId && courseId !== "undefined") {
      fetchAnalytics();
    }
  }, [courseId]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/analytics/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      } else {
        throw new Error("Failed to load analytics");
      }
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;
  if (!analytics) return <div className="p-8 text-center text-rose-500">Failed to load analytics data.</div>;

  return (
    <div className="p-8 lg:p-12 space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(`/teacher/course/${courseId}`)}
            className="text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Course Analytics</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Review student performance and quiz metrics.</p>
          </div>
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
          <TrendingUp size={16}/> Live Updates
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-cyan-500"/>} label="Students Enrolled" value={analytics.totalStudents} color="cyan" />
        <StatCard icon={<FileText className="text-blue-500"/>} label="Assignments Submitted" value={analytics.totalSubmissions} color="blue" />
        <StatCard icon={<BarChart3 className="text-indigo-500"/>} label="Quiz Attempts" value={analytics.totalAttempts || 0} color="indigo" />
        <StatCard icon={<TrendingUp className="text-emerald-500"/>} label="Average Quiz Score" value={`${analytics.averageQuizScore}%`} color="emerald" />
      </div>

      {/* PERFORMANCE TABLE */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black uppercase tracking-tight leading-none">Student Performance</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Student</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Lessons</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Assignments</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Quiz Score</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analytics.studentPerformance.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="p-12 text-center text-slate-500 italic">No students enrolled yet.</td>
                    </tr>
                ) : (
                    analytics.studentPerformance.map((student, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black">
                            {student.student.charAt(0)}
                            </div>
                            <div>
                            <p className="font-black text-sm uppercase tracking-tight">{student.student}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic">{student.email}</p>
                            </div>
                        </div>
                        </td>
                        <td className="p-6">
                        <span className="text-xs font-black px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {student.lessons}
                        </span>
                        </td>
                        <td className="p-6">
                        <div className="flex items-center gap-1.5 font-bold text-sm">
                            <FileText size={14} className="text-blue-500"/>
                            {student.assignments}
                        </div>
                        </td>
                        <td className="p-6">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-black ${student.quizScore >= 80 ? 'text-emerald-500' : student.quizScore >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                            {student.quizScore}%
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 italic font-medium">({student.attempts} attempts)</span>
                        </div>
                        </td>
                        <td className="p-6">
                        <StatusBadge status={student.status} />
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-lg hover:-translate-y-1 transition-all group">
      <div className={`p-4 bg-${color}-500/10 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Completed": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 icon-check",
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20 icon-clock",
    "Not Attempted": "bg-slate-500/10 text-slate-500 border-slate-500/20 icon-circle",
  };

  const icons = {
    "Completed": <CheckCircle size={12} />,
    "In Progress": <Clock size={12} />,
    "Not Attempted": <AlertCircle size={12} />,
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
}
