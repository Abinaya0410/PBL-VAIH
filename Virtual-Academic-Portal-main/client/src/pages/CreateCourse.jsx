import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCourse() {
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: course.title,
          description: course.description
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // alert("Course Created Successfully!");
        // navigate("/teacher");
        navigate(`/course/${data._id}`);
      } else {
        alert(data.message || "Error creating course");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 p-10 rounded-3xl w-[500px] border border-slate-200 dark:border-slate-800 shadow-2xl transition-all"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Create New Course
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-2">
            Enter the course title and description to create a new course.
          </p>
        </div>

        <input
          name="title"
          placeholder="Course Title"
          value={course.title}
          onChange={handleChange}
          className="w-full mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
          required
        />

        <textarea
          name="description"
          placeholder="Course Description"
          value={course.description}
          onChange={handleChange}
          className="w-full mb-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none transition-all h-32"
          required
        />

        <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-lg font-semibold transition-all duration-300">
          Create Course
        </button>
      </form>
    </div>
  );
}