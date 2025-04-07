import React, { useState } from "react";

export default function Save4LaterQuizItem({ savedQuizzes }) {
  // State to track selected answers and correct answers for each quiz
  const [quizStates, setQuizStates] = useState(
    savedQuizzes.map((quiz) => ({
      quizId: quiz._id,
      selectedOption: null,
      isCorrect: false,
      answered: false,
      vibrating: false,
    }))
  );

  // Function to handle option selection
  const handleOptionSelect = (quizIndex, optionIndex, correctIndex) => {
    // Only allow selection if the quiz hasn't been answered correctly yet
    if (quizStates[quizIndex].isCorrect) return;

    const newQuizStates = [...quizStates];
    newQuizStates[quizIndex].selectedOption = optionIndex;

    // Check if answer is correct
    const isCorrect = optionIndex === correctIndex;
    newQuizStates[quizIndex].isCorrect = isCorrect;
    newQuizStates[quizIndex].answered = true;
    newQuizStates[quizIndex].vibrating = true;

    setQuizStates(newQuizStates);

    // Reset vibration effect after a short delay
    setTimeout(() => {
      const updatedStates = [...quizStates];
      updatedStates[quizIndex].vibrating = false;
      setQuizStates(updatedStates);
    }, 500);
  };

  // Function to determine option class based on selection and correctness
  const getOptionClass = (quizIndex, optionIndex, correctIndex) => {
    const quizState = quizStates[quizIndex];

    if (!quizState.answered || quizState.selectedOption !== optionIndex) {
      return "bg-gray-800 hover:bg-gray-700";
    }

    if (optionIndex === correctIndex) {
      return quizState.vibrating
        ? "bg-green-500 animate-pulse"
        : "bg-green-500";
    }

    return quizState.vibrating ? "bg-red-500 animate-pulse" : "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Your Saved Quizzes
      </h2>
      <div className="max-w-2xl mx-auto space-y-8">
        {savedQuizzes.map((item, quizIndex) => {
          // Assuming the first option is correct for demo purposes
          // In a real app, you'd have a correctAnswer field in your data
          const correctIndex = 0;

          return (
            <div
              key={item._id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-4">
                {item.quiz.question}
              </h3>

              <div className="space-y-3 mb-4">
                {item.quiz.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() =>
                      handleOptionSelect(quizIndex, optionIndex, correctIndex)
                    }
                    disabled={quizStates[quizIndex].isCorrect}
                    className={`w-full text-left p-3 rounded-md transition-all duration-200 ${getOptionClass(
                      quizIndex,
                      optionIndex,
                      correctIndex
                    )} ${
                      quizStates[quizIndex].isCorrect &&
                      optionIndex !== correctIndex
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    <p>{option}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-sm text-gray-400 mt-4 pt-3 border-t border-gray-700">
                <p>
                  Category:{" "}
                  <span className="text-blue-400">{item.quiz.category}</span>
                </p>
                <p>
                  Difficulty:{" "}
                  <span className="text-blue-400">{item.quiz.difficulty}</span>
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Saved on: {new Date(item.savedAt).toLocaleDateString()}
              </p>

              {quizStates[quizIndex].isCorrect && (
                <div className="mt-3 p-2 bg-green-900/30 text-green-400 rounded text-sm">
                  Correct answer! Well done!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
