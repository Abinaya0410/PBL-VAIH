
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthBrandingCard from "../components/AuthBrandingCard";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });

      // Store tokens and basic info
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("name", data.user.name);

      // Task 2: Exact same flow logic
      if (!data.user.profileCompleted) {
        navigate("/complete-profile");
      } else {
        if (data.user.role === "teacher") {
          navigate("/teacher");
        } else {
          navigate("/student-dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <AuthBrandingCard />

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20">
        <div className="w-full max-w-xl">
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden flex justify-center mb-6">
               <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <GraduationCap size={28} />
               </div>
            </div>
            <h1 className="text-sm font-black text-emerald-600 tracking-widest uppercase mb-1">Virtual Academic Portal</h1>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Continue your journey in academic excellence.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Password</label>
                <Link to="/forgot-password-dummy" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 pl-12 pr-12 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <span className="relative z-10">{loading ? "Signing In..." : "Sign In"}</span>
              {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-indigo-600 opacity-0 group-hover:opacity-10 shadow-inner transition-opacity"></div>
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-slate-500">
            Don’t have an account?{" "}
            <Link to="/register" className="text-emerald-600 font-black uppercase tracking-wider hover:underline ml-1">
              Join Academic Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
