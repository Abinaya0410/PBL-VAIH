
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Search, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "../components/NotificationBell";

const StudentLayout = () => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const storedName = localStorage.getItem("name") || "Student";
  const initial = storedName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      {/* MOBILE SIDEBAR MOBILE OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
            >
               <Sidebar mobile onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-h-screen h-screen overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 flex items-center justify-between px-6 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
              Student
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <NotificationBell />

            <div className="relative">
              <div 
                onClick={() => setOpenProfile(!openProfile)}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-xl shadow-indigo-500/20 ring-2 ring-white dark:ring-slate-900 cursor-pointer hover:scale-105 transition-all active:scale-95"
              >
                {initial}
              </div>

              {/* DROPDOWN MENU */}
              {openProfile && (
                <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-5 py-3 border-b border-slate-50 dark:border-slate-800 mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logged in as</p>
                    <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-100">{storedName}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setOpenProfile(false);
                      navigate("/profile");
                    }}
                    className="w-full px-5 py-3 text-left text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-500 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Search size={14}/> {/* Placeholder for User icon if needed, but using Search as placeholder based on imports */}
                    </div>
                    My Profile
                  </button>

                  <button 
                    onClick={() => {
                      localStorage.clear();
                      navigate("/");
                    }}
                    className="w-full px-5 py-3 text-left text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                      <LogOut size={14}/> {/* Logout icon */}
                    </div>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
