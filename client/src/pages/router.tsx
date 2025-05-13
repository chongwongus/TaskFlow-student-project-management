import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import ProjectPage from './ProjectPage/ProjectPage';
import Login from './Login/Login';
import Register from './Register/Register';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NewProjectPage from './NewProjectPage/NewProjectPage';
import EditProjectPage from './EditProjectPage/EditProjectPage';
import NewTaskPage from './NewTaskPage/NewTaskPage';
import EditTaskPage from './EditTaskPage/EditTaskPage';
import TaskDetailPage from './TaskDetailPage/TaskDetailPage';

// Google OAuth Client ID - replace with your actual client ID
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/login',
    element: (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </GoogleOAuthProvider>
    )
  },
  {
    path: '/register',
    element: (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </GoogleOAuthProvider>
    )
  },
  {
    path: '/projects',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <ProjectPage />
        </ProtectedRoute>
      </AuthProvider>
    )
  },
  {
    path: '/projects/new',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <NewProjectPage />
        </ProtectedRoute>
      </AuthProvider>
    )
  },
  {
    path: '/projects/:id',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <ProjectPage />
        </ProtectedRoute>
      </AuthProvider>
    )
  },
  {
    path: '/projects/:id/edit',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <EditProjectPage />
        </ProtectedRoute>
      </AuthProvider>
    )
  },
  {
    path: '/projects/:projectId/tasks/new',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <NewTaskPage />
        </ProtectedRoute>
      </AuthProvider>
    )
  },
  {
    path: '/projects/:projectId/tasks/:taskId',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <TaskDetailPage />
        </ProtectedRoute>
      </AuthProvider>
    )
  },
  {
    path: '/projects/:projectId/tasks/:taskId/edit',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <EditTaskPage />
        </ProtectedRoute>
      </AuthProvider>
    )
  }
]);