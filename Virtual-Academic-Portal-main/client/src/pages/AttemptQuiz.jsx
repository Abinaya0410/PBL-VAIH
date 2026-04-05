
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// export default function AttemptQuiz() {
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const TOTAL_TIME = 30 * 60;

//   const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [questions, setQuestions] = useState([]);

//   // =========================
//   // FETCH QUIZ FROM DB
//   // =========================
//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/course-quiz/${courseId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await res.json();
//         setQuestions(data?.questions || []);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchQuiz();
//   }, [courseId]);

//   // =========================
//   // TIMER
//   // =========================
//   useEffect(() => {
//     if (submitted) return;

//     if (timeLeft <= 0) {
//       handleSubmit();
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, submitted]);

//   const formatTime = () => {
//     const m = Math.floor(timeLeft / 60);
//     const s = timeLeft % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };

//   const selectAnswer = (qid, option) => {
//     setAnswers({ ...answers, [qid]: option });
//   };

//   // =========================
//   // SUBMIT QUIZ
//   // =========================
//   const handleSubmit = async () => {
//     if (submitted) return;

//     let correctCount = 0;

//     questions.forEach((q) => {
//       if (answers[q._id] === q.correctAnswer) {
//         correctCount++;
//       }
//     });

//     const percent = (correctCount / questions.length) * 100;

//     setScore(percent);
//     setSubmitted(true);

//     // 🔥 SAVE RESULT TO DATABASE
//     try {
//       const token = localStorage.getItem("token");

//       await fetch(
//         `${import.meta.env.VITE_API_URL}/api/course-quiz/submit/${courseId}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             score: percent,
//             correctCount: correctCount,
//             wrongCount: questions.length - correctCount,
//           }),
//         }
//       );
//     } catch (err) {
//       console.log("Error saving attempt:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-10">

//       {!submitted && (
//         <div className="flex justify-end mb-6">
//           <div className="bg-red-600 px-6 py-2 rounded-lg font-bold">
//             ⏱ {formatTime()}
//           </div>
//         </div>
//       )}

//       <h1 className="text-3xl font-bold mb-8 text-indigo-400">
//         Final Course Quiz
//       </h1>

//       {!submitted ? (
//         <>
//           {questions.map((q, i) => (
//             <div key={q._id} className="bg-slate-800 p-6 rounded-xl mb-6">
//               <h3 className="font-semibold mb-4">
//                 {i + 1}. {q.question}
//               </h3>

//               <div className="grid grid-cols-2 gap-3">
//                 {q.options.map((opt) => (
//                   <button
//                     key={opt}
//                     onClick={() => selectAnswer(q._id, opt)}
//                     className={`px-4 py-2 rounded-lg ${
//                       answers[q._id] === opt
//                         ? "bg-indigo-600"
//                         : "bg-slate-700"
//                     }`}
//                   >
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))}

//           <div className="text-center mt-8">
//             <button
//               onClick={handleSubmit}
//               className="px-10 py-3 bg-emerald-600 rounded-lg font-semibold"
//             >
//               Finish Test
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="bg-slate-900 p-10 rounded-xl text-center">
//           <h2 className="text-3xl font-bold mb-4">
//             Your Score: {score.toFixed(0)}%
//           </h2>

//           {score >= 60 ? (
//             <>
//               <p className="text-emerald-400 text-lg mb-6">
//                 🎉 Congratulations! You passed the quiz.
//               </p>

//               <button
//                 onClick={() => navigate("/completed-courses")}
//                 className="px-8 py-3 bg-emerald-600 rounded-lg"
//               >
//                 Go to Completed Courses
//               </button>
//             </>
//           ) : (
//             <>
//               <p className="text-red-400 text-lg mb-6">
//                 You scored below 60%. Please reattempt.
//               </p>

//               <button
//                 onClick={() => {
//                   setSubmitted(false);
//                   setAnswers({});
//                   setTimeLeft(TOTAL_TIME);
//                 }}
//                 className="px-8 py-3 bg-indigo-600 rounded-lg"
//               >
//                 Reattempt Quiz
//               </button>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }




import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, CheckCircle, AlertCircle, Award, Sparkles, Loader2 } from "lucide-react";

export default function AttemptQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const TOTAL_TIME = 45 * 60;

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [fetchingAI, setFetchingAI] = useState(false);

  const startTimeRef = useRef(new Date()); // ✅ store real start time

  // =========================
  // FETCH QUIZ FROM DB
  // =========================
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/course-quiz/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setQuestions(data?.questions || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchQuiz();
  }, [courseId]);

  // =========================
  // TIMER
  // =========================
  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const selectAnswer = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  // =========================
  // SUBMIT QUIZ
  // =========================
  const handleSubmit = async () => {
    if (submitted) return;

    let correctCount = 0;

    const detailedAnswers = questions.map((q) => {
      const selected = answers[q._id] || null;
      const isCorrect = selected === q.correctAnswer;

      if (isCorrect) correctCount++;

      return {
        questionId: q._id, // ✅ Add questionId
        question: q.question,
        options: q.options,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const percent = (correctCount / questions.length) * 100;

    setScore(percent);
    setSubmitted(true);

    const endTime = new Date();

    // 🔥 SAVE RESULT TO DATABASE (WITH DETAILS)
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/course-quiz/submit/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            score: percent,
            correctCount: correctCount,
            wrongCount: questions.length - correctCount,
            answers: detailedAnswers,
            startTime: startTimeRef.current,
            endTime: endTime,
          }),
        }
      );
    } catch (err) {
      console.log("Error saving attempt:", err);
    }

    // 🚀 NEW: Fetch AI Summary (Poll for it)
    pollAISummary();
  };

  const pollAISummary = async () => {
    setFetchingAI(true);
    let attempts = 0;
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/course-quiz/attempts/${courseId}/latest`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data && data.aiSummary) {
          setAiSummary(data.aiSummary);
          setFetchingAI(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling AI Failed:", err);
      }
      attempts++;
      if (attempts > 10) { // Timeout after 30s
        setFetchingAI(false);
        clearInterval(interval);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 lg:p-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        {!submitted && (
          <div className="flex justify-end mb-6 sticky top-6 z-20">
            <div className="bg-white dark:bg-slate-800 border border-indigo-500/30 shadow-lg shadow-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-5 py-3 rounded-2xl font-black tracking-widest flex items-center gap-2">
              <Clock size={18} className="animate-pulse" />
              {formatTime()}
            </div>
          </div>
        )}

        <div className="space-y-3 mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Final Course Quiz
          </h1>
          <p className="font-bold text-slate-500 dark:text-slate-400 italic text-sm md:text-base">Select the best answer for each question to complete your certification.</p>
        </div>

        {!submitted ? (
          <div className="space-y-8">
            {questions.map((q, i) => (
              <div key={q._id} className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 shrink-0 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center font-black text-xl">
                    {i + 1}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 pt-1 leading-relaxed">
                    {q.question}
                  </h3>
                </div>

                <div className="space-y-3 sm:pl-16">
                  {q.options.map((opt) => {
                    const isSelected = answers[q._id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => selectAnswer(q._id, opt)}
                        className={`w-full text-left px-6 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                          isSelected
                            ? "bg-indigo-500/10 border-indigo-500 shadow-md shadow-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'border-indigo-500' : 'border-slate-400 dark:border-slate-500 group-hover:border-indigo-400'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
                        </div>
                        <span className="font-bold text-base md:text-lg leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800 mt-10">
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto px-16 py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-500 hover:-translate-y-1 active:scale-95 transition-all"
              >
                Submit Validation
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-16 rounded-[3rem] text-center shadow-2xl max-w-2xl mx-auto space-y-10">
            <div className="w-28 h-28 mx-auto rounded-[2.5rem] flex items-center justify-center shadow-inner mb-6 bg-indigo-500/10 text-indigo-500">
               <Award size={56} />
            </div>
            
            <div className="space-y-4">
               <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Quiz Result</h2>
               <div className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white">
                 {score.toFixed(0)}%
               </div>
            </div>

            <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-8"></div>

            {score >= 60 ? (
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-2xl font-bold text-sm shadow-sm">
                  <CheckCircle size={20} /> Congratulations! You mastered this domain.
                </div>

                {/* AI DIAGNOSTIC SUMMARY */}
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-left space-y-4 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="text-indigo-500" size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest text-indigo-500">AI Diagnostic Summary</h3>
                  </div>
                  {fetchingAI && !aiSummary && (
                    <div className="flex items-center gap-4 text-slate-500 italic animate-pulse">
                      <Loader2 className="animate-spin" size={16} />
                      <p className="text-xs font-medium">Synthesizing personalized feedback...</p>
                    </div>
                  )}
                  {aiSummary ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic whitespace-pre-wrap">
                      {aiSummary}
                    </div>
                  ) : !fetchingAI && (
                    <p className="text-xs text-slate-400 italic">Advanced analysis unavailable at this moment.</p>
                  )}
                </div>

                <div>
                   <button
                     onClick={() => navigate("/quiz-attempts")}
                     className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/20 uppercase tracking-[0.2em] hover:bg-indigo-500 hover:-translate-y-1 transition-all active:scale-95"
                   >
                     View Academic Record
                   </button>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-2xl font-bold text-sm shadow-sm">
                  <AlertCircle size={20} /> You need more practice.
                </div>
                <div>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setAnswers({});
                        setTimeLeft(TOTAL_TIME);
                        startTimeRef.current = new Date();
                      }}
                      className="w-full sm:w-auto px-12 py-5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 uppercase tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-slate-700 hover:-translate-y-1 transition-all active:scale-95"
                    >
                      Try Again
                    </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}