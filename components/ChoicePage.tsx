import React from 'react';
import { InfinityIcon } from './icons/Icons';

interface ChoicePageProps {
  onNewUser: () => void;
  onExistingUser: () => void;
}

const ChoicePage: React.FC<ChoicePageProps> = ({ onNewUser, onExistingUser }) => {
  return (
    <div className="h-screen flex items-center justify-center text-center p-4 animate-[fade-in_0.8s_ease-out]">
      <div>
        <div className="animate-[fade-slide-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards] opacity-0">
          <InfinityIcon className="w-12 h-12 mx-auto mb-5 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-serif animate-[fade-slide-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.3s_forwards] opacity-0">
          Loyalty <span className="serif-italic">Pro</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 animate-[fade-slide-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.5s_forwards] opacity-0">
          Define your journey.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center animate-[fade-slide-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.7s_forwards] opacity-0">
          <button 
            onClick={onNewUser}
            className="px-8 py-3 bg-transparent border border-[#333] rounded-md text-white transition-all duration-300 hover:border-white hover:-translate-y-0.5"
          >
            New User (Guest)
          </button>
          <button 
            onClick={onExistingUser}
            className="px-8 py-3 bg-white border border-white rounded-md text-black font-semibold transition-all duration-300 hover:bg-gray-200 hover:border-gray-200 hover:-translate-y-0.5"
          >
            Existing User
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { to { opacity: 1; } }
        @keyframes fade-slide-up { to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ChoicePage;
