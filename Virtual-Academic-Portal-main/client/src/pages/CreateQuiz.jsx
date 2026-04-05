
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// export default function CreateQuiz() {
//   const { courseId } = useParams();

//   const [title, setTitle] = useState("");
//   const [course, setCourse] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const [questions, setQuestions] = useState([
//     {
//       question: "",
//       options: ["", "", "", ""],
//       correctAnswer: ""
//     }
//   ]);

//   useEffect(() => {
//     fetchCourse();
//   }, []);

//   const fetchCourse = async () => {
//     const token = localStorage.getItem("token");

//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/teacher`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     const data = await res.json();
//     const current = data.find(c => c._id === courseId);
//     setCourse(current);

//     if (current) {
//       setTitle(`${current.title} Final Quiz`);
//     }
//   };

//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       { question: "", options: ["", "", "", ""], correctAnswer: "" }
//     ]);
//   };

//   const handleQuestionChange = (index, value) => {
//     const updated = [...questions];
//     updated[index].question = value;
//     setQuestions(updated);
//   };

//   const handleOptionChange = (qIndex, optIndex, value) => {
//     const updated = [...questions];
//     updated[qIndex].options[optIndex] = value;
//     setQuestions(updated);
//   };

//   const handleCorrectAnswer = (index, value) => {
//     const updated = [...questions];
//     updated[index].correctAnswer = value;
//     setQuestions(updated);
//   };

//   const saveQuiz = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/course-quiz`,
//         {
//           title,
//           courseId,
//           questions
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       setSuccess(true);
//     } catch (err) {
//       console.log(err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-10">
      
//       {/* HEADER */}
//       <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-purple-500/20 mb-8 shadow-lg">
//         <h1 className="text-3xl font-bold text-purple-400">
//           Create Quiz for {course?.title || "Course"}
//         </h1>
//         <p className="text-gray-600 dark:text-gray-500 dark:text-gray-400 mt-2">
//           Add questions to build the final assessment for this course.
//         </p>
//       </div>

//       {/* SUCCESS MESSAGE */}
//       {success && (
//         <div className="bg-emerald-600/20 border border-emerald-500 p-4 rounded-lg mb-6">
//           Quiz saved successfully ✔
//         </div>
//       )}

//       {/* QUIZ TITLE */}
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="w-full mb-8 p-4 rounded-lg bg-slate-800 border border-purple-500/30"
//         placeholder="Quiz Title"
//       />

//       {/* QUESTIONS */}
//       {questions.map((q, index) => (
//         <div key={index} className="mb-8 p-6 bg-slate-900 border border-slate-700 rounded-xl">
          
//           <input
//             type="text"
//             placeholder="Enter Question"
//             value={q.question}
//             onChange={(e) => handleQuestionChange(index, e.target.value)}
//             className="w-full mb-4 p-3 rounded bg-slate-800"
//           />

//           {q.options.map((opt, optIndex) => (
//             <input
//               key={optIndex}
//               type="text"
//               placeholder={`Option ${optIndex + 1}`}
//               value={opt}
//               onChange={(e) =>
//                 handleOptionChange(index, optIndex, e.target.value)
//               }
//               className="w-full mb-2 p-3 rounded bg-slate-800"
//             />
//           ))}

//           <input
//             type="text"
//             placeholder="Correct Answer"
//             value={q.correctAnswer}
//             onChange={(e) => handleCorrectAnswer(index, e.target.value)}
//             className="w-full mt-3 p-3 rounded bg-emerald-700"
//           />
//         </div>
//       ))}

//       {/* ACTION BUTTONS */}
//       <div className="flex gap-4">
//         <button
//           onClick={addQuestion}
//           className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold"
//         >
//           + Add Question
//         </button>

//         <button
//           onClick={saveQuiz}
//           className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold"
//         >
//           Save Quiz
//         </button>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  CheckCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft,
  Sparkles,
  Loader2,
  X,
  AlertCircle
} from "lucide-react";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [quizId, setQuizId] = useState(null);

  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);

  const [savedQuestions, setSavedQuestions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  
  // AI Generator States
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiCount, setAiCount] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState([]);

  useEffect(() => {
    fetchCourse();
    fetchExistingQuiz();
  }, []);

  // =========================
  // FETCH COURSE INFO
  // =========================
  const fetchCourse = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/teacher`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const current = data.find(c => c._id === courseId);
    setCourse(current);

    if (current) {
      setTitle(`${current.title} Final Quiz`);
    }
  };

  // =========================
  // FETCH EXISTING QUIZ
  // =========================
  const fetchExistingQuiz = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/course-quiz/${courseId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();

    if (data) {
      setQuizId(data._id);
      setSavedQuestions(data.questions || []);
    }
  };

  // =========================
  // ADD NEW QUESTION
  // =========================
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" }
    ]);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswer = (index, value) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  // =========================
  // SAVE QUIZ
  // =========================
  const saveQuiz = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/course-quiz`,
      { title, courseId, questions },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSuccess(true);
    fetchExistingQuiz();
  };

  // =========================
  // DELETE QUESTION
  // =========================
  const deleteQuestion = async (index) => {
    const token = localStorage.getItem("token");

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/course-quiz/${quizId}/question/${index}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchExistingQuiz();
  };

  // =========================
  // EDIT QUESTION
  // =========================
  const saveEdit = async (index) => {
    const token = localStorage.getItem("token");
    const q = savedQuestions[index];

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/course-quiz/${quizId}/question/${index}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(q)
      }
    );

    setEditIndex(null);
    fetchExistingQuiz();
  };

  const updateSavedQuestion = (qIndex, field, value) => {
    const updated = [...savedQuestions];
    updated[qIndex][field] = value;
    setSavedQuestions(updated);
  };

  const updateSavedOption = (qIndex, optIndex, value) => {
    const updated = [...savedQuestions];
    updated[qIndex].options[optIndex] = value;
    setSavedQuestions(updated);
  };

  // =========================
  // AI GENERATOR
  // =========================
  const handleAIGenerate = async () => {
    if (!aiTopic) return alert("Please enter a topic");
    setAiLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/generate-questions`, {
        topic: aiTopic,
        count: aiCount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiPreview(res.data.questions || []);
    } catch (err) {
      console.error(err);
      alert("AI Generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const addAIQuestionsToQuiz = () => {
    // Transform AI questions to match our expected format (mapping 'answer' to 'correctAnswer')
    const formattedAIQuestions = aiPreview.map(q => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.answer
    }));

    // Identify if the current drafting list has any non-empty questions
    const hasExistingDraftContent = questions.some(q => 
      q.question.trim() !== "" || 
      q.options.some(opt => opt.trim() !== "") || 
      q.correctAnswer.trim() !== ""
    );

    if (!hasExistingDraftContent) {
      // If the drafting list is just empty templates, replace with AI questions
      setQuestions(formattedAIQuestions);
    } else {
      // Otherwise strictly append to the existing drafting list
      setQuestions([...questions, ...formattedAIQuestions]);
    }

    setAiPreview([]);
    setShowAIModal(false);
    setAiTopic("");
  };

  // =========================
  // SAVE QUIZ (MODIFIED TO PREVENT OVERWRITING)
  // =========================
  const saveQuizContents = async (isPublishing = false) => {
    try {
      const token = localStorage.getItem("token");

      // Filter out empty template questions from the drafting list
      // Only include questions that have at least some text content
      const validNewQuestions = questions.filter(q => q.question.trim() !== "");

      // CONSOLIDATE: Combine previously saved questions with newly drafted/generated ones
      const allQuestions = [...savedQuestions, ...validNewQuestions];

      // ONLY RESTRICT PUBLISHING
      if (isPublishing && allQuestions.length < 30) {
        return alert(`Add at least 30 questions to publish. (Current: ${allQuestions.length})`);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/course-quiz`,
        { 
          title, 
          courseId, 
          questions: allQuestions
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 || res.status === 201) {
        setSuccessMsg(isPublishing ? "Quiz published successfully ✓" : "Draft saved successfully ✓");
        setSuccess(true);
        setErrorMsg("");
        
        // Reset drafting list to a single empty question after successful save
        setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: "" }]);
        // Refresh saved list from database
        fetchExistingQuiz();
        setTimeout(() => {
          setSuccess(false);
          setSuccessMsg("");
        }, 3000);
      }
    } catch (err) {
      console.error("Save Quiz Error:", err);
      // SHOW UI ERROR MESSAGE INSTEAD OF ALERT
      const backendError = err.response?.data?.message || err.message || "Failed to save quiz. Please try again.";
      setErrorMsg(isPublishing ? `Publishing failed: ${backendError}` : `Saving failed: ${backendError}`);
      setTimeout(() => setErrorMsg(""), 5000);
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Create Quiz: {course?.title}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium italic">
                  Add questions to create an assessment for your students.
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAIModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
                >
                  <Sparkles size={16} />
                  Smart Generate
                </button>
                <button 
                  onClick={() => navigate(`/teacher/course/${courseId}`)}
                  className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-500 rounded-2xl transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
            </div>
          </div>

        {/* HELPER MESSAGE */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <AlertCircle size={18} className="text-indigo-500" />
          <p className="text-indigo-500 font-black uppercase tracking-widest text-[10px]">Please add 30 questions to the quiz</p>
        </div>


        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Quiz Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-xl shadow-xl"
            placeholder="e.g. Quantum Mechanics Master Quiz"
          />
        </div>

        {/* NEW QUESTIONS */}
        {questions.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">New Questions</h2>
               <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
            </div>

            {questions.map((q, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-xl hover:border-indigo-500/30 transition-all space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center font-black">
                    {index + 1}
                  </div>
                  <input
                    placeholder="Enter Question"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, i) => (
                    <div key={i} className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 dark:text-slate-400">{String.fromCharCode(65 + i)}</span>
                      <input
                        value={opt}
                        onChange={(e) => handleOptionChange(index, i, e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                        placeholder={`Option ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-2">Correct Answer</label>
                  <input
                    placeholder="Correct Answer"
                    value={q.correctAnswer}
                    onChange={(e) => handleCorrectAnswer(index, e.target.value)}
                    className="w-full p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-black"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={addQuestion}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl shadow-indigo-500/20"
          >
            <Plus size={16}/> Add Question
          </button>
          
          <div className="flex-[2] flex gap-4">
            <button
              onClick={() => saveQuizContents(false)}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-xl"
            >
              Save Draft
            </button>
            <button
              onClick={() => saveQuizContents(true)}
              disabled={(savedQuestions.length + questions.filter(q => q.question.trim() !== "").length) < 30}
              className={`flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                (savedQuestions.length + questions.filter(q => q.question.trim() !== "").length) >= 30
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02]"
                  : "bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed opacity-50"
              }`}
            >
              Publish Quiz
            </button>
          </div>
        </div>

        {/* PUBLISH REQUIREMENT REMINDER */}
        {(savedQuestions.length + questions.filter(q => q.question.trim() !== "").length) < 30 && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-500" />
            <p className="text-amber-500 font-black uppercase tracking-widest text-[10px]">
              Add {30 - (savedQuestions.length + questions.filter(q => q.question.trim() !== "").length)} more questions to unlock publishing
            </p>
          </div>
        )}

        {/* FEEDBACK MESSAGES (RELOCATED TO BOTTOM) */}
        <div className="space-y-4">
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-6 rounded-3xl flex items-center gap-4 animate-pulse shadow-lg shadow-emerald-500/5 w-full">
              <CheckCircle size={20} />
              <p className="font-black uppercase tracking-widest text-sm text-center w-full">{successMsg}</p>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-6 rounded-3xl flex items-center gap-4 shadow-lg shadow-rose-500/5 w-full">
              <AlertCircle size={20} />
              <p className="font-black uppercase tracking-widest text-sm text-center w-full">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* SAVED QUESTIONS */}
        {savedQuestions.length > 0 && (
          <div className="space-y-10 pt-10">
            <div className="flex items-center gap-4">
               <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Saved Questions</h2>
               <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <div className="space-y-6">
              {savedQuestions.map((q, index) => (
                <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-lg relative overflow-hidden group">
                  {editIndex === index ? (
                    <div className="space-y-6">
                      <input
                        value={q.question}
                        onChange={(e) => updateSavedQuestion(index, "question", e.target.value)}
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-lg"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, i) => (
                          <input
                            key={i}
                            value={opt}
                            onChange={(e) => updateSavedOption(index, i, e.target.value)}
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                          />
                        ))}
                      </div>
                      <input
                        value={q.correctAnswer}
                        onChange={(e) => updateSavedQuestion(index, "correctAnswer", e.target.value)}
                        className="w-full p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-black"
                      />
                      <div className="flex gap-4">
                        <button onClick={() => saveEdit(index)} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20">Sync Changes</button>
                        <button onClick={() => setEditIndex(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">Abort</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Question {index + 1}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{q.question}</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                          {q.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{opt}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10">Correct Answer: {q.correctAnswer}</span>
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2 shrink-0">
                        <button onClick={() => setEditIndex(index)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-indigo-500 rounded-2xl transition-all border border-slate-100 dark:border-slate-800">
                          <Edit3 size={18}/>
                        </button>
                        <button onClick={() => deleteQuestion(index)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-rose-500 rounded-2xl transition-all border border-slate-100 dark:border-slate-800">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI GENERATOR MODAL */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowAIModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-500 text-white">
               <div className="flex items-center gap-3">
                 <Sparkles size={24} />
                 <h3 className="text-xl font-black tracking-tight">AI Smart Generator</h3>
               </div>
               <button onClick={() => setShowAIModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
               {!aiPreview.length ? (
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Assessment Topic</label>
                       <input 
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        placeholder="e.g. Introduction to Quantum Physics"
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Question Count ({aiCount})</label>
                       <input 
                        type="range"
                        min="1"
                        max="10"
                        value={aiCount}
                        onChange={(e) => setAiCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                       />
                    </div>
                    <button 
                      onClick={handleAIGenerate}
                      disabled={aiLoading}
                      className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {aiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                      {aiLoading ? "Generating MCQs..." : "Begin Generation"}
                    </button>
                 </div>
               ) : (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-6">
                       {aiPreview.map((q, idx) => (
                         <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                            <h4 className="font-bold text-slate-900 dark:text-white leading-tight text-sm">{idx + 1}. {q.question}</h4>
                            <div className="grid grid-cols-2 gap-2">
                               {q.options.map((opt, i) => (
                                 <div key={i} className={`text-[10px] font-bold p-2 rounded-lg border ${opt === q.answer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}>
                                   {String.fromCharCode(65+i)}. {opt}
                                 </div>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="flex gap-4 sticky bottom-0 bg-white dark:bg-slate-900 pt-4 pb-2">
                       <button onClick={addAIQuestionsToQuiz} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Add to Quiz</button>
                       <button onClick={() => setAiPreview([])} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all">Discard</button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
