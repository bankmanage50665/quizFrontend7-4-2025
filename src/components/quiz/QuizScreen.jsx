import React, { useEffect, useState } from "react";
import QuizItem from "./QuizItem";

// Simulated quiz attempts (for demonstration)
const quizAttempts = {
  1: { isCorrect: true },
  2: { isCorrect: false },
  3: { isCorrect: true },
  4: { isCorrect: false },
  5: { isCorrect: true },
};

// Filter states (example configurations)
const filterConfigurations = [
  // Configuration 1: All quizzes
  {
    status: "all",
    correctness: "all",
    difficulty: "all",
    subject: "all",
  },
  // Configuration 2: Only answered quizzes
  {
    status: "answered",
    correctness: "all",
    difficulty: "all",
    subject: "all",
  },
  // Configuration 3: Correct geography quizzes
  {
    status: "all",
    correctness: "correct",
    difficulty: "all",
    subject: "Geography",
  },
  // Configuration 4: Unanswered hard quizzes
  {
    status: "unanswered",
    correctness: "all",
    difficulty: "hard",
    subject: "all",
  },
];

export default function QuizScreen() {
  const [quizs, setQuizs] = useState([]);

  function filterQuizzes(quizs, quizAttempts, filters) {
    return quizs.filter((quiz) => {
      const isQuizAttempted = quizAttempts[quiz._id];
      const isQuizCorrect = isQuizAttempted && quizAttempts[quiz._id].isCorrect;

      const statusMatch =
        filters.status === "all" ||
        (filters.status === "answered" && isQuizAttempted) ||
        (filters.status === "unanswered" && !isQuizAttempted);

      const correctnessMatch =
        filters.correctness === "all" ||
        (filters.correctness === "correct" && isQuizCorrect) ||
        (filters.correctness === "incorrect" &&
          isQuizAttempted &&
          !isQuizCorrect);

      const difficultyMatch =
        filters.difficulty === "all" || filters.difficulty === quiz.difficulty;

      const subjectMatch =
        filters.subject === "all" || filters.subject === quiz.subject;

      return statusMatch && correctnessMatch && difficultyMatch && subjectMatch;
    });
  }

  // Unique Filters Extraction
  const uniqueSubjects = ["all", ...new Set(quizs.map((quiz) => quiz.subject))];

  const uniqueDifficulties = [
    "all",
    ...new Set(quizs.map((quiz) => quiz.difficulty)),
  ];

  // Demonstrate filtering with different configurations
  filterConfigurations.forEach((config, index) => {
    console.log(`\nFilter Configuration ${index + 1}:`);
    console.log(JSON.stringify(config, null, 2));

    const filteredQuizzes = filterQuizzes(quizs, quizAttempts, config);

    console.log("Filtered Quizzes:");
    filteredQuizzes.forEach((quiz) => {
      console.log(`- ${quiz.question} (${quiz.subject}, ${quiz.difficulty})`);
    });
  });

  // Helper function to log unique subjects and difficulties
  console.log("\nUnique Subjects:", uniqueSubjects);
  console.log("Unique Difficulties:", uniqueDifficulties);

  useEffect(() => {
    async function handleGetAllQuizs() {
      const response = await fetch(`http://localhost:3000/api/quiz/getQuizzes`);
      const resData = await response.json();

      setQuizs(resData.data);
    }

    handleGetAllQuizs();
  }, []);

  return (
    <div className="w-full max-w-full px-4 py-6">
      <div className="container mx-auto">
        <div className="w-full">
          <QuizItem quizData={quizs} />
        </div>
      </div>
    </div>
  );
}
