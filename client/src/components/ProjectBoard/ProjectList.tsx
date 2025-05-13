import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/api';
import './ProjectBoard.scss'; // Make sure to add the styles

interface ProjectMember {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
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
    avatar?: string;
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

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="project-list">
      <div className="project-list-header">
        <h2>My Projects</h2>
        <Link to="/projects/new" className="btn-primary">Create Project</Link>
      </div>
      
      {projects.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any projects yet. Create your first project to get started!</p>
          <Link to="/projects/new" className="btn-primary">Create Project</Link>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <Link to={`/projects/${project._id}`} key={project._id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-status">
                <span className={`status-badge ${project.status}`}>
                  {project.status.replace('-', ' ')}
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