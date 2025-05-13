// src/components/ProjectBoard/ProjectForm.tsx - Add this file to your ProjectBoard directory
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../services/api';
import './ProjectBoard.scss'; // Make sure to update your styles

interface ProjectFormData {
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
}

interface ProjectFormProps {
  initialData?: ProjectFormData;
  isEditing?: boolean;
  projectId?: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  initialData = { name: '', description: '', status: 'planning' },
  isEditing = false,
  projectId
}) => {
  const [formData, setFormData] = useState<ProjectFormData>(initialData);
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot be more than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        setError(null);
        
        if (isEditing && projectId) {
          await projectService.updateProject(projectId, formData);
        } else {
          await projectService.createProject(formData);
        }
        
        navigate('/projects');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save project');
        console.error('Project form error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="project-form-container">
      <h2>{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="name">Project Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'input-error' : ''}
            rows={4}
            disabled={loading}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
          <div className="char-count">
            {formData.description.length}/500 characters
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/projects')}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;