import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  HelpCircle, 
  PlusCircle, 
  Layout, 
  ChevronLeft, 
  Database,
  Star,
  Zap,
  CheckCircle,
  Hash
} from "lucide-react";

export default function UploadQuestions() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/lessons/${lessonId}/question-bank`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: form.question,
            options: [
              form.optionA,
              form.optionB,
              form.optionC,
              form.optionD,
            ],
            correctAnswer: form.correctAnswer,
            difficulty: "medium",
          }),
        }
      );

      const data = await res.json();
      console.log("Saved:", data);

      setSuccess(true);
      setForm({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 flex justify-center items-start min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="relative z-10">
          <div className="mb-10 flex justify-between items-start">
             <div>
               <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Knowledge Node Injection</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-2">Populate the lesson's question bank with new instructional challenges.</p>
             </div>
             <button 
                onClick={() => navigate(-1)}
                className="text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
                title="Back to Nexus"
             >
               <ChevronLeft size={32} />
             </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {success && (
              <div className="md:col-span-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-center font-black uppercase tracking-widest text-xs animate-pulse">
                Question Injected Successfully ✓
              </div>
            )}

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Instructional Query</label>
              <div className="relative">
                <HelpCircle className="absolute left-4 top-4 text-slate-400 dark:text-slate-300 dark:text-slate-600" size={20} />
                <textarea
                  name="question"
                  required
                  placeholder="Formulate the inquiry for the student pool..."
                  value={form.question}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold h-32 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Assessment Vectors</label>
              
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((key) => (
                  <div key={key} className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 dark:text-slate-300 dark:text-slate-600 uppercase group-focus-within:text-indigo-500 transition-colors">Op_{key}</span>
                    <input
                      name={`option${key}`}
                      required
                      placeholder={`Instructional Alternative ${key}`}
                      value={form[`option${key}`]}
                      onChange={handleChange}
                      className="w-full pl-16 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Validation Parameter</label>
              
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center justify-center space-y-6">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-indigo-500/10 text-indigo-500">
                  <Database size={24}/>
                </div>
                
                <div className="w-full space-y-3">
                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center block">Correct Vector ID</label>
                  <div className="flex gap-3 justify-center">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm({...form, correctAnswer: opt})}
                        className={`w-12 h-12 rounded-xl font-black transition-all ${
                          form.correctAnswer === opt 
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-110' 
                          : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-indigo-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 italic text-[10px] font-medium">
                  <Zap size={12} className="text-amber-500"/>
                  <span>Real-time persistence enabled</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={loading || !form.correctAnswer}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin"></div>
                ) : (
                  <PlusCircle size={18}/>
                )}
                {loading ? "Synchronizing..." : "Inject Question to Bank"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
