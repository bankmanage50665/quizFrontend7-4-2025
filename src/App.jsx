import { createBrowserRouter, RouterProvider } from "react-router-dom";



import Save4LaterQuizs from "./screens/Save4LaterQuizs";
import { checkAuthLoader } from "../middleware/getToken";
import RootLayout from "./Layout/RootLayout";
import { lazy } from "react";

const QuizScreen = lazy(() => import("./components/quiz/QuizScreen"));
const AddQuizs = lazy(() => import("./components/quiz/AddQuizs"));
const EditQuiz = lazy(() => import("./components/quiz/EditQuiz"));
const LoginWithOtp  = lazy(()=> import("./screens/LoginWithOtp"))





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
