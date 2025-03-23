import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-lg text-gray-600 mt-4">Page not found</p>
    </div>
  );
};

export default NotFoundPage;
