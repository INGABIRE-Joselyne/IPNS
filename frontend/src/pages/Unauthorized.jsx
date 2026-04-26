import React from 'react';
import { Lock, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Lock size={72} className="text-red-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          You don't have permission to access this page. If you think this is a mistake, please contact support.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded font-semibold transition-colors"
        >
          <Home size={20} />
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
