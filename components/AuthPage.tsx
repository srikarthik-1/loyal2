import React, { useState } from 'react';
import { InfinityIcon } from './icons/Icons';

interface AuthPageProps {
  onLogin: (username: string, password: string) => Promise<{success: boolean, message: string}>;
  onRegister: (name: string, username: string, password: string) => Promise<{success: boolean, message: string}>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const response = await onLogin(loginUsername, loginPassword);
    if (!response.success) {
      setError(response.message);
    }
    setIsLoading(false);
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regName || !regUsername || !regPassword) {
      setError('All fields are required.');
      return;
    }
    setIsLoading(true);
    const response = await onRegister(regName, regUsername, regPassword);
    if (!response.success) {
      setError(response.message);
    }
    setIsLoading(false);
  };

  const commonInputClasses = "w-full bg-transparent border-b border-[#333] py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors disabled:opacity-50";
  const commonLabelClasses = "block text-xs text-gray-400 uppercase tracking-wider mb-2";
  const commonButtonClasses = "w-full mt-4 py-3 flex items-center justify-center bg-white rounded-md text-black font-semibold transition-all duration-300 hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-wait";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505]">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <InfinityIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl text-center font-serif mb-2">
          Loyalty <span className="serif-italic">Pro</span>
        </h1>
        <p className="text-center text-gray-400 mb-8">Admin Access Terminal</p>
        
        <div className="p-8 border border-[#333] bg-[#0a0a0a]">
          <div className="flex border-b border-[#333] mb-6">
            <button 
              onClick={() => setMode('login')} 
              className={`flex-1 py-2 text-sm transition-colors ${mode === 'login' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
              disabled={isLoading}
            >
              Login
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-sm transition-colors ${mode === 'register' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
              disabled={isLoading}
            >
              Register
            </button>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="animate-[fade-in_0.5s]">
              <div className="mb-6">
                <label className={commonLabelClasses}>Username</label>
                <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="Enter username" className={commonInputClasses} disabled={isLoading} />
              </div>
              <div className="mb-6">
                <label className={commonLabelClasses}>Password</label>
                <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••" className={commonInputClasses} disabled={isLoading} />
              </div>
              <button type="submit" className={commonButtonClasses} disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Authenticate'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="animate-[fade-in_0.5s]">
              <div className="mb-6">
                <label className={commonLabelClasses}>Business Name</label>
                <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="e.g., John's Cafe" className={commonInputClasses} disabled={isLoading} />
              </div>
              <div className="mb-6">
                <label className={commonLabelClasses}>Username</label>
                <input type="text" value={regUsername} onChange={e => setRegUsername(e.target.value)} placeholder="Create a username" className={commonInputClasses} disabled={isLoading} />
              </div>
              <div className="mb-6">
                <label className={commonLabelClasses}>Password</label>
                <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Create a secure password" className={commonInputClasses} disabled={isLoading} />
              </div>
              <button type="submit" className={commonButtonClasses} disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{` @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } `}</style>
    </div>
  );
};

export default AuthPage;
