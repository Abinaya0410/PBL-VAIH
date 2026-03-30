import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function AddLesson() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);

  const [lesson, setLesson] = useState({
    title: "",
    description: "",
    textContent: "",
    videoUrl: "",
    order: "",
  });

  const [pdfFile, setPdfFile] = useState(null);

  const handleChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", lesson.title);
      formData.append("description", lesson.description);
      formData.append("textContent", lesson.textContent);
      formData.append("videoUrl", lesson.videoUrl);
      formData.append("order", Number(lesson.order));
      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      const res = await fetch(
        `http://localhost:5000/api/courses/${id}/lessons`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);

        setLesson({
          title: "",
          description: "",
          textContent: "",
          videoUrl: "",
          order: "",
        });

        setTimeout(() => {
          navigate(`/course/${id}`);
        }, 1500);
      } else {
        alert(data.message || "Error adding lesson");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="p-8 lg:p-12 flex justify-center items-start min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="relative z-10">
          <div className="mb-10 flex justify-between items-start">
             <div>
               <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Create new lesson</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-2">Add a new lesson to your course curriculum.</p>
             </div>
             <button 
                onClick={() => navigate(`/teacher/course/${id}`)}
                className="text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors"
                title="Abort Mission"
             >
               <ChevronLeft size={32} />
             </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Lesson Title</label>
              <input
                name="title"
                placeholder="e.g. Fundamental Quantum States"
                value={lesson.title}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-black"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Lesson Description</label>
              <textarea
                name="description"
                placeholder="Briefly define the instructional scope..."
                value={lesson.description}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium h-24"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Lesson Notes</label>
              <textarea
                name="textContent"
                placeholder="Deep dive into the academic details..."
                value={lesson.textContent}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium h-60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Lesson Video URL</label>
              <input
                name="videoUrl"
                placeholder="YouTube Archive URL"
                value={lesson.videoUrl}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Sequence Position</label>
              <input
                type="number"
                name="order"
                placeholder="Module Priority (1, 2, ...)"
                value={lesson.order}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-black text-center"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Upload PDF Material (Optional)</label>
              <div className="relative group/file">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover/file:border-cyan-500/50 transition-all bg-slate-50/50 dark:bg-slate-800/20">
                   <p className="text-xs font-bold text-slate-500">{pdfFile ? pdfFile.name : "Click or drag PDF here"}</p>
                   <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{pdfFile ? "File Selected" : "Max size 10MB"}</p>
                </div>
              </div>
            </div>

            {success && (
              <div className="md:col-span-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs animate-pulse">
                Lesson Created Successfully ✓
              </div>
            )}

            <div className="md:col-span-2 pt-6">
              <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl active:scale-95">
                Add Lesson
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
