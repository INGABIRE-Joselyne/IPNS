import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Search } from 'lucide-react';
import logo from '../assets/images/LOGO.png';

const Home = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Logging into IPNS with:", formData.email);
    // Add your login authentication routing here
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex flex-col md:flex-row bg-slate-50">
      
      {/* LEFT SIDE: WELCOME & BRANDING */}
      <div className="w-full md:w-1/2 bg-teal-600 text-white flex flex-col justify-center items-start p-8 md:p-16 space-y-6 relative overflow-hidden">
        {/* Background decorative soft shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-10 right-0 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob delay-2000"></div>

        <div className="z-10 space-y-4">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl inline-block border border-white/20 mb-2">
            <ShieldCheck className="w-12 h-12 text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Welcome to <span className="text-emerald-300">IPNS</span>
          </h1>
          <p className="text-lg text-teal-100 max-w-md font-light">
            Your trusted Integrated Pharmacy Navigation System. Instantly locate life-saving medications, explore nearby pharmacies, and check real-time stock availability all in one secure place.
          </p>
        </div>

        {/* Small Feature Pill Badges underneath welcome */}
        <div className="z-10 flex flex-wrap gap-3 pt-4">
          <span className="bg-white/10 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-emerald-300" /> Fast Search
          </span>
          <span className="bg-white/10 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5">
            🛡️ Verified Pharmacies
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          {/* Logo and Greeting */}
          <div className="text-center md:text-left space-y-2">
            <img 
              src={logo} 
              alt="IPNS Logo" 
              className="h-14 w-auto mx-auto md:mx-0 object-contain mb-4"
              onError={(e) => { e.target.style.display = 'none'; }} // Fallback if logo path differs
            />
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Account Login
            </h2>
            <p className="text-sm text-slate-500">
              Please enter your credentials to access the system features.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-800 transition duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 block">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-medium text-teal-600 hover:text-teal-700 transition">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-800 transition duration-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 select-none">
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 transform active:scale-[0.99] transition duration-150 flex items-center justify-center gap-2"
            >
              Sign In to System
            </button>
          </form>

          {/* Footer inside Form panel */}
          <p className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
            &copy; 2026 IPNS Platform. All medical data is securely encrypted.
          </p>

        </div>
      </div>

    </div>
  );
};

export default Home;