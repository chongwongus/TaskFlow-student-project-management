import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/api';
import SearchBar from '../Search/SearchBar';
import './ProjectBoard.scss';

interface ProjectMember {
  user: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  };
  role: 'owner' | 'member' | 'viewer';
  joinedAt: string;
}

interface GithubRepo {
  owner: string;
  name: string;
  fullName: string;
  url: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  };
  members: ProjectMember[];
  githubRepo?: GithubRepo;
  createdAt: string;
  updatedAt: string;
}

interface ProjectListProps {}

const ProjectList: React.FC<ProjectListProps> = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.getProjects();
        setProjects(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) {
      return projects;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.status.toLowerCase().includes(searchLower) ||
      project.owner.name.toLowerCase().includes(searchLower)
    );
  }, [projects, searchTerm]);

  if (loading) return <div className="loading-container">Loading projects...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="project-list">
      <div className="project-list-header">
        <div className="header-left">
          <h2>My Projects</h2>
          {projects.length > 0 && (
            <span className="project-count">
              {filteredProjects.length === projects.length 
                ? `${projects.length} project${projects.length !== 1 ? 's' : ''}`
                : `${filteredProjects.length} of ${projects.length} projects`
              }
            </span>
          )}
        </div>
        <div className="header-right">
          <Link to="/projects/new" className="btn-primary">Create Project</Link>
        </div>
      </div>
      
      {/* Search Bar */}
      {projects.length > 0 && (
        <div className="search-section">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search projects by name, description, status, or owner..."
            className="project-search"
          />
        </div>
      )}
      
      {projects.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any projects yet. Create your first project to get started!</p>
          <Link to="/projects/new" className="btn-primary">Create Project</Link>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="no-results">
          <p>No projects found matching "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="btn-secondary"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="project-grid">
          {filteredProjects.map((project) => (
            <Link 
              to={`/projects/${project._id}`} 
              key={project._id} 
              className={`project-card ${project.status}`}
            >
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              
              <div className="project-meta">
                <div className="project-owner">
                  <span className="owner-label">Owner:</span>
                  <span className="owner-name">{project.owner.name}</span>
                </div>
                <div className="member-count">
                  {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="project-status">
                <span className={`status-badge ${project.status}`}>
                  {project.status.replace(/-/g, ' ')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;