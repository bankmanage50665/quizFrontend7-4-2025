import React, { useState } from "react";

const EditQuizForm = () => {


  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    subject: "",
    difficulty: "medium",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [submitingQuestion, setSubmitQuestion] = useState(false);

  const handleQuestionChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      question: e.target.value,
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
    });
  };

  const handleSubjectChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      subject: e.target.value,
    });
  };

  const handleDifficultyChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      difficulty: e.target.value,
    });
  };

  const handleCorrectAnswerChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      correctAnswer: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitQuestion(true);
    const newId = (quizData.length + 1).toString();
    const newQuizItem = {
      _id: newId,
      ...newQuestion,
    };

    setQuizData([...quizData, newQuizItem]);

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/quiz/createQuiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    });
    const resData = await response.json();

    console.log(resData);

    setSubmitQuestion(false);
    // Reset form
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      subject: "",
      difficulty: "medium",
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Quiz Question Creator</h1>

        {showSuccess && (
          <div className="bg-green-800 text-white p-3 rounded mb-4">
            Question added successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Question:</label>
            <input
              type="text"
              value={newQuestion.question}
              onChange={handleQuestionChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Options:</label>
            {newQuestion.options.map((option, index) => (
              <div key={index} className="mb-2 flex items-center">
                <span className="mr-2 text-gray-400">#{index + 1}</span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  required
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Correct Answer:</label>
            <select
              value={newQuestion.correctAnswer}
              onChange={handleCorrectAnswerChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              required
            >
              <option value="">Select correct answer</option>
              {newQuestion.options.map((option, index) =>
                option ? (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ) : null
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Subject:</label>
            <input
              type="text"
              value={newQuestion.subject}
              onChange={handleSubjectChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Difficulty:</label>
            <select
              value={newQuestion.difficulty}
              onChange={handleDifficultyChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
          >
            Add Question
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Current Quiz Questions ({quizData.length})
          </h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <pre className="text-green-400 overflow-auto max-h-96">
              {JSON.stringify(quizData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuizForm;
