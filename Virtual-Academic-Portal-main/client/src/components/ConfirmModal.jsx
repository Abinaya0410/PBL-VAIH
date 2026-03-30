import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Trash2, X } from "lucide-react";

/**
 * Reusable Confirmation Modal with Framer Motion animations
 * @param {boolean} isOpen - Control visibility
 * @param {function} onClose - Close handler
 * @param {function} onConfirm - Confirm action handler
 * @param {string} title - Modal title
 * @param {string} message - Modal body text
 * @param {string} confirmLabel - Text for the confirm button
 * @param {boolean} isLoading - Loading state for the action
 */
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this? This action cannot be undone.",
  confirmLabel = "Delete",
  isLoading = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center min-h-screen p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            {/* Header / Icon */}
            <div className="flex h-32 items-center justify-center bg-rose-50 dark:bg-rose-500/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500 shadow-lg shadow-rose-500/20 text-white">
                <Trash2 size={32} />
              </div>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-3">
                {title}
              </h3>
              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/5 p-4 rounded-2xl border border-amber-200 dark:border-amber-500/20 mb-6">
                <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-200 text-left font-medium">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="px-6 py-3.5 rounded-2xl bg-rose-500 text-white font-bold uppercase tracking-widest text-[11px] hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/25 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Trash2 size={14} />
                      {confirmLabel}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
