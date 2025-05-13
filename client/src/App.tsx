import React, { ReactNode } from 'react';
import './App.css';
import Header from './components/Header/Header';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Google OAuth Client ID - replace with your actual client ID
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

// Define prop types with children
interface AppProps {
  children?: ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <div className="app">
          <Header />
          <main className="app-main">
            {children}
          </main>
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
