// import React, { useEffect } from "react";

// export default function Save4LaterQuizs() {
//   useEffect(() => {
//     async function handleAllSave4laterQuizs(req, res) {
//       const response = await fetch(
//         `http://localhost:3000/api/save4later/getAllSave4Later`
//       );
//       const resData = await response.json()

//       console.log(resData)
//     }

//     handleAllSave4laterQuizs()
//   }, []);

//   return <div>Save4LaterQuizs</div>;
// }

import React, { useEffect, useState } from "react";
import Save4LaterQuizItem from "./Save4LaterQuizItem";

export default function Save4LaterQuizs() {
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function handleAllSave4laterQuizs() {
      try {
        // Get userId from localStorage
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setError("User ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        // Send userId in the request URL
        const response = await fetch(
          `http://localhost:3000/api/save4later/getAllSave4Later/${userId}`
        );

        const resData = await response.json();

        console.log(resData.data);

        if (resData.success) {
          setSavedQuizzes(resData.data);
        } else {
          setError(resData.message || "Failed to load saved quizzes");
        }

        console.log(resData);
      } catch (err) {
        setError("Error fetching saved quizzes: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    handleAllSave4laterQuizs();
  }, []);

  if (loading) return <div>Loading saved quizzes...</div>;
  if (error) return <div>Error: {error}</div>;
  if (savedQuizzes.length === 0) return <div>No saved quizzes found</div>;

  return (
    <div>
      <h2>Saved Quizzes</h2>
      
<Save4LaterQuizItem savedQuizzes={savedQuizzes}/>


    </div>
  );
}
