import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import LandingPage from './LandingPage/LandingPage';
import Login from './Login/Login';
import Register from './Register/Register';
import ProjectPage from './ProjectPage/ProjectPage';
import NewProjectPage from './NewProjectPage/NewProjectPage';
import EditProjectPage from './EditProjectPage/EditProjectPage';
import NewTaskPage from './NewTaskPage/NewTaskPage';
import EditTaskPage from './EditTaskPage/EditTaskPage';
import TaskDetailPage from './TaskDetailPage/TaskDetailPage';
import GitHubCallback from './GitHubCallback/GitHubCallback';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import RedirectIfLoggedIn from '../components/Auth/RedirectIfLoggedIn';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <RedirectIfLoggedIn>
            <LandingPage />
          </RedirectIfLoggedIn>
        )
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'github/callback',
        element: (
          <ProtectedRoute>
            <GitHubCallback />
          </ProtectedRoute>
        )
      },
      {
        path: 'projects',
        element: (
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'projects/new',
        element: (
          <ProtectedRoute>
            <NewProjectPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'projects/:id',
        element: (
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'projects/:id/edit',
        element: (
          <ProtectedRoute>
            <EditProjectPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'projects/:projectId/tasks/new',
        element: (
          <ProtectedRoute>
            <NewTaskPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'projects/:projectId/tasks/:taskId',
        element: (
          <ProtectedRoute>
            <TaskDetailPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'projects/:projectId/tasks/:taskId/edit',
        element: (
          <ProtectedRoute>
            <EditTaskPage />
          </ProtectedRoute>
        )
      }
    ]
  }
]);