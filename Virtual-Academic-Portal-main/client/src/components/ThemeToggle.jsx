
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
        theme === 'dark'
          ? 'bg-slate-800 text-yellow-400 border border-slate-700 hover:bg-slate-700'
          : 'bg-slate-100 text-indigo-600 border border-slate-200 hover:bg-slate-200'
      }`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
