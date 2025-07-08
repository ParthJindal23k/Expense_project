import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 px-4">
      <div className="text-6xl mb-4">🔒</div>
      <h2 className="text-3xl font-semibold mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-6">
        You do not have the required permissions to view this page.
      </p>
      <button
        onClick={() => navigate('/login')}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Go to Login
      </button>
    </div>
  );
};

export default Unauthorized;
