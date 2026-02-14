import React, { useState, useCallback } from 'react';
import * as api from './backend/api';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

// A simpler type for the logged-in user state, containing only essential info for the client.
export type AuthenticatedAdmin = {
  username: string;
  name: string;
}

const App: React.FC = () => {
  const [loggedInAdmin, setLoggedInAdmin] = useState<AuthenticatedAdmin | null>(null);

  const handleLogin = useCallback(async (username: string, password: string): Promise<{success: boolean, message: string}> => {
    const response = await api.login(username, password);
    if (response.success && response.admin) {
      setLoggedInAdmin(response.admin);
    }
    return { success: response.success, message: response.message };
  }, []);

  const handleRegister = useCallback(async (name: string, username: string, password: string): Promise<{success: boolean, message: string}> => {
    const response = await api.register(name, username, password);
    if (response.success && response.admin) {
      setLoggedInAdmin(response.admin);
    }
    return { success: response.success, message: response.message };
  }, []);

  const handleLogout = useCallback(() => {
    setLoggedInAdmin(null);
  }, []);
  
  const renderContent = () => {
    if (loggedInAdmin) {
      return (
        <Dashboard 
          admin={loggedInAdmin}
          onLogout={handleLogout} 
        />
      );
    } else {
      return (
        <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5]">
      {renderContent()}
    </div>
  );
};

export default App;
