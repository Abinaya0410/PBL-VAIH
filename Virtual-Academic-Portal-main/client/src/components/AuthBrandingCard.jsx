
import React from "react";
import { GraduationCap, ShieldCheck, User } from "lucide-react";

const AuthBrandingCard = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-slate-800 flex-col justify-center p-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="relative z-10 space-y-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
          <GraduationCap size={40} />
        </div>
        <div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Empowering the Next <br />
            <span className="text-emerald-500 italic">Generation</span> of Learners
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-lg leading-relaxed italic">
            "Experience an intelligence-driven learning community designed for excellence and innovation."
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-10">
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <ShieldCheck className="text-emerald-500 mb-3" size={24} />
            <h3 className="text-white font-bold mb-1">Secure & Validated</h3>
            <p className="text-slate-500 text-sm">Industry-standard authentication and data protection.</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <User className="text-indigo-400 mb-3" size={24} />
            <h3 className="text-white font-bold mb-1">Tailored Experience</h3>
            <p className="text-slate-500 text-sm">Custom features for both Students and Teachers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBrandingCard;
