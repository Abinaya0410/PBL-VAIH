import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  ChevronLeft,
  GraduationCap,
  ShieldAlert
} from "lucide-react";

export default function QuizInstructions() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  // These could be fetched from API, but keeping for now as requested
  const quizInfo = {
    title: "Final Assessment",
    questions: 30,
    timeLimit: 45,
    passingScore: 60,
    attempts: "Unlimited until pass"
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex items-center justify-center animate-in fade-in duration-700">
      
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-10 text-white relative">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <FileText size={32} />
             </div>
             <div className="space-y-2">
                <h1 className="text-3xl font-black uppercase tracking-tight leading-none">{quizInfo.title}</h1>
                <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Entrance Requirements & Protocol</p>
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10 space-y-10">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-6">
            <InstructionStat icon={<Clock className="text-blue-500" size={18}/>} label="Time Limit" value={`${quizInfo.timeLimit} Min`} />
            <InstructionStat icon={<FileText className="text-indigo-500" size={18}/>} label="Questions" value={quizInfo.questions} />
            <InstructionStat icon={<CheckCircle className="text-emerald-500" size={18}/>} label="Pass Mark" value={`${quizInfo.passingScore}%`} />
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <ShieldAlert size={14} className="text-amber-500" />
                  Mandatory Guidelines
               </h3>
               <div className="grid grid-cols-1 gap-3">
                  <RuleItem text="Do not refresh the browser page during the assessment." />
                  <RuleItem text="Switching tabs or minimizing the window may terminate the session." />
                  <RuleItem text="Ensure a stable internet connection before beginning." />
                  <RuleItem text="All answers are automatically submitted when the timer expires." />
               </div>
            </section>

            <section className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                     <GraduationCap size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-tight mb-1">{quizInfo.attempts}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Your highest score will be recorded on your permanent transcript once passing threshold is met.</p>
                  </div>
               </div>
            </section>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate(`/attempt-quiz/${courseId}`)}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <Play size={18} fill="currentColor" />
            Initialize Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

function InstructionStat({ icon, label, value }) {
  return (
    <div className="text-center space-y-2 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
       <div className="flex justify-center">{icon}</div>
       <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
          <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{value}</p>
       </div>
    </div>
  );
}

function RuleItem({ text }) {
  return (
    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
       <p className="text-xs font-bold leading-relaxed">{text}</p>
    </div>
  );
}
