
import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-rose-500/5">
        <AlertCircle size={48} />
      </div>
      <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 mb-6 uppercase tracking-widest">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium">
        Oops! The page you're looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>
      <Link 
        to="/" 
        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
      >
        <Home size={18} />
        Go Home
      </Link>
    </div>
  );
}
