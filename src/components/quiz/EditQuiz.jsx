import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function EditQuiz() {
  const [editQuiz, setEditQuiz] = useState([]);
  const params = useParams();

  useEffect(() => {
    async function handleGetData() {
      const response = await fetch(
        `http://localhost:3000/api/quiz/${params.id}`,
        {}
      );
      const resData = await response.json();
      setEditQuiz(resData.data);
    }

    handleGetData();
  }, []);

  

  return <>

  <h1>Edit quiz app</h1>
  </>;
}
