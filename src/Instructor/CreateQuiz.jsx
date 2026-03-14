import { useState, useEffect } from "react";

function CreateQuiz() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [quiz, setQuiz] = useState([]);

  // Load saved quiz
  useEffect(() => {
    const saved = localStorage.getItem("quiz");
    if (saved) {
      setQuiz(JSON.parse(saved));
    }
  }, []);

  const addQuestion = () => {

    if (!question || !answer) return;

    const updatedQuiz = [
      ...quiz,
      { question: question, answer: answer }
    ];

    setQuiz(updatedQuiz);

    // Save immediately
    localStorage.setItem("quiz", JSON.stringify(updatedQuiz));

    setQuestion("");
    setAnswer("");
  };

  const deleteQuestion = (index) => {

    const updatedQuiz = quiz.filter((_, i) => i !== index);

    setQuiz(updatedQuiz);

    localStorage.setItem("quiz", JSON.stringify(updatedQuiz));
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Create Quiz</h1>

      <div className="bg-[#1f2937] p-6 rounded-xl space-y-4">

        <input
          type="text"
          placeholder="Quiz Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 rounded bg-[#0f172a]"
        />

        <input
          type="text"
          placeholder="Correct Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-3 rounded bg-[#0f172a]"
        />

        <button
          onClick={addQuestion}
          className="bg-blue-500 px-6 py-2 rounded"
        >
          Add Question
        </button>

      </div>

      <div className="mt-8 space-y-4">

        {quiz.map((q, index) => (

          <div
            key={index}
            className="bg-[#1f2937] p-4 rounded flex justify-between"
          >

            <div>

              <p className="font-semibold">
                {index + 1}. {q.question}
              </p>

              <p className="text-green-400">
                Answer: {q.answer}
              </p>

            </div>

            <button
              onClick={() => deleteQuestion(index)}
              className="text-red-400"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CreateQuiz;