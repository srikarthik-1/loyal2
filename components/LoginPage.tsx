import React, { useState } from 'react';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from './icons/Icons';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid identifier or passcode.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 md:p-10 border border-[#333] bg-[#0a0a0a] shadow-2xl shadow-black/50 animate-[fade-slide-up_0.6s_forwards] opacity-0">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 mb-8">
          <ArrowLeftIcon className="w-4 h-4" />
          Return
        </button>

        <h2 className="text-3xl font-serif">Access Terminal</h2>
        <p className="text-gray-400 mt-2 mb-8">Please authenticate.</p>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Identifier</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-transparent border-b border-[#333] py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Passcode</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-transparent border-b border-[#333] py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button type="submit" className="w-full mt-4 px-8 py-3 bg-white border border-white rounded-md text-black font-semibold transition-all duration-300 hover:bg-gray-200 hover:border-gray-200">
            Enter System
          </button>
        </form>
      </div>
       <style>{`
        @keyframes fade-slide-up { to { opacity: 1; transform: translateY(0); } }
        .animate-\[fade-slide-up_0\.6s_forwards\] {
            transform: translateY(30px);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
