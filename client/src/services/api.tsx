import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'http://your-ec2-domain-or-ip:5000/api'  // Replace with your EC2 domain/IP
  : 'http://localhost:5000/api';

// Define types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface ProjectData {
  name: string;
  description: string;
  status?: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate?: Date;
  endDate?: Date;
}

interface TaskData {
  title: string;
  description?: string;
  status?: 'to-do' | 'in-progress' | 'in-review' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  project: string;
  assignedTo?: string;
  dueDate?: Date;
}

interface GithubRepoData {
  owner: string;
  name: string;
  fullName: string;
  url: string;
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // This is important for CORS
});

// Add request interceptor to add auth token - with corrected typing
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  register: (userData: RegisterData) => api.post('/auth/register', userData),
  login: (credentials: LoginCredentials) => api.post('/auth/login', credentials),
  googleLogin: (tokenId: string) => api.post('/auth/google', { tokenId }),
  getProfile: () => api.get('/auth/me')
};

// Project services
export const projectService = {
  getProjects: () => api.get('/projects'),
  getProject: (id: string) => api.get(`/projects/${id}`),
  createProject: (projectData: ProjectData) => api.post('/projects', projectData),
  updateProject: (id: string, projectData: Partial<ProjectData>) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id: string) => api.delete(`/projects/${id}`),
  addMember: (id: string, email: string) => api.post(`/projects/${id}/members`, { email }),
  removeMember: (projectId: string, userId: string) => api.delete(`/projects/${projectId}/members/${userId}`)
};

// Task services
export const taskService = {
  getProjectTasks: (projectId: string) => api.get(`/tasks/project/${projectId}`),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getTask: (id: string) => api.get(`/tasks/${id}`),
  createTask: (taskData: TaskData) => api.post('/tasks', taskData),
  updateTask: (id: string, taskData: Partial<TaskData>) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`)
};

// GitHub services
export const githubService = {
  getRepositories: () => api.get('/github/repositories'),
  getRepositoryDetails: (owner: string, repo: string) => api.get(`/github/repository/${owner}/${repo}`),
  getRepositoryIssues: (owner: string, repo: string) => api.get(`/github/repository/${owner}/${repo}/issues`),
  connectGithubRepo: (projectId: string, repoData: GithubRepoData) => api.post(`/projects/${projectId}/github`, repoData),
  connectGithubIssue: (taskId: string, issueData: {id: number, number: number, url: string}) => 
    api.post(`/tasks/${taskId}/github-issue`, issueData)
};

export default api;
