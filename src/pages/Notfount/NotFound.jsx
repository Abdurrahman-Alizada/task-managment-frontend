import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <div className="text-6xl font-bold text-gray-600 mb-4">404</div>
      <p className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</p>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFound;
