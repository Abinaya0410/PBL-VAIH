import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, ListPlus, CheckCircle2, AlertCircle } from 'lucide-react';

const QuestionGenerator = () => {
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(5);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/generate-questions`, {
                topic,
                count
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestions(res.data.questions);
        } catch (err) {
            console.error(err);
            setError("Failed to generate questions. Please check your topic and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="glass-card p-10 rounded-[40px] border-cyan-500/20 shadow-2xl bg-gradient-to-br from-white to-cyan-50 dark:from-slate-900 dark:to-cyan-900/10 border relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-cyan-600">
                   <ListPlus size={180} />
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-cyan-600 rounded-3xl text-white shadow-xl shadow-cyan-600/20">
                        <Sparkles size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white">AI Question Generator</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500 font-bold">Powered by Gemini Pro</p>
                    </div>
                </div>

                <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 italic">Topic or Subject</label>
                            <input 
                                type="text"
                                placeholder="e.g. Operating Systems, Data Structures..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-cyan-500 outline-none transition-all placeholder:text-slate-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 italic">Q-Count</label>
                           <select 
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-cyan-500 outline-none transition-all"
                           >
                              {[3, 5, 8, 10, 15].map(n => <option key={n} value={n}>{n} Questions</option>)}
                           </select>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading || !topic}
                        className="w-full bg-cyan-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-cyan-500 transition-all shadow-2xl shadow-cyan-600/30 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <ListPlus size={20} />}
                        {loading ? "Generatng Intelligent MCQs..." : "Generate MCQs"}
                    </button>
                    {error && (
                        <div className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 mt-4 border border-rose-500/20 transition-all">
                           <AlertCircle size={14} />
                           {error}
                        </div>
                    )}
                </form>
            </div>

            {questions.length > 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
                    <div className="flex items-center justify-between px-6">
                        <h3 className="text-xl font-black uppercase tracking-tight italic">Generated Results ({questions.length})</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 italic">
                            <CheckCircle2 size={12} /> Ready for Review
                        </p>
                    </div>
                    {questions.map((q, idx) => (
                        <div key={idx} className="glass-card p-8 rounded-[32px] border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 transition-all group bg-white dark:bg-slate-900 border">
                            <div className="flex gap-6">
                                <span className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-500 group-hover:bg-cyan-600 group-hover:text-white transition-all shrink-0">
                                    {idx + 1}
                                </span>
                                <div className="space-y-6 flex-1 text-slate-100 italic font-black uppercase tracking-tighter">
                                    <h4 className="text-lg font-black leading-tight text-slate-800 dark:text-white">{q.question}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt, i) => (
                                            <div 
                                                key={i} 
                                                className={`p-4 rounded-2xl text-xs font-bold border ${ q.answer === opt ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400' }`}
                                            >
                                               {opt}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2 flex items-center gap-2 italic">
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                        Correct Answer: <span className="text-emerald-500 font-bold">{q.answer}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuestionGenerator;
