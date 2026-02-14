import React from 'react';
import { Section } from '../types';
import { ChartLineIcon, PlusIcon, SearchIcon, UsersIcon, ChartPieIcon, BrainCircuitIcon } from './icons/Icons';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  isCollapsed: boolean;
}

const navItems = [
  { id: Section.Overview, label: 'Overview', icon: ChartLineIcon },
  { id: Section.Transaction, label: 'Transaction', icon: PlusIcon },
  { id: Section.Search, label: 'Search', icon: SearchIcon },
  { id: Section.Customers, label: 'Customers', icon: UsersIcon },
  { id: Section.Analytics, label: 'Analytics', icon: ChartPieIcon },
  { id: Section.AiInsights, label: 'AI Insights', icon: BrainCircuitIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isCollapsed }) => {
  return (
    <aside className={`fixed top-0 left-0 h-full bg-[#0a0a0a] border-r border-[#333] z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCollapsed ? 'w-16' : 'w-60'}`}>
      <div className="flex items-center justify-center h-16 border-b border-[#333]">
        {/* Placeholder for logo if needed */}
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <button 
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center w-full text-left px-5 py-4 my-1 transition-colors duration-200 relative
                  ${activeSection === item.id ? 'text-white bg-[#111]' : 'text-gray-400 hover:text-white hover:bg-[#151515]'}
                `}
              >
                {activeSection === item.id && <div className="absolute left-0 top-0 h-full w-0.5 bg-white"></div>}
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="ml-5">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
