// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// export default function EditAssignment() {

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [assignment, setAssignment] = useState(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dueDate, setDueDate] = useState("");

//   useEffect(() => {
//     fetchAssignment();
//   }, []);

//   const fetchAssignment = async () => {

//     const token = localStorage.getItem("token");

//     const res = await fetch(
//       `http://localhost:5000/api/assignments/${id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     const data = await res.json();

//     setAssignment(data);
//     setTitle(data.title);
//     setDescription(data.description);
//     setDueDate(data.dueDate?.substring(0,10));
//   };

//   const updateAssignment = async (e) => {

//     e.preventDefault();

//     const token = localStorage.getItem("token");

//     await fetch(
//       `http://localhost:5000/api/assignments/${id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type":"application/json",
//           Authorization:`Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title,
//           description,
//           dueDate
//         })
//       }
//     );

//     navigate(-1);
//   };

//   if(!assignment){
//     return <div className="text-white p-10">Loading...</div>
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-white p-10">

//       <h1 className="text-3xl mb-8 text-yellow-400">
//         Edit Assignment
//       </h1>

//       <form
//         onSubmit={updateAssignment}
//         className="max-w-xl space-y-6"
//       >

//         <input
//           value={title}
//           onChange={(e)=>setTitle(e.target.value)}
//           className="w-full p-3 bg-slate-800 rounded"
//         />

//         <textarea
//           value={description}
//           onChange={(e)=>setDescription(e.target.value)}
//           className="w-full p-3 bg-slate-800 rounded"
//         />

//         <input
//           type="date"
//           value={dueDate}
//           onChange={(e)=>setDueDate(e.target.value)}
//           className="w-full p-3 bg-slate-800 rounded"
//         />

//         <button
//           className="bg-yellow-500 px-6 py-3 rounded"
//         >
//           Update Assignment
//         </button>

//       </form>

//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// export default function EditAssignment() {

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [title,setTitle] = useState("");
//   const [description,setDescription] = useState("");
//   const [dueDate,setDueDate] = useState("");
//   const [pdf,setPdf] = useState(null);

//   useEffect(()=>{
//     fetchAssignment();
//   },[]);

//   const fetchAssignment = async ()=>{

//     const token = localStorage.getItem("token");

//     const res = await fetch(
//       `http://localhost:5000/api/assignments/${id}`,
//       {
//         headers:{
//           Authorization:`Bearer ${token}`
//         }
//       }
//     );

//     const data = await res.json();

//     setTitle(data.title);
//     setDescription(data.description);
//     setDueDate(data.dueDate?.substring(0,10));
//   };

//   const updateAssignment = async (e)=>{

//     e.preventDefault();

//     const token = localStorage.getItem("token");

//     const formData = new FormData();

//     formData.append("title",title);
//     formData.append("description",description);
//     formData.append("dueDate",dueDate);

//     if(pdf){
//       formData.append("pdf",pdf);
//     }

//     await fetch(
//       `http://localhost:5000/api/assignments/${id}`,
//       {
//         method:"PUT",
//         headers:{
//           Authorization:`Bearer ${token}`
//         },
//         body:formData
//       }
//     );

//     navigate(-1);
//   };

//   return(

//     <div className="min-h-screen bg-slate-950 text-white p-10">

//       <h1 className="text-3xl mb-8 text-yellow-400">
//         Edit Assignment
//       </h1>

//       <form
//         onSubmit={updateAssignment}
//         className="max-w-xl space-y-6"
//       >

//         <input
//           value={title}
//           onChange={(e)=>setTitle(e.target.value)}
//           className="w-full p-3 bg-slate-800 rounded"
//         />

//         <textarea
//           value={description}
//           onChange={(e)=>setDescription(e.target.value)}
//           className="w-full p-3 bg-slate-800 rounded"
//         />

//         <input
//           type="date"
//           value={dueDate}
//           onChange={(e)=>setDueDate(e.target.value)}
//           className="w-full p-3 bg-slate-800 rounded"
//         />

//         <div>
//           <p className="text-gray-600 dark:text-gray-500 dark:text-gray-400 mb-2">
//             Replace PDF (optional)
//           </p>

//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={(e)=>setPdf(e.target.files[0])}
//           />
//         </div>

//         <button
//           className="bg-yellow-500 px-6 py-3 rounded"
//         >
//           Update Assignment
//         </button>

//       </form>

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditAssignment() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [dueDate,setDueDate] = useState("");
  const [pdf,setPdf] = useState(null);

  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");

  useEffect(()=>{
    fetchAssignment();
  },[]);

  const fetchAssignment = async ()=>{

    try{

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/assignments/${id}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setTitle(data.title);
      setDescription(data.description);
      setDueDate(data.dueDate?.substring(0,10));

    }catch(err){
      console.log(err);
    }

  };

  const updateAssignment = async (e)=>{

    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try{

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title",title);
      formData.append("description",description);
      formData.append("dueDate",dueDate);

      if(pdf){
        formData.append("pdf",pdf);
      }

      const res = await fetch(
        `http://localhost:5000/api/assignments/${id}`,
        {
          method:"PUT",
          headers:{
            Authorization:`Bearer ${token}`
          },
          body:formData
        }
      );

      if(!res.ok){
        throw new Error("Failed to update assignment");
      }

      setMessage("Assignment updated successfully");

      setTimeout(()=>{
        navigate(-1);
      },1200);

    }catch(err){

      setError(err.message);

    }finally{

      setLoading(false);

    }

  };

  return(
    <div className="p-8 lg:p-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="relative z-10">
          <div className="mb-10">
             <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
               Refactor Task
             </h1>
             <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-2">
               Modify the operational parameters for this assessment module.
             </p>
          </div>

          {message && (
            <div className="mb-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs animate-pulse">
              {message} ✓
            </div>
          )}

          {error && (
            <div className="mb-8 bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs">
              {error}
            </div>
          )}

          <form onSubmit={updateAssignment} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Task Identification</label>
              <input
                type="text"
                placeholder="Operational Title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Instructional Scope</label>
              <textarea
                placeholder="Define the task requirements..."
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                rows="4"
                className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Temporal Deadline</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e)=>setDueDate(e.target.value)}
                className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-black text-center"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Technical Documentation (PDF)</label>
              <div className="relative group/file">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e)=>setPdf(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400 group-hover/file:border-cyan-500/50 transition-all">
                  <FileText size={20}/>
                  <span className="text-xs font-black uppercase tracking-widest italic">{pdf ? pdf.name : "Replace Existing Asset"}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? "Synchronizing Asset..." : "Sync Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}