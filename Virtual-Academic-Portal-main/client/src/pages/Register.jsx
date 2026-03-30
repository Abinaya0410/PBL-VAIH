
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { GraduationCap, ShieldCheck, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import AuthBrandingCard from "../components/AuthBrandingCard";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on change
  };

  const validateMobile = (number) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Validations
    if (!validateMobile(formData.mobileNumber)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        role: formData.role
      });

      // Save basics for immediate UI feel
      localStorage.setItem("name", formData.name);
      localStorage.setItem("email", formData.email);
      localStorage.setItem("role", formData.role);
      localStorage.setItem("token", response.token); 

      setSuccess(true);
      setTimeout(() => {
        navigate("/complete-profile");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.error(err);
    } finally {
      if (!success) setLoading(false);
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
            {/* TASK 1: ADD TITLE TO REGISTRATION PAGE CARD */}
            <h1 className="text-sm font-black text-emerald-600 tracking-widest uppercase mb-1">Virtual Academic Portal</h1>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">Create Your Account</h2>
            <p className="text-slate-500 font-medium">Join our global community of academic excellence.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-[2rem] flex flex-col gap-2 animate-in zoom-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle size={18} />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm">Registration Successful!</h4>
              </div>
              <p className="text-xs font-bold text-emerald-600/80 ml-11">
                Your account has been created. Redirecting to complete your profile...
              </p>
              <div className="w-full bg-emerald-100 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full animate-progress-grow"></div>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* NAME */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* MOBILE */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mobile Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="10-digit number"
                    autoComplete="tel"
                    maxLength="10"
                    className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 pl-12 pr-12 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                    onChange={handleChange}
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

              {/* CONFIRM PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ROLE SELECTION */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "student" })}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                    formData.role === "student" 
                    ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    formData.role === "student" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  }`}>
                    <GraduationCap size={20} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    formData.role === "student" ? "text-emerald-600" : "text-slate-400"
                  }`}>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "teacher" })}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                    formData.role === "teacher" 
                    ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    formData.role === "teacher" ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  }`}>
                    <User size={20} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    formData.role === "teacher" ? "text-indigo-600" : "text-slate-400"
                  }`}>Teacher</span>
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <span className="relative z-10">{loading ? "Processing..." : "Create Account"}</span>
              {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-indigo-600 opacity-0 group-hover:opacity-10 shadow-inner transition-opacity"></div>
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-slate-500">
            Already a member?{" "}
            <Link to="/login" className="text-emerald-600 font-black uppercase tracking-wider hover:underline ml-1">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
