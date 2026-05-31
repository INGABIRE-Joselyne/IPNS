import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import logo from '../assets/images/LOGO.png';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0B1528] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center max-w-lg">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="IPNS Logo" className="h-14 w-14 object-contain opacity-80" />
        </div>

        {/* 404 Number */}
        <h1 className="text-[10rem] font-black leading-none bg-gradient-to-b from-emerald-400 to-teal-600 bg-clip-text text-transparent mb-2 select-none">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          Sorry, the page you're looking for doesn't exist. It may have been moved, deleted, or you may have typed the wrong address.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <Home size={17} />
            Go Back Home
          </a>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
