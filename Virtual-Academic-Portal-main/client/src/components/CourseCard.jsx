

// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// export default function CourseCard({ course }) {
//   const navigate = useNavigate();

//   const progress = course.progress || 0;
//   const teacherInitial =
//     course.teacher?.name?.charAt(0).toUpperCase() || "T";

//   return (
//     <motion.div
//       whileHover={{ scale: 1.02, y: -3 }}
//       transition={{ duration: 0.2 }}
//       className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-violet-500/20 transition cursor-pointer"
//     >
//       {/* Course Image */}
//       <div className="relative">
//         <img
//           src={
//             course.thumbnail ||
//             "https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
//           }
//           alt={course.title}
//           className="h-32 w-full object-cover"
//         />

//         {/* Image Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
//       </div>

//       {/* Course Content */}
//       <div className="p-4">

//         {/* Title */}
//         <h3 className="text-md font-semibold text-white mb-2 line-clamp-1">
//           {course.title}
//         </h3>

//         {/* Instructor */}
//         <div className="flex items-center gap-2 mb-3">

//           <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs font-bold text-white">
//             {teacherInitial}
//           </div>

//           <p className="text-xs text-gray-600 dark:text-gray-500 dark:text-gray-400">
//             {course.teacher?.name || "Instructor"}
//           </p>

//         </div>

//         {/* Progress Section */}
//         <div className="flex justify-between text-xs text-gray-600 dark:text-gray-500 dark:text-gray-400 mb-1">
//           <span>Progress</span>
//           <span>{progress}%</span>
//         </div>

//         {/* Progress Bar */}
//         <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
//           <div
//             className="bg-violet-500 h-2 rounded-full transition-all"
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         {/* Button */}
//         <button
//           onClick={() => navigate(`/course/${course._id}`)}
//           className="w-full bg-violet-600 hover:bg-violet-700 text-white py-1.5 rounded-md text-sm transition"
//         >
//           Continue
//         </button>

//       </div>
//     </motion.div>
//   );
// }



import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  const progress = course.progress || 0;
  const teacherInitial =
    course.teacher?.name?.charAt(0).toUpperCase() || "T";

  return (
    <div
      onClick={() => navigate(`/student-course/${course._id}`)}
      className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-md hover-lift cursor-pointer"
    >
      {/* Course Image */}
      <div className="relative">
        <img
          src={
            course.thumbnail ||
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
          }
          alt={course.title}
          className="h-32 w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Course Content */}
      <div className="p-4">

        {/* Title */}
        <h3 className="text-md font-semibold text-white mb-2 line-clamp-1">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">

          <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-xs font-bold text-white">
            {teacherInitial}
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-500 dark:text-gray-400">
            {course.teacher?.name || "Instructor"}
          </p>

        </div>

        {/* Progress Section */}
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
          <div
            className="bg-violet-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={() => navigate(`/student-course/${course._id}`)}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-1.5 rounded-md text-sm transition"
        >
          Continue
        </button>

      </div>
    </motion.div>
  );
}