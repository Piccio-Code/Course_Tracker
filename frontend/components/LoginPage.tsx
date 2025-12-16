import React, { useState } from 'react';
import { Loader2, AlertCircle, LogIn, User, Mail, Lock } from 'lucide-react';
import { api } from '../services/api.ts';

interface LoginPageProps {
  onLoginSuccess: (user: { username: string; email: string }) => void;
  onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateToSignup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Username, email and password are required.');
      setIsLoading(false);
      return;
    }

    try {
        await api.login({ username, email, password });
        
        // After successful login, fetch the actual user details
        try {
            const user = await api.getUser();
            onLoginSuccess(user);
        } catch (uError) {
             setError("Login successful, but failed to load user profile.");
             setIsLoading(false);
        }
    } catch (err: any) {
        console.error("Login error", err);
        setError("Invalid credentials or server error.");
        setIsLoading(false);
    }
  };

  return (
      <div className="w-full max-w-md bg-[#161b22]/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
               <LogIn className="text-purple-400" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Enter your credentials to access your courses.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-900/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-start">
              <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0d1117]/50 border border-gray-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600"
                  placeholder="jdoe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0d1117]/50 border border-gray-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d1117]/50 border border-gray-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-900/20 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-[#0f1115]/50 p-4 text-center border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <button 
              onClick={onNavigateToSignup}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Register
            </button>
          </p>
        </div>
      </div>
  );
};

export default LoginPage;