import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../services/api';
import DateInput from '../DateInput/DateInput';
import { formatInputDate, validateDateRange, getTodayString } from '../../utils/dateUtils';
import './ProjectBoard.scss';

interface ProjectFormData {
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate?: string;
  endDate?: string;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  isEditing?: boolean;
  projectId?: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  initialData = { 
    name: '', 
    description: '', 
    status: 'planning',
    startDate: getTodayString() // Default to today
  },
  isEditing = false,
  projectId
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData.name || '',
    description: initialData.description || '',
    status: initialData.status || 'planning',
    startDate: formatInputDate(initialData.startDate) || getTodayString(),
    endDate: formatInputDate(initialData.endDate) || ''
  });
  
  const [errors, setErrors] = useState<Partial<ProjectFormData & { dateRange?: string }>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      const newErrors = { ...errors };
      delete newErrors[name as keyof typeof errors];
      setErrors(newErrors);
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate') => (value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear date-related errors
    const newErrors = { ...errors };
    delete newErrors[field];
    delete newErrors.dateRange;
    setErrors(newErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData & { dateRange?: string }> = {};
    
    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot be more than 500 characters';
    }
    
    // Date validation
    const dateValidation = validateDateRange(formData.startDate, formData.endDate);
    if (!dateValidation.isValid) {
      newErrors.dateRange = dateValidation.error;
    }
    
    // Start date shouldn't be in the past for new projects (unless editing)
    if (!isEditing && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
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
        
        // Prepare data for submission
        const submitData = {
          ...formData,
          startDate: formData.startDate ? new Date(formData.startDate) : undefined,
          endDate: formData.endDate ? new Date(formData.endDate) : undefined
        };
        
        if (isEditing && projectId) {
          await projectService.updateProject(projectId, submitData);
        } else {
          await projectService.createProject(submitData);
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
            placeholder="Enter project name..."
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
            placeholder="Describe your project..."
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
          <div className="char-count">
            {formData.description.length}/500 characters
          </div>
        </div>
        
        <div className="form-row">
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
        </div>
        
        {/* Date Inputs */}
        <div className="form-row">
          <DateInput
            label="Start Date"
            value={formData.startDate}
            onChange={handleDateChange('startDate')}
            min={!isEditing ? getTodayString() : undefined}
            error={errors.startDate}
            required
          />
          
          <DateInput
            label="End Date (Optional)"
            value={formData.endDate}
            onChange={handleDateChange('endDate')}
            min={formData.startDate || getTodayString()}
            error={errors.endDate}
          />
        </div>
        
        {/* Date Range Error */}
        {errors.dateRange && (
          <div className="error-message date-range-error">
            {errors.dateRange}
          </div>
        )}
        
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