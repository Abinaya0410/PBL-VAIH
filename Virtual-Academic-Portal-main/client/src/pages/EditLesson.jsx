// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function EditLesson() {
//   const { lessonId } = useParams();
//   const navigate = useNavigate();

//   const [lesson, setLesson] = useState({
//     title: "",
//     description: "",
//     textContent: "",
//     videoUrl: "",
//     order: 1,
//   });

//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     fetchLesson();
//   }, []);

//   const fetchLesson = async () => {
//     const res = await axios.get(`/api/lessons/${lessonId}`);
//     setLesson(res.data);
//   };

//   const handleChange = (e) => {
//     setLesson({ ...lesson, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async () => {
//     await axios.put(`/api/lessons/${lessonId}`, lesson);
//     setSuccess(true);

//     setTimeout(() => {
//       navigate(-1);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-white p-10">
//       <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-2xl shadow-xl">
//         <h2 className="text-3xl font-bold mb-6 text-cyan-400">
//           Edit Lesson
//         </h2>

//         {success && (
//           <div className="bg-green-500/20 border border-green-500 p-4 rounded-lg mb-4">
//             Lesson updated successfully!
//           </div>
//         )}

//         <input
//           name="title"
//           value={lesson.title}
//           onChange={handleChange}
//           placeholder="Lesson Title"
//           className="w-full p-3 mb-4 bg-slate-700 rounded"
//         />

//         <textarea
//           name="description"
//           value={lesson.description}
//           onChange={handleChange}
//           placeholder="Lesson Description"
//           className="w-full p-3 mb-4 bg-slate-700 rounded"
//         />

//         <textarea
//           name="textContent"
//           value={lesson.textContent}
//           onChange={handleChange}
//           placeholder="Text Content"
//           className="w-full p-3 mb-4 bg-slate-700 rounded"
//         />

//         <input
//           name="videoUrl"
//           value={lesson.videoUrl}
//           onChange={handleChange}
//           placeholder="Video URL"
//           className="w-full p-3 mb-4 bg-slate-700 rounded"
//         />

//         <input
//           type="number"
//           name="order"
//           value={lesson.order}
//           onChange={handleChange}
//           className="w-full p-3 mb-6 bg-slate-700 rounded"
//         />

//         <button
//           onClick={handleUpdate}
//           className="bg-cyan-500 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400"
//         >
//           Update Lesson
//         </button>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState({
    title: "",
    description: "",
    textContent: "",
    videoUrl: "",
    order: 1,
    pdfUrl: "",
  });

  const [pdfFile, setPdfFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setLesson({
        title: data.title || "",
        description: data.description || "",
        textContent: data.textContent || "",
        videoUrl: data.videoUrl || "",
        order: data.order || 1,
        pdfUrl: data.pdfUrl || "",
      });

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
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

      await fetch(
        `http://localhost:5000/api/lessons/${lessonId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      setSuccess(true);

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Loading Module Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 flex justify-center items-start min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="relative z-10">
          <div className="mb-10">
             <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Refactor Module</h2>
             <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-2">Adjust the instructional parameters for this curriculum element.</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Module Identification</label>
              <input
                name="title"
                placeholder="Operational Title"
                value={lesson.title}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-black"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Contextual Overview</label>
              <textarea
                name="description"
                placeholder="Briefly define the instructional scope..."
                value={lesson.description}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium h-24"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Curriculum Content (Notes)</label>
              <textarea
                name="textContent"
                placeholder="Deep dive into the academic details..."
                value={lesson.textContent}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium h-60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Instructional Video Node</label>
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
                placeholder="Module Priority"
                value={lesson.order}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-black text-center"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Update PDF Material (Optional)</label>
              <div className="relative group/file">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover/file:border-cyan-500/50 transition-all bg-slate-50/50 dark:bg-slate-800/20">
                   <p className="text-xs font-bold text-slate-500">
                     {pdfFile ? pdfFile.name : lesson.pdfUrl ? "Current PDF: " + lesson.pdfUrl.split('/').pop() : "Click or drag PDF here"}
                   </p>
                   <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                     {pdfFile || lesson.pdfUrl ? "File Available" : "Max size 10MB"}
                   </p>
                </div>
              </div>
            </div>

            {success && (
              <div className="md:col-span-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs animate-pulse">
                Module Re-Architected Successfully ✓
              </div>
            )}

            <div className="md:col-span-2 pt-6">
              <button 
                type="button"
                onClick={handleUpdate}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl active:scale-95"
              >
                Sync Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
