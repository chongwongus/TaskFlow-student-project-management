import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectForm from '../../components/ProjectBoard/ProjectForm';
import { projectService } from '../../services/api';
import './EditProjectPage.scss';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
}

const EditProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const response = await projectService.getProject(id);
        setProject(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load project');
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div>Loading project...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!project) return <div>Project not found</div>;

  const initialData = {
    name: project.name,
    description: project.description,
    status: project.status
  };

  return (
    <div className="edit-project-page">
      <ProjectForm 
        initialData={initialData}
        isEditing={true}
        projectId={id}
      />
    </div>
  );
};

export default EditProjectPage;