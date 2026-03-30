
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function StudentCourses() {
  const navigate = useNavigate();

  // Dummy courses (temporary until backend is ready)
  const courses = [
    {
      _id: "1",
      title: "Java",
      description: "Basics of Java programming"
    },
    {
      _id: "2",
      title: "Python",
      description: "Python fundamentals"
    },
    {
      _id: "3",
      title: "Web Development",
      description: "HTML, CSS, JS basics"
    }
  ];

  return (
    <div className="p-8 lg:p-12 space-y-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-black uppercase tracking-tight leading-none text-slate-900 dark:text-white">
          My Learning Studio
          <span className="block text-sm font-bold text-indigo-500 mt-2 tracking-widest uppercase">Intellectual Repository</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/student-course/${course._id}`)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] group cursor-pointer hover:border-indigo-500 transition-all hover:-translate-y-2 flex flex-col h-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
              
              <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform mb-8 relative z-10">
                <GraduationCap size={28} />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight group-hover:text-indigo-500 transition-colors leading-tight mb-4 text-slate-900 dark:text-white relative z-10">
                {course.title}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic line-clamp-3 leading-relaxed opacity-80 relative z-10 flex-1">
                {course.description}
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 italic">Domain: Active</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Resume Path →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
