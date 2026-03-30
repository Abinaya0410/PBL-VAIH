import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Info, XCircle, X } from "lucide-react";

/**
 * Modern Toast/Snackbar component
 * @param {boolean} isOpen - Control visibility
 * @param {function} onClose - Close handler
 * @param {string} message - Text to display
 * @param {string} type - 'success', 'error', 'info'
 * @param {number} duration - Auto-dismiss duration in ms (default 3000)
 */
const Toast = ({ 
  isOpen, 
  onClose, 
  message, 
  type = "success", 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const variants = {
    success: {
      icon: <CheckCircle className="text-emerald-500" size={18} />,
      bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
      text: "text-emerald-500",
      progress: "bg-emerald-500"
    },
    error: {
      icon: <XCircle className="text-rose-500" size={18} />,
      bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-500/20 shadow-rose-500/10",
      text: "text-rose-500",
      progress: "bg-rose-500"
    },
    info: {
      icon: <Info className="text-indigo-500" size={18} />,
      bg: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/10",
      text: "text-indigo-500",
      progress: "bg-indigo-500"
    }
  };

  const style = variants[type] || variants.info;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0, y: 50, scale: 0.9 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: 50, scale: 0.95 }}
           className={`fixed bottom-8 right-8 z-[150] min-w-[320px] max-w-md overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-md ${style.bg}`}
        >
          <div className="flex items-center gap-3">
             <div className="shrink-0">
               {style.icon}
             </div>
             <p className="flex-1 text-sm font-black uppercase tracking-tight leading-none pt-0.5">
               {message}
             </p>
             <button 
               onClick={onClose}
               className="ml-2 shrink-0 p-1 text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-lg transition-colors"
             >
               <X size={16} />
             </button>
          </div>

          {/* Auto-dismiss progress bar */}
          {duration > 0 && (
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-1 ${style.progress}`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
