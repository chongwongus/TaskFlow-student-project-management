import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './App.scss';
import Header from './components/Header/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ThemeToggle, { setTheme } from './components/ThemeToggle/theme-toggle';
import { DarkTheme, LightTheme } from './style/colors';

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

const InnerApp: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  const [darkTheme, setDarkTheme] = useState(darkThemeMq.matches);

  const showHeader = !(location.pathname === '/' && !isAuthenticated);

  useEffect(() => {
    let theme = darkTheme ? DarkTheme : LightTheme;
    setTheme(theme);
  }, [darkTheme]);

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