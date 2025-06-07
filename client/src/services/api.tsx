import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'http://34.230.44.202:5000/api'  // Make sure this matches your server's exposed port
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

interface UserPreferenceData {
  email?: string;
  theme?: 'light' | 'dark';
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
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
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
  (error: Error) => Promise.reject(error)
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
  addMember: (id: string, email: string, role: string = 'member') => 
    api.post(`/projects/${id}/members`, { email, role }),
  removeMember: (projectId: string, userId: string) => 
    api.delete(`/projects/${projectId}/members/${userId}`),
  updateMemberRole: (projectId: string, userId: string, role: 'owner' | 'member' | 'viewer') =>
    api.put(`/projects/${projectId}/members/${userId}`, { role })
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

// Task services
export const userPreferenceService = {
  getUserPreference: (email: string) => api.get(`/userPreference/userEmail=${email}`),
  createUserPreference: (userPreferenceData: UserPreferenceData) => api.post('/userPreference', userPreferenceData),
  updateUserPreference: (email: string, userPreferenceData: Partial<UserPreferenceData>) => api.put(`/userPreference/${email}`, userPreferenceData),
};

// GitHub services
export const githubService = {
  // OAuth flow
  getAuthUrl: () => api.get('/github/auth-url'),
  exchangeCode: (code: string, state: string) => api.post('/github/token', { code, state }),
  getStatus: () => api.get('/github/status'),
  disconnect: () => api.delete('/github/disconnect'),
  
  // Repository operations
  getRepositories: () => api.get('/github/repositories'),
  getRepositoryDetails: (owner: string, repo: string) => api.get(`/github/repository/${owner}/${repo}`),
  getRepositoryCommits: (owner: string, repo: string) => api.get(`/github/repository/${owner}/${repo}/commits`),
  getRepositoryIssues: (owner: string, repo: string) => api.get(`/github/repository/${owner}/${repo}/issues`),
  
  // Project integration
  connectGithubRepo: (projectId: string, repoData: GithubRepoData) => api.post(`/projects/${projectId}/github`, repoData),
  
  // Task-issue integration
  connectGithubIssue: (taskId: string, issueData: {id: number, number: number, url: string}) => 
    api.post(`/tasks/${taskId}/github-issue`, issueData),
    
  // Issue management
  createIssue: (owner: string, repo: string, issueData: {title: string, body?: string, labels?: string[]}) =>
    api.post(`/github/repository/${owner}/${repo}/issues`, issueData),
  updateIssue: (owner: string, repo: string, issueNumber: number, issueData: {title?: string, body?: string, state?: string, labels?: string[]}) =>
    api.put(`/github/repository/${owner}/${repo}/issues/${issueNumber}`, issueData)
};

export default api;