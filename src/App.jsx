import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { api } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [initializing, setInitializing] = useState(true);

  // Check session on mount using localStorage token
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('fute_access_token');
      const storedUser = localStorage.getItem('fute_admin_user');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          await api.getMe();
          setIsAuthenticated(true);
          setAdminEmail(parsedUser.email);
        } catch (error) {
          console.error('Session verification failed, logging out...', error);
          handleLogout();
        }
      }
      setInitializing(false);
    };

    verifySession();
  }, []);

  const handleLoginSuccess = (token, email) => {
    sessionStorage.setItem('just_logged_in', 'true');
    setIsAuthenticated(true);
    setAdminEmail(email);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('fute_access_token');
      localStorage.removeItem('fute_refresh_token');
      localStorage.removeItem('fute_admin_user');
      setIsAuthenticated(false);
      setAdminEmail('');
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg p-6 gap-4">
        <div className="w-9 h-9 border-3 border-white/10 border-t-brand-primary rounded-full animate-spin"></div>
        <p className="text-sm text-gray-400">Loading Portal...</p>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard email={adminEmail} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
