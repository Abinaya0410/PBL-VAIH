
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  CheckCircle,
  ClipboardList,
  BarChart3,
  LogOut,
  Zap
} from "lucide-react";

export default function Sidebar({ mobile, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const role = localStorage.getItem("role");
  const isStudent = role === "student";

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/student-dashboard" },
    { name: "Explore Courses", icon: BookOpen, path: "/available-courses" },
    { name: "My Learning", icon: GraduationCap, path: "/my-courses-student" },
    { name: "Completed", icon: CheckCircle, path: "/completed-courses" },
    { name: "Quiz Attempts", icon: ClipboardList, path: "/quiz-attempts" },
    { name: "My Score", icon: Zap, path: "/learner-xp" },
    { name: "Analytics", icon: BarChart3, path: "/student-analytics" },
  ];

  return (
    <div className={`w-72 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 transition-all ${mobile ? 'flex' : 'hidden lg:flex'}`}>
      
      {/* BRANDING */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
          <GraduationCap size={24}/>
        </div>
        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white italic">Virtual Academic Portal</h2>
      </div>

      {/* Menu */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={index}
              onClick={() => handleNav(item.path)}
              className={`flex items-center gap-3 w-full p-3.5 rounded-2xl transition-all duration-300 font-semibold text-sm ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 translate-x-1' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:translate-x-1'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}
      </nav>


      {/* Logout */}
      <div
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 mt-6 rounded-lg cursor-pointer text-red-400 hover:bg-red-900/20 transition-all duration-300 group"
      >
        <div className="p-2 rounded-lg bg-red-400/10 group-hover:bg-red-400/20 transition-colors">
          <LogOut size={18} />
        </div>
        <span className="font-semibold">Logout</span>
      </div>
    </div>
  );
}
