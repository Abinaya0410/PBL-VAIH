import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Activity,
  Award,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import axios from "axios";
import Toast from "../components/Toast";

export default function TeacherAnalytics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [engagementData, setEngagementData] = useState([]);
  const [loadingEngagement, setLoadingEngagement] = useState(true);

  // Toast State
  const [toastConfig, setToastConfig] = useState({
    isOpen: false,
    message: "",
    type: "success"
  });

  useEffect(() => {
    console.log("TeacherAnalytics Rendered");
    console.log("Engagement useEffect running");

    const fetchTeacherAnalytics = async () => {
      console.log("Fetching Teacher Analytics...");
      try {
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL || "";
        
        const res = await fetch(`${API_URL}/api/analytics/teacher`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Teacher Analytics Response:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("Teacher Analytics Data:", data);
          setStats(data);
        } else {
          const errorText = await res.text();
          console.error("Teacher Analytics Error:", res.status, errorText);
        }
      } catch (err) {
        console.error("Teacher Analytics Error:", err);
      } finally {
        console.log("Teacher Analytics Fetch Complete");
        setLoading(false);
      }
    };

    const fetchEngagement = async () => {
      setLoadingEngagement(true);
      try {
        console.log("Calling Engagement API...");
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${API_URL}/api/analytics/engagement`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) throw new Error("API failed");

        const data = await res.json();
        console.log("Engagement Data:", data);
        if (!Array.isArray(data)) console.error("Engagement Data not an array:", data);
        setEngagementData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Engagement Error:", err);
        setEngagementData([]);
      } finally {
        setLoadingEngagement(false);
      }
    };

    fetchTeacherAnalytics();
    fetchEngagement();
  }, []);

  const handleNotify = async (student) => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "";
      await axios.post(`${API_URL}/api/analytics/notify-at-risk`, {
        studentId: student._id || student.id, 
        studentName: student.name,
        reason: student.reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setToastConfig({
        isOpen: true,
        message: `Intervention sent to ${student.name}`,
        type: "success"
      });
    } catch (err) {
      console.error("Notify failed:", err);
      setToastConfig({
        isOpen: true,
        message: "Failed to send notification.",
        type: "error"
      });
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      
      {/* Header - Always Visible */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500">
            <BarChart3 size={20}/>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Analytics Dashboard</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Teacher Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Overview of performance and engagement metrics.</p>
        </div>
        
        {loading && (
          <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 rounded-full">
            <div className="w-3 h-3 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Refreshing Data...</span>
          </div>
        )}
      </header>

      {/* 1️⃣ Overall Engagement Rate */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[2.5rem] p-8 md:p-12 shadow-xl text-white flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-blue-100">Overall Student Engagement</h3>
            <div className="flex items-baseline gap-4">
              <p className="text-5xl md:text-6xl font-black">{loading ? "..." : `${stats?.engagementRate}%`}</p>
              <span className="text-blue-200 font-bold uppercase tracking-widest text-xs hidden md:inline">Active learners</span>
            </div>
            {!loading && (
              <div className="w-full bg-blue-900/30 h-2 mt-4 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: `${stats?.engagementRate}%` }}></div>
              </div>
            )}
          </div>
          <Activity size={64} className="opacity-20 hidden md:block" />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* 2️⃣ Assignment Performance */}
        <section className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-wider text-slate-400 flex items-center gap-3">
            <FileText className="text-blue-500" size={20}/>
            Assignment Performance Insights
          </h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl space-y-8 min-h-[300px]">
            {loading ? (
              <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div></div>
            ) : stats?.assignmentPerformance?.length > 0 ? (
              <div className="space-y-6">
                {stats.assignmentPerformance.map((a, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm md:text-base font-bold items-center">
                      <span className="text-slate-800 dark:text-slate-200 truncate pr-4">{a.assignmentName}</span>
                      <span className="text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full text-xs font-black">{a.averageScore}% avg</span>
                    </div>
                    <ProgressTrack label="Submission Rate" percentage={a.submissionRate} color="blue" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-center font-medium py-12">No assignments found in your courses.</p>
            )}
          </div>
        </section>

        {/* 3️⃣ Quiz Performance */}
        <section className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-wider text-slate-400 flex items-center gap-3">
            <Award className="text-emerald-500" size={20}/>
            Quiz Performance Insights
          </h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl space-y-6 min-h-[300px]">
             {loading ? (
              <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div></div>
            ) : stats?.quizPerformance?.length > 0 ? (
              <div className="space-y-4">
                {stats.quizPerformance.map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{q.quizName}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{q.totalAttempts} Attempts</span>
                    </div>
                    <div className="text-right flex items-center gap-3 space-x-2">
                      <span className="text-xl font-black text-emerald-500">{q.averageScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-center font-medium py-12">No quizzes found in your courses.</p>
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* 4️⃣ Top Performing Students */}
        <section className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-wider text-slate-400 flex items-center gap-3">
            <TrendingUp className="text-indigo-500" size={20}/>
            Top Performing Students
          </h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center p-20"><div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div></div>
            ) : stats?.topStudents?.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Student Name</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Points / XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats.topStudents.map((student, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${
                          idx === 0 ? "bg-amber-400 text-white" : 
                          idx === 1 ? "bg-slate-300 text-white" :
                          idx === 2 ? "bg-orange-400 text-white" :
                          "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}>
                          {idx + 1}
                        </span>
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-indigo-500">{student.points} XP</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center p-12">
                <p className="text-slate-400 font-medium italic">No students available.</p>
              </div>
            )}
          </div>
        </section>

        {/* 5️⃣ Students Needing Attention */}
        <section className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-wider text-rose-400 flex items-center gap-3">
            <AlertCircle className="text-rose-500" size={20}/>
            Students Needing Attention
          </h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center p-20"><div className="w-8 h-8 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div></div>
            ) : stats?.atRiskStudents?.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rose-50/50 dark:bg-rose-900/10 border-b border-rose-100 dark:border-rose-900/50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Student Name</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Risk Factor</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats.atRiskStudents.map((student, idx) => (
                    <tr key={idx} className="hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white uppercase tracking-tight">{student.name}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-xs px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full">{student.reason}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleNotify(student)}
                          className="text-[10px] font-black uppercase tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-sm"
                        >
                          Notify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center p-16 text-emerald-500 space-y-4">
                <Award size={48} className="opacity-50" />
                <p className="font-bold text-center">Great job! No students are currently flagged as needing attention.</p>
              </div>
            )}
          </div>
        </section>
      </div>

          {/* 5️⃣ Engagement Graph */}
          <section className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-slate-400 flex items-center gap-3">
              <Activity className="text-cyan-500" size={20}/>
              Student Engagement Over Time
            </h3>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl min-h-[400px]">
              {loadingEngagement ? (
                <div className="flex items-center justify-center h-[350px]"><div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div></div>
              ) : engagementData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[350px] text-slate-400 font-medium italic">
                   <Activity size={48} className="mb-4 opacity-20" />
                   <p>No engagement data available</p>
                </div>
              ) : (
                <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={10} 
                        fontWeight="bold"
                        tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          border: '1px solid #1e293b', 
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="submissions" 
                        name="Assignments"
                        stroke="#06b6d4" 
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="attempts" 
                        name="Quiz Attempts"
                        stroke="#6366f1" 
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </section>
        {/* Toast Notification */}
        <Toast 
          isOpen={toastConfig.isOpen}
          onClose={() => setToastConfig({ ...toastConfig, isOpen: false })}
          message={toastConfig.message}
          type={toastConfig.type}
        />
    </div>
  );
}

function MetricCard({ icon, label, value, subtext, color }) {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl hover:-translate-y-2 transition-all group relative overflow-hidden">
      <div className={`p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform ${colors[color]}`}>
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-black text-slate-900 dark:text-white mb-2">{value}</p>
        <p className="text-[9px] font-bold italic text-slate-500 dark:text-slate-400 opacity-60 uppercase tracking-wider">{subtext}</p>
      </div>
    </div>
  );
}

function ProgressTrack({ label, percentage, color }) {
  const colorMap = {
    emerald: "bg-emerald-500",
    cyan: "bg-cyan-500",
    indigo: "bg-indigo-500",
    blue: "bg-blue-500",
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-lg font-black italic text-slate-800 dark:text-slate-200">{percentage}%</p>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorMap[color]} shadow-none rounded-full transition-all duration-1000`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
