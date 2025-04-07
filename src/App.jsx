import { createBrowserRouter, RouterProvider } from "react-router-dom";
import QuizScreen from "./components/quiz/QuizScreen";
import AddQuizs from "./components/quiz/AddQuizs";
import EditQuiz from "./components/quiz/EditQuiz";
import LoginWithOtp from "./screens/LoginWithOtp";
import Save4LaterQuizs from "./screens/Save4LaterQuizs";
import { checkAuthLoader } from "../middleware/getToken";
import RootLayout from "./Layout/RootLayout";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      id: "token",

      children: [
        { index: true, element: <QuizScreen />, loader: checkAuthLoader },
        { path: "login", element: <LoginWithOtp /> },
        { path: "addQuiz", element: <AddQuizs />, loader: checkAuthLoader },
        {
          path: "save4Later",
          element: <Save4LaterQuizs />,
          loader: checkAuthLoader,
        },
        {
          path: ":id",
          children: [
            { index: true, element: <EditQuiz />, loader: checkAuthLoader },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
