import { createBrowserRouter } from 'react-router-dom';  // Note: This should be from 'react-router-dom', not 'react-router'
import LandingPage from './LandingPage/LandingPage';
import ProjectPage from './ProjectPage/ProjectPage';
import Login from './Login/Login';
import Register from './Register/Register';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Google OAuth Client ID - replace with your actual client ID
const googleClientId = "YOUR_GOOGLE_CLIENT_ID";

// Wrap components that need authentication with AuthProvider
const WrappedLandingPage = () => (
  <LandingPage />
);

const WrappedLoginPage = () => (
  <GoogleOAuthProvider clientId={googleClientId}>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </GoogleOAuthProvider>
);

const WrappedRegisterPage = () => (
  <GoogleOAuthProvider clientId={googleClientId}>
    <AuthProvider>
      <Register />
    </AuthProvider>
  </GoogleOAuthProvider>
);

const WrappedProjectPage = () => (
  <AuthProvider>
    <ProtectedRoute children={<ProjectPage />} />
  </AuthProvider>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WrappedLandingPage />,
  },
  {
    path: '/login',
    element: <WrappedLoginPage />,
  },
  {
    path: '/register',
    element: <WrappedRegisterPage />,
  },
  {
    path: '/projects',
    element: <WrappedProjectPage />,
  },
]);