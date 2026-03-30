// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// export default function EditQuestion() {
//   const { questionId } = useParams();
//   const navigate = useNavigate();

//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState(["", "", "", ""]);
//   const [correctAnswer, setCorrectAnswer] = useState("");
//   const [difficulty, setDifficulty] = useState("Easy");

//   // =========================
//   // FETCH EXISTING QUESTION
//   // =========================
//   useEffect(() => {
//     const fetchQuestion = async () => {
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         `http://localhost:5000/api/question-bank/teacher`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();

//       const q = data.find((item) => item._id === questionId);

//       if (q) {
//         setQuestion(q.question);
//         setOptions(q.options);
//         setCorrectAnswer(q.correctAnswer);
//         setDifficulty(q.difficulty || "Easy");
//       }
//     };

//     fetchQuestion();
//   }, [questionId]);

//   // =========================
//   // UPDATE OPTION FIELD
//   // =========================
//   const handleOptionChange = (index, value) => {
//     const updated = [...options];
//     updated[index] = value;
//     setOptions(updated);
//   };

//   // =========================
//   // SAVE EDITED QUESTION
//   // =========================
//   const handleUpdate = async () => {
//     const token = localStorage.getItem("token");

//     await fetch(
//       `http://localhost:5000/api/question-bank/${questionId}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           question,
//           options,
//           correctAnswer,
//           difficulty,
//         }),
//       }
//     );

//     alert("Question updated!");
//     navigate(-1); // go back
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-white p-10">
//       <div className="max-w-3xl mx-auto bg-slate-900 p-8 rounded-xl">

//         <h2 className="text-2xl font-bold mb-6 text-yellow-400">
//           Edit Question
//         </h2>

//         <input
//           className="w-full mb-4 p-3 bg-slate-800 rounded"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Enter question"
//         />

//         {options.map((opt, i) => (
//           <input
//             key={i}
//             className="w-full mb-3 p-3 bg-slate-800 rounded"
//             value={opt}
//             onChange={(e) => handleOptionChange(i, e.target.value)}
//             placeholder={`Option ${i + 1}`}
//           />
//         ))}

//         <select
//           className="w-full mb-4 p-3 bg-slate-800 rounded"
//           value={correctAnswer}
//           onChange={(e) => setCorrectAnswer(e.target.value)}
//         >
//           <option value="">Select Correct Answer</option>
//           {options.map((opt, i) => (
//             <option key={i} value={opt}>
//               {opt}
//             </option>
//           ))}
//         </select>

//         <select
//           className="w-full mb-6 p-3 bg-slate-800 rounded"
//           value={difficulty}
//           onChange={(e) => setDifficulty(e.target.value)}
//         >
//           <option>Easy</option>
//           <option>Medium</option>
//           <option>Hard</option>
//         </select>

//         <button
//           onClick={handleUpdate}
//           className="bg-yellow-500 px-6 py-3 rounded font-semibold"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditQuestion() {
  const { questionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH QUESTION
  // =========================
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/question-bank/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setQuestion(data.question);
        setOptions(data.options);
        setCorrectAnswer(data.correctAnswer);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchQuestion();
  }, [questionId]);

  // =========================
  // UPDATE OPTION
  // =========================
  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // =========================
  // SAVE EDITED QUESTION
  // =========================
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `http://localhost:5000/api/question-bank/${questionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question,
            options,
            correctAnswer,
          }),
        }
      );

      setSuccess(true);

      // Auto redirect after 1.5 sec
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading question...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-3xl mx-auto bg-slate-900 p-8 rounded-xl border border-yellow-500/20">

        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          Edit Question
        </h2>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-6 bg-emerald-600/20 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-lg">
            Question updated successfully ✔
          </div>
        )}

        {/* QUESTION */}
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="w-full mb-6 px-4 py-3 bg-slate-800 rounded-lg"
        />

        {/* OPTIONS */}
        {options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            className="w-full mb-4 px-4 py-3 bg-slate-800 rounded-lg"
          />
        ))}

        {/* CORRECT ANSWER */}
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="w-full mb-6 px-4 py-3 bg-slate-800 rounded-lg"
        >
          <option value="">Select Correct Answer</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
