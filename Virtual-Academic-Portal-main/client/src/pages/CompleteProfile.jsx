
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GraduationCap, BookOpen, ShieldCheck, Award, Briefcase, User, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    // Student specific
    collegeName: "",
    degree: "",
    department: "",
    year: "",
    interest: "",
    // Teacher specific
    institutionName: "",
    designation: "",
    qualification: "",
    experience: "",
    subjectsTeaching: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // ISSUE 2: Verify token exists before fetching
        if (!token) {
          navigate("/login");
          return;
        }

        // ISSUE 2: Verify request uses Authorization header correctly
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });

        if (res.data.profileCompleted) {
           redirectDashboard(res.data.role);
           return;
        }

        // Successfully loaded data, clear any previous error if any
        setError("");
        setProfile(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error("Fetch error:", err);
        // Only show error if we couldn't get the user despite having a token
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Session expired or server error. Please try logging in again.");
        }
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const redirectDashboard = (role) => {
    if (role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/student-dashboard");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:5000/api/users/update-profile", profile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update local role if server returned a different one (safety)
      if (res.data.user?.role) {
        localStorage.setItem("role", res.data.user.role);
      }

      setTimeout(() => {
        redirectDashboard(res.data.user?.role || profile.role);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      if (!success) setLoading(false);
    }
  };

  if (fetching) {
     return (
       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
       </div>
     );
  }

  const isStudent = profile.role === "student";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 flex items-center justify-center font-sans">
      {/* ISSUE 1: FULL WIDTH CENTERED CONTAINER */}
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col shadow-emerald-500/5 transition-all duration-500 hover:shadow-emerald-500/10">
        
        {/* HEADER SECTION - NO SIDEBAR */}
        <div className="bg-slate-900 p-12 text-white relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 animate-bounce-subtle">
              <GraduationCap size={44} />
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tight leading-tight mb-2 uppercase">Complete Your Profile</h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-2xl px-4 md:px-0">
                Tell us more about your academic background to personalize your learning experience.
              </p>
            </div>
          </div>
        </div>

        {/* FORM CONTENT */}
        <div className="flex-1 p-8 md:p-16">
          {success && (
            <div className="mb-10 p-6 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-[2rem] flex flex-col gap-2 animate-in slide-in-from-top-4 duration-500 shadow-xl shadow-emerald-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-[0.2em] text-sm">Profile Completed!</h4>
                  <p className="text-[10px] font-black uppercase text-emerald-600/60 leading-none mt-0.5">Redirecting to your dashboard...</p>
                </div>
              </div>
              <div className="w-full bg-emerald-100 h-1.5 mt-4 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full animate-progress-grow"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-10 p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl text-sm font-bold flex items-center gap-4 animate-shake">
              <div className="w-10 h-10 bg-rose-500/10 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="uppercase tracking-widest text-[10px] mb-0.5">Registration Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="bg-slate-50/50 p-8 md:p-12 rounded-[2rem] border border-slate-100/50">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-[10px] font-black italic">AP</div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Academic Background</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                {isStudent ? (
                  <>
                    <Input 
                      label="College / University" 
                      icon={<BookOpen size={18}/>} 
                      name="collegeName" 
                      value={profile.collegeName} 
                      onChange={handleChange} 
                      placeholder="e.g. Stanford University"
                      required
                    />
                    <Input 
                      label="Degree / Course" 
                      icon={<GraduationCap size={18}/>} 
                      name="degree" 
                      value={profile.degree} 
                      onChange={handleChange} 
                      placeholder="e.g. B.Tech Computer Science"
                      required
                    />
                    <Input 
                      label="Department" 
                      icon={<ShieldCheck size={18}/>} 
                      name="department" 
                      value={profile.department} 
                      onChange={handleChange} 
                      placeholder="e.g. Engineering"
                      required
                    />
                    <Input 
                      label="Year / Level" 
                      icon={<Award size={18}/>} 
                      name="year" 
                      value={profile.year} 
                      onChange={handleChange} 
                      placeholder="e.g. 3rd Year"
                      required
                    />
                    <div className="md:col-span-2">
                      <Input 
                        label="Interests" 
                        icon={<User size={18}/>} 
                        name="interest" 
                        value={profile.interest} 
                        onChange={handleChange} 
                        placeholder="e.g. AI, Web Dev, Blockchain"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Input 
                      label="Institution Name" 
                      icon={<BookOpen size={18}/>} 
                      name="institutionName" 
                      value={profile.institutionName} 
                      onChange={handleChange} 
                      placeholder="e.g. MIT"
                      required
                    />
                    <Input 
                      label="Designation" 
                      icon={<Briefcase size={18}/>} 
                      name="designation" 
                      value={profile.designation} 
                      onChange={handleChange} 
                      placeholder="e.g. Senior Professor"
                      required
                    />
                    <Input 
                      label="Qualification" 
                      icon={<GraduationCap size={18}/>} 
                      name="qualification" 
                      value={profile.qualification} 
                      onChange={handleChange} 
                      placeholder="e.g. PhD in CS"
                      required
                    />
                    <Input 
                      label="Work Experience" 
                      icon={<Award size={18}/>} 
                      name="experience" 
                      value={profile.experience} 
                      onChange={handleChange} 
                      placeholder="e.g. 8 Years"
                      required
                    />
                    <div className="md:col-span-2">
                      <Input 
                        label="Subjects Teaching" 
                        icon={<User size={18}/>} 
                        name="subjectsTeaching" 
                        value={profile.subjectsTeaching} 
                        onChange={handleChange} 
                        placeholder="e.g. Data Structures, OS"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
               <button
                disabled={loading}
                className={`flex-1 w-full bg-slate-900 text-white p-7 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-800 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden group ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10">{loading ? "Processing Profile..." : "Complete Profile"}</span>
                {!loading && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-indigo-600 opacity-0 group-hover:opacity-10 shadow-inner transition-opacity duration-500"></div>
              </button>
              
              <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                 <CheckCircle className="text-emerald-500" size={18} />
                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Safe & Secure</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ label, icon, name, value, onChange, placeholder, required }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between ml-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
        {required && <span className="text-[10px] font-black text-rose-400 uppercase italic">Required</span>}
      </div>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-all duration-300">
          {icon}
        </div>
        <input
          type="text"
          name={name}
          value={value || ""}
          placeholder={placeholder}
          className="w-full bg-white border-2 border-slate-100 pl-16 pr-6 py-5 rounded-3xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all duration-300 font-bold text-slate-700 shadow-sm hover:border-slate-200"
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
}
