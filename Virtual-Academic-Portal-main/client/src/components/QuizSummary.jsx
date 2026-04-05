import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Bot, Loader2 } from 'lucide-react';

const QuizSummary = ({ quizData }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const generateSummary = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/quiz-summary`, {
                answers: quizData.answers,
                correctAnswers: quizData.answers.map(a => a.correctAnswer),
                score: quizData.score,
                total: quizData.answers.length
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSummary(res.data.summary);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-8 border-indigo-500/30 border bg-indigo-500/5 relative overflow-hidden group rounded-3xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bot size={120} />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                    <Sparkles size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tight">AI Performance Analysis</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500/60 font-bold">Powered by Gemini AI</p>
                </div>
            </div>

            {summary ? (
                <div className="prose dark:prose-invert max-w-none relative z-10 transition-all duration-500">
                    <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap italic">"{summary}"</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center relative z-10">
                    <p className="text-sm font-bold text-slate-500 mb-6 italic">Generate a personalized AI breakdown of your quiz performance.</p>
                    <button 
                        onClick={generateSummary}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-600/20"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                        {loading ? "Analyzing..." : "Analyze Performance"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizSummary;
