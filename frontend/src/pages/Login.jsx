import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/Cards';
import logo from '../assets/images/LOGO.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      const role = result.user?.role;
      window.location.pathname = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }

    setLoading(false);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError('');
    setResetMessage(
      email
        ? `Password reset help requested for ${email}. Please contact the system admin to reset this account password.`
        : 'Enter your email first, then click Forgot password again so the admin knows which account to reset.'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="IPNS Logo" className="h-36 w-36 object-contain" />
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-6">Sign in to your pharmacy account</p>

          {error && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {resetMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
              <CheckCircle size={20} className="text-blue-600 flex-shrink-0" />
              <p className="text-blue-800 text-sm">{resetMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@pharmacy.rw"
                  className="w-full bg-white border border-gray-300 rounded pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-300 rounded pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="#forgot-password"
                onClick={handleForgotPassword}
                className="text-emerald-600 hover:text-emerald-700 text-sm transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white py-2 rounded font-semibold transition-colors mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <a href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
              Register here
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a href="/" className="text-gray-600 hover:text-gray-700 text-sm transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
