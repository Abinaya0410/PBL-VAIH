import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2 } from 'lucide-react';

const PDFSummary = ({ lessonId, textContent, initialSummary }) => {
    const [summary, setSummary] = useState(initialSummary || null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const generateSummary = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/ai/pdf-summary', {
                lessonId,
                textContent
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
        <div className="bg-indigo-600/10 p-8 rounded-3xl border border-indigo-500/30 backdrop-blur-xl h-fit">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="font-black uppercase tracking-tight text-lg italic">AI Lesson Analyzer</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-60">PDF Context</p>
                </div>
            </div>

            {summary ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                   <div className="prose prose-invert prose-sm max-w-none text-gray-200 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 whitespace-pre-wrap font-medium italic">
                      {summary}
                   </div>
                   <button 
                    onClick={() => setSummary(null)}
                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors uppercase"
                   >
                     Clear Summary
                   </button>
                </div>
            ) : (
                <div className="space-y-6 text-center">
                  <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
                    Generate an AI-powered summary, key points, and important topics from this academic lesson.
                  </p>
                  <button
                    onClick={generateSummary}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    {loading ? "Analyzing Material..." : "Generate AI Summary"}
                  </button>
                </div>
            )}
        </div>
    );
};

export default PDFSummary;
