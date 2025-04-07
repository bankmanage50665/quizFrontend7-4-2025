import React from 'react';
import { useLocation, Link, useRouteLoaderData } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const path = location.pathname;
  const token = useRouteLoaderData() 

  console.log(token)  

  // Function to determine if a route is active
  const isActive = (routePath) => {
    if (routePath === "" || routePath === "/") {
      return path === "/" || path === "";
    }
    return path.includes(routePath);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white shadow-lg border-t border-gray-700">
      <div className="max-w-screen-xl mx-auto">
        <nav className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center flex-1 p-2 transition-colors ${
              isActive("") ? "text-blue-400 border-t-2 border-blue-400" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-xs mt-1">Quizzes</span>
          </Link>
          
          {/* <Link 
            to="/addQuiz" 
            className={`flex flex-col items-center justify-center flex-1 p-2 transition-colors ${
              isActive("addQuiz") ? "text-blue-400 border-t-2 border-blue-400" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs mt-1">Add Quiz</span>
          </Link> */}
          
           {localStorage.getItem("token") && <Link 
            to="/save4Later" 
            className={`flex flex-col items-center justify-center flex-1 p-2 transition-colors ${
              isActive("save4Later") ? "text-blue-400 border-t-2 border-blue-400" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-xs mt-1">Saved</span>
          </Link> }
          
          {!localStorage.getItem("token") ? (
            <Link 
              to="/login" 
              className={`flex flex-col items-center justify-center flex-1 p-2 transition-colors ${
                isActive("login") ? "text-blue-400 border-t-2 border-blue-400" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="text-xs mt-1">Login</span>
            </Link>
          ) : (
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                window.location.href = "/login";
              }}
              className="flex flex-col items-center justify-center flex-1 p-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-xs mt-1">Logout</span>
            </button>
          )}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;