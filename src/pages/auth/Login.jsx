import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, AlertCircle, ArrowRight, Lock, Mail, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [activeCard, setActiveCard] = useState('login'); // 'login' or 'reset'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // TODO: Implement login logic
    setTimeout(() => {
      setLoading(false);
      setError('Invalid credentials');
    }, 2000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    // TODO: Implement password reset logic
    setTimeout(() => {
      setResetLoading(false);
      setResetSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Logo Section */}
      <div className="text-center mb-12">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
            BestBrightness
          </h1>
        </Link>
      </div>

      {/* Cards Container */}
      <div className="max-w-md mx-auto relative">
        {/* Login Card */}
        <div 
          className={`transition-all duration-500 ease-in-out absolute w-full
            ${activeCard === 'login' 
              ? 'translate-x-0 opacity-100 pointer-events-auto' 
              : '-translate-x-full opacity-0 pointer-events-none'}`}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cyan-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none pr-10"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  checked={formData.rememberMe}
                  onChange={e => setFormData({...formData, rememberMe: e.target.checked})}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold 
                  ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-cyan-600 hover:to-blue-700'} 
                  transition-all duration-200 flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Register Link */}
              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Create one
                </Link>
              </p>
            </form>

            {/* Forgot Password Link */}
            <button 
              onClick={() => setActiveCard('reset')}
              className="w-full mt-4 text-cyan-600 hover:text-cyan-700 font-medium flex items-center justify-center gap-2 py-2"
            >
              Forgot your password?
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Password Reset Card */}
        <div 
          className={`transition-all duration-500 ease-in-out absolute w-full
            ${activeCard === 'reset' 
              ? 'translate-x-0 opacity-100 pointer-events-auto' 
              : 'translate-x-full opacity-0 pointer-events-none'}`}
        >
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cyan-100">
            {/* Back to Login Button */}
            <button 
              onClick={() => setActiveCard('login')}
              className="mb-6 text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">Forgot Password?</h2>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you instructions to reset your password.
            </p>

            {resetSuccess ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-xl">
                <h3 className="font-semibold mb-2">Check your inbox!</h3>
                <p className="text-sm">
                  We've sent password reset instructions to your email address. 
                  The link will expire in 1 hour.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className={`w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-3 rounded-xl font-semibold 
                    ${resetLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-cyan-700 hover:to-blue-800'} 
                    transition-all duration-200 flex items-center justify-center gap-2`}
                >
                  {resetLoading ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                      Sending instructions...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security Info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Lock className="w-5 h-5 text-cyan-600" />
                <span className="text-sm">Secure password reset process</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-cyan-600" />
                <span className="text-sm">Instructions sent instantly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
