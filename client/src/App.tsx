import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Replace with your actual client ID or use environment variable
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

const InnerApp: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const showHeader = !(location.pathname === '/' && !isAuthenticated);

  return (
    <div className="app">
      {showHeader && <Header />}
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
