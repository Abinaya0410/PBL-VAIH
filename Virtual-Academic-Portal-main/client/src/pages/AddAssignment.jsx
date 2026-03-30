
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Plus, 
  ChevronLeft, 
  FileText, 
  Calendar, 
  AlignLeft, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Layout
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function AddAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [pdf, setPdf] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("dueDate", dueDate);
      formData.append("course", id);

      if (pdf) {
        formData.append("pdf", pdf);
      }

      const res = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned an unexpected response");
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to create assignment");
      }

      setMessage("✅ Assignment published successfully");

      setTimeout(() => {
        navigate(`/course/${id}`);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 flex justify-center items-start min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="relative z-10">
          <div className="mb-10 flex justify-between items-start">
             <div>
               <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Add Assignment</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-2">Initialize a new academic challenge for this course.</p>
             </div>
             <button 
                onClick={() => navigate(`/teacher/course/${id}`)}
                className="text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
                title="Abort Mission"
             >
               <ChevronLeft size={32} />
             </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {message && (
              <div className="md:col-span-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs animate-pulse">
                {message} ✓
              </div>
            )}

            {error && (
              <div className="md:col-span-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs">
                {error} ⚠
              </div>
            )}

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Assignment Title</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300 dark:text-slate-600" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Assignment Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-black text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Assignment Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 text-slate-400 dark:text-slate-300 dark:text-slate-600" size={18} />
                <textarea
                  required
                  placeholder="Define the instructional parameters and expected outcomes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium h-32 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300 dark:text-slate-600" size={18} />
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-black text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Upload Assignment File (PDF)</label>
              <div className="relative group">
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => setPdf(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-800 group-hover:border-emerald-500 transition-all flex items-center gap-3">
                   <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-emerald-500 shadow-sm">
                      <Upload size={16}/>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate">
                     {pdf ? pdf.name : "Initialize Upload"}
                   </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin"></div>
                ) : (
                  <Layout size={18}/>
                )}
                {loading ? "Synchronizing..." : "Publish Assignment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}