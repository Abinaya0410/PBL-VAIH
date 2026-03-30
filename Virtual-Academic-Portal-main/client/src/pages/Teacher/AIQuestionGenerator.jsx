import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QuestionGenerator from '../../components/QuestionGenerator';

const AIQuestionGenerator = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[var(--background)] p-6 md:p-10 lg:p-16">
            <div className="max-w-5xl mx-auto space-y-12">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-[var(--border)]">
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-primary hover:translate-x-1 transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <ArrowLeft size={16} />
                            Go Back
                        </button>
                        <div className="space-y-2">
                             <h1 className="text-4xl font-black tracking-tight uppercase italic text-slate-800 dark:text-white">AI Studio</h1>
                             <p className="text-[var(--secondary)] font-bold italic opacity-80 text-sm">Empower your courses with high-quality AI generated content instantly.</p>
                        </div>
                    </div>
                </div>

                {/* MODULAR COMPONENT */}
                <QuestionGenerator />

                <div className="p-10 text-center bg-indigo-500/5 border-dashed border-2 border-indigo-500/20 rounded-[40px] max-w-4xl mx-auto">
                    <p className="text-slate-400 font-bold italic mb-6 text-sm">Review the generated questions above and add them to your course question bank.</p>
                    <button 
                        className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all" 
                        onClick={() => navigate("/my-courses")}
                    >
                        Go to My Courses
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIQuestionGenerator;
