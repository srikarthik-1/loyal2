import React from 'react';
import { AuthenticatedAdmin } from '../App';
import { MenuIcon, PowerIcon } from './icons/Icons';

interface HeaderProps {
  admin: AuthenticatedAdmin;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ admin, onLogout, onToggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#333] bg-[#0a0a0a]/80 px-4 md:px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="text-gray-300 hover:text-white transition-colors">
          <MenuIcon className="w-6 h-6" />
        </button>
        <div className="text-lg font-serif tracking-wider">
          Loyalty <span className="serif-italic">Pro</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:block border border-[#333] px-3 py-1 rounded-full text-xs uppercase tracking-widest text-gray-300">
          {admin.name}
        </div>
        <button 
          onClick={onLogout} 
          className="flex items-center gap-2 px-3 py-2 text-sm border border-[#444] rounded-md text-gray-300 hover:border-white hover:text-white transition-all duration-300"
        >
          <PowerIcon className="w-4 h-4" />
          <span className="hidden md:inline">Exit</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
