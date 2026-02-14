import React, { useState, useEffect, useCallback } from 'react';
import { Customer, Section } from '../types';
import { AuthenticatedAdmin } from '../App';
import * as api from '../backend/api';
import Header from './Header';
import Sidebar from './Sidebar';
import Overview from './dashboard/Overview';
import Transaction from './dashboard/Transaction';
import Search from './dashboard/Search';
import CustomerList from './dashboard/CustomerList';
import Analytics from './dashboard/Analytics';
import AiInsights from './dashboard/AiInsights';

interface DashboardProps {
  admin: AuthenticatedAdmin;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ admin, onLogout }) => {
  const [activeSection, setActiveSection] = useState<Section>(Section.Overview);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const customerData = await api.getAdminData(admin.username);
      setCustomers(customerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [admin.username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTransaction = useCallback(async (customer: Customer, transaction: { bill: number, points: number }): Promise<{success: boolean, message: string}> => {
    const response = await api.addTransaction(admin.username, customer, transaction);
    if (response.success) {
      await fetchData(); // Re-fetch data to update UI
    }
    return response;
  }, [admin.username, fetchData]);

  const renderSection = () => {
    if (isLoading) {
      return (
          <div className="text-center p-20 text-gray-500">
              <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading System Data...</p>
          </div>
      );
    }
    if (error) {
      return <div className="text-center p-10 text-red-500 bg-red-900/20 border border-red-800">Error: {error}</div>;
    }
    
    const sectionProps = { customers };
    switch (activeSection) {
      case Section.Overview:
        return <Overview {...sectionProps} />;
      case Section.Transaction:
        return <Transaction customers={customers} onTransaction={handleTransaction} />;
      case Section.Search:
        return <Search {...sectionProps} />;
      case Section.Customers:
        return <CustomerList {...sectionProps} />;
      case Section.Analytics:
        return <Analytics {...sectionProps} />;
      case Section.AiInsights:
        return <AiInsights customers={customers} adminUsername={admin.username} />;
      default:
        return <Overview {...sectionProps} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={isSidebarCollapsed}
      />
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <Header
          admin={admin}
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 p-6 md:p-10 bg-[#050505]">
            <div className="animate-[fade-slide-up_0.6s_forwards] opacity-0">
                {renderSection()}
            </div>
        </main>
      </div>
      <style>{`
        @keyframes fade-slide-up { 
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-\\[fade-slide-up_0\\.6s_forwards\\] {
            animation-fill-mode: forwards;
            animation-name: fade-slide-up;
            animation-duration: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
