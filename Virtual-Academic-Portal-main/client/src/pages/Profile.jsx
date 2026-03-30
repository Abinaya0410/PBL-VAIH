
import { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, BookOpen, GraduationCap, Briefcase, Award, Save, Edit2, CheckCircle, ShieldCheck } from "lucide-react";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobileNumber: "",
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
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMessage({ type: "error", text: "Failed to load profile data." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
    setMessage({ type: "", text: "" });
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/update-profile", profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.setItem("name", profile.name); // Keep logic simple for local header

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditMode(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-8 py-12">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isStudent = profile.role === "student";
  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <div className="p-8 lg:p-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center text-4xl font-black text-white shadow-2xl ${isStudent ? 'from-indigo-500 to-purple-600 shadow-indigo-500/20' : 'from-cyan-500 to-blue-600 shadow-cyan-500/20'}`}>
              {initial}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{profile.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isStudent ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'}`}>
                  {profile.role}
                </span>
                <span className="text-slate-400 text-xs font-bold italic">{profile.email}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => editMode ? saveProfile() : setEditMode(true)}
            disabled={loading}
            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all active:scale-95 ${
              editMode 
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20' 
              : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 shadow-lg'
            }`}
          >
            {editMode ? <Save size={16}/> : <Edit2 size={16}/>}
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.type === "success" ? "bg-emerald-50 border border-emerald-100 text-emerald-600" : "bg-rose-50 border border-rose-100 text-rose-600"
          }`}>
            <CheckCircle size={18}/> {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - CORE INFO */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Details</h3>
              
              <div className="space-y-4">
                <InputWrapper label="Full Name" icon={<User size={14}/>}>
                  <input 
                    name="name" 
                    value={profile.name} 
                    onChange={handleChange} 
                    disabled={!editMode}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm dark:text-white disabled:opacity-70"
                  />
                </InputWrapper>

                <InputWrapper label="Email (Read Only)" icon={<Mail size={14}/>}>
                  <input 
                    value={profile.email} 
                    disabled 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 pl-10 pr-4 py-3 rounded-xl outline-none font-bold text-sm dark:text-white opacity-50 cursor-not-allowed"
                  />
                </InputWrapper>

                <InputWrapper label="Mobile Number" icon={<Phone size={14}/>}>
                  <input 
                    name="mobileNumber" 
                    value={profile.mobileNumber} 
                    onChange={handleChange} 
                    disabled={!editMode}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-sm dark:text-white disabled:opacity-70"
                  />
                </InputWrapper>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - ROLE SPECIFIC INFO */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                {isStudent ? "Academic Information" : "Professional Information"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isStudent ? (
                  <>
                    <ProfileField icon={<BookOpen size={14}/>} label="Institution / College" name="collegeName" value={profile.collegeName} onChange={handleChange} disabled={!editMode} />
                    <ProfileField icon={<GraduationCap size={14}/>} label="Degree" name="degree" value={profile.degree} onChange={handleChange} disabled={!editMode} />
                    <ProfileField icon={<ShieldCheck size={14}/>} label="Department" name="department" value={profile.department} onChange={handleChange} disabled={!editMode} />
                    <ProfileField icon={<Award size={14}/>} label="Year / Level" name="year" value={profile.year} onChange={handleChange} disabled={!editMode} />
                    <ProfileField icon={<User size={14}/>} label="Interests" name="interest" value={profile.interest} onChange={handleChange} disabled={!editMode} spanFull />
                  </>
                ) : (
                  <>
                    <ProfileField icon={<BookOpen size={14}/>} label="Institution Name" name="institutionName" value={profile.institutionName} onChange={handleChange} disabled={!editMode} />
                    <ProfileField icon={<Briefcase size={14}/>} label="Designation" name="designation" value={profile.designation} onChange={handleChange} disabled={!editMode} />
                    <ProfileField icon={<GraduationCap size={14}/>} label="Qualification" name="qualification" value={profile.qualification} onChange={handleChange} disabled={!editMode} />
                    <ProfileField icon={<Award size={14}/>} label="Work Experience" name="experience" value={profile.experience} onChange={handleChange} disabled={!editMode} />
                    <ProfileField icon={<User size={14}/>} label="Subjects Teaching" name="subjectsTeaching" value={profile.subjectsTeaching} onChange={handleChange} disabled={!editMode} spanFull />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputWrapper({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        {children}
      </div>
    </div>
  );
}

function ProfileField({ icon, label, name, value, onChange, disabled, spanFull }) {
  return (
    <div className={`space-y-1.5 ${spanFull ? 'md:col-span-2' : ''}`}>
      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">{label}</label>
      <div className="relative group">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors`}>
          {icon}
        </div>
        <input 
          name={name} 
          value={value || ""} 
          onChange={onChange} 
          disabled={disabled}
          placeholder={`Enter your ${label.toLowerCase()}`}
          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 pl-10 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-sm dark:text-white disabled:opacity-70"
        />
      </div>
    </div>
  );
}
