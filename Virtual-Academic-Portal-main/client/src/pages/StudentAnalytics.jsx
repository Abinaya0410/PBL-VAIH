
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Award, 
  Target
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

export default function StudentAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/analytics/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
           <p className="text-[var(--secondary)] font-bold animate-pulse uppercase tracking-widest text-xs">Gathering status...</p>
        </div>
      </div>
    );
  }

  const completionRate = data.totalEnrolled === 0 ? 0 : Math.round((data.completedCourses / data.totalEnrolled) * 100);
  const pieData = [
    { name: "Pass", value: data.passCount },
    { name: "Fail", value: data.failCount },
  ];
  const COLORS = ["#10b981", "#ef4444"];

  const radialData = [
    {
      name: "Completion",
      value: completionRate,
      fill: "#6366f1",
    },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* HERO STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnalyticsCard icon={<Award size={20}/>} label="Avg Score" value={`${data.averageScore}%`} sub="Performance" color="indigo" />
          <AnalyticsCard icon={<CheckCircle size={20}/>} label="Completed" value={data.completedCourses} sub="Courses" color="emerald" />
          <AnalyticsCard icon={<Target size={20}/>} label="Attempts" value={data.totalAttempts} sub="Quiz Power" color="violet" />
          <AnalyticsCard icon={<TrendingUp size={20}/>} label="Success" value={data.passCount} sub="Quiz Passed" color="cyan" />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-black uppercase tracking-tight">Quiz Results</h3>
               <div className="flex gap-2">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-[10px] font-bold text-[var(--secondary)]">Pass</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-[10px] font-bold text-[var(--secondary)]">Fail</span></div>
               </div>
            </div>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={70} outerRadius={90} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-black">{data.passCount + data.failCount}</span>
                 <span className="text-[10px] font-bold text-[var(--secondary)] uppercase tracking-widest">Total</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <BarChart3 size={120} className="text-indigo-500" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight w-full">Detailed Progress</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={15} data={radialData}>
                  <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'var(--border)' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center group cursor-default">
              <p className="text-5xl font-black text-indigo-500 group-hover:scale-110 transition-transform">{completionRate}%</p>
              <p className="text-xs font-bold text-[var(--secondary)] uppercase tracking-widest mt-2">Overall Progress</p>
            </div>
          </div>
        </div>

        {/* PERFORMANCE TABLE */}
        <div className="space-y-6">
          <h3 className="text-xl font-black tracking-tight uppercase text-slate-800 dark:text-white">Course Progress Overview</h3>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--card)]/50 border-b border-[var(--border)]">
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-[var(--secondary)]">Course Title</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-[var(--secondary)]">Peak Performance</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-[var(--secondary)]">Total Attempts</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-[var(--secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {data.coursePerformance?.map((course) => (
                    <tr key={course.courseId} className="hover:bg-[var(--card)]/30 transition-colors group">
                       <td className="px-6 py-5">
                          <p className="font-black text-base uppercase tracking-tight group-hover:text-indigo-500 transition-colors">{course.courseTitle}</p>
                       </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-[var(--foreground)]">{course.bestScore}%</span>
                            <div className="h-1.5 w-16 bg-[var(--border)] rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-500" style={{ width: `${course.bestScore}%` }}></div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                          <span className="bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-lg text-xs font-black border border-indigo-500/20">{course.attempts} TRIES</span>
                      </td>
                      <td className="px-6 py-5 lowercase">
                         {course.status === "Completed" ? (
                           <div className="flex items-center gap-1.5 text-emerald-500">
                              <CheckCircle size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Finished</span>
                           </div>
                         ) : (
                           <div className="flex items-center gap-1.5 text-amber-500">
                              <Clock size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Learning</span>
                           </div>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function AnalyticsCard({ icon, label, value, sub, color }) {
  const colorMap = {
    indigo: "text-indigo-500 bg-indigo-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    violet: "text-violet-500 bg-violet-500/10",
    cyan: "text-cyan-500 bg-cyan-500/10"
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-all">
       <div className={`p-3 rounded-2xl w-fit group-hover:scale-110 transition-transform ${colorMap[color]}`}>
          {icon}
       </div>
       <div>
          <h4 className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-widest mb-1">{label}</h4>
          <div className="flex items-baseline gap-2">
             <span className="text-3xl font-black text-[var(--foreground)]">{value}</span>
             <span className="text-[10px] font-bold text-[var(--secondary)] italic">{sub}</span>
          </div>
       </div>
    </div>
  );
}