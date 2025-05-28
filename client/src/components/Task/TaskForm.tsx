import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskService, projectService } from '../../services/api';
import DateInput from '../DateInput/DateInput';
import { formatInputDate, getTodayString, isValidDate } from '../../utils/dateUtils';
import './Task.scss';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface TaskFormData {
  title: string;
  description: string;
  status: 'to-do' | 'in-progress' | 'in-review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
}

interface ProjectMember {
  user: User;
  role: string;
}

interface Project {
  _id: string;
  name: string;
  members: ProjectMember[];
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  isEditing?: boolean;
  taskId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialData = { 
    title: '', 
    description: '', 
    status: 'to-do', 
    priority: 'medium' 
  },
  isEditing = false,
  taskId
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'to-do',
    priority: initialData.priority || 'medium',
    assignedTo: initialData.assignedTo || '',
    dueDate: formatInputDate(initialData.dueDate) || ''
  });
  
  const [project, setProject] = useState<Project | null>(null);
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) return;
        
        const response = await projectService.getProject(projectId);
        setProject(response.data.data);
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError(err.response?.data?.message || 'Failed to load project members');
      }
    };

    fetchProject();
  }, [projectId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

  const handleDateChange = (value: string) => {
    setFormData({
      ...formData,
      dueDate: value
    });
    
    // Clear date error
    if (errors.dueDate) {
      const newErrors = { ...errors };
      delete newErrors.dueDate;
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot be more than 500 characters';
    }
    
    // Validate due date if provided
    if (formData.dueDate) {
      if (!isValidDate(formData.dueDate)) {
        newErrors.dueDate = 'Invalid due date';
      } else {
        const dueDate = new Date(formData.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Warn if due date is in the past (but allow it)
        if (dueDate < today && !isEditing) {
          // This is just a warning, not an error
          console.warn('Due date is in the past');
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!projectId) {
      setError('Project ID is missing.');
      return;
    }
  
    if (validateForm()) {
      try {
        setLoading(true);
        setError(null);
  
        // Prepare task data for submission
        const taskData = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          project: projectId,
          // Only include assignedTo if it's not empty
          ...(formData.assignedTo && formData.assignedTo !== '' && { assignedTo: formData.assignedTo }),
          // Only include dueDate if it's provided
          ...(formData.dueDate && { dueDate: new Date(formData.dueDate) })
        };
  
        if (isEditing && taskId) {
          await taskService.updateTask(taskId, taskData);
        } else {
          await taskService.createTask(taskData);
        }
  
        navigate(`/projects/${projectId}`);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save task');
        console.error('Task form error:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <div className="task-form-container">
      <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'input-error' : ''}
            disabled={loading}
            placeholder="Enter task title..."
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'input-error' : ''}
            rows={4}
            disabled={loading}
            placeholder="Describe the task..."
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
          <div className="char-count">
            {formData.description ? formData.description.length : 0}/500 characters
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
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="in-review">In Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo || ''}
              onChange={handleChange}
              disabled={loading || !project}
            >
              <option value="">Unassigned</option>
              {project?.members.map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>
          
          <DateInput
            label="Due Date (Optional)"
            value={formData.dueDate}
            onChange={handleDateChange}
            min={getTodayString()}
            error={errors.dueDate}
            disabled={loading}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate(`/projects/${projectId}`)}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;