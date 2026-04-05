import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  LogOut,
  GraduationCap,
  Bell
} from "lucide-react";

export default function TeacherSidebar({ mobile, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments/pending-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPendingCount(data.count || 0);
      } catch (err) {
        console.error("Failed to fetch pending count", err);
      }
    };

    fetchPendingCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/teacher" },
    { name: "Create Course", icon: BookOpen, path: "/create-course" },
    { name: "My Courses", icon: FileText, path: "/my-courses" },
    { name: "Submissions", icon: Bell, path: "/teacher/submissions", badge: pendingCount },
    { name: "Analytics", icon: BarChart3, path: "/teacher/analytics" },
  ];

  return (
    <div className={`w-72 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 transition-all ${mobile ? 'flex' : 'hidden lg:flex'}`}>
      
      {/* BRANDING */}
      <div className="flex items-center gap-3 mb-10 px-2 text-slate-900 dark:text-white">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg text-white shadow-lg shadow-cyan-500/20">
          <GraduationCap size={24}/>
        </div>
        <h2 className="text-xl font-black tracking-tight italic text-cyan-600 dark:text-cyan-400">Virtual Academic Portal</h2>
      </div>

      {/* Menu */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== "/teacher" && location.pathname.startsWith(item.path));

          return (
            <button
              key={index}
              onClick={() => handleNav(item.path)}
              className={`flex items-center justify-between w-full p-3.5 rounded-2xl transition-all duration-300 font-semibold text-sm ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 translate-x-1' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:translate-x-1'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                {item.name}
              </div>
              {item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white text-cyan-600' : 'bg-cyan-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>


      {/* Logout */}
      <div
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 mt-6 rounded-xl cursor-pointer text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-300 group"
      >
        <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/20 group-hover:bg-rose-200 dark:group-hover:bg-rose-900/40 transition-colors">
          <LogOut size={18} />
        </div>
        <span className="font-bold">Logout</span>
      </div>
    </div>
  );
}
