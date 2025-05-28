import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../../services/api';
import { formatDisplayDate, isOverdue, isDueSoon, getRelativeTime } from '../../utils/dateUtils';
import './Task.scss';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'to-do' | 'in-progress' | 'in-review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  project: {
    _id: string;
    name: string;
  };
  assignedTo?: User;
  dueDate?: string;
  completedAt?: string;
  githubIssue?: {
    id: number;
    number: number;
    url: string;
  };
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

const TaskDetail: React.FC = () => {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!taskId) return;
        
        setLoading(true);
        const response = await taskService.getTask(taskId);
        setTask(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load task');
        console.error('Error loading task:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleEditTask = () => {
    navigate(`/projects/${projectId}/tasks/${taskId}/edit`);
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(task._id);
        navigate(`/projects/${projectId}`);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete task');
        console.error('Error deleting task:', err);
      }
    }
  };

  const getDueDateStatus = () => {
    if (!task?.dueDate || task.status === 'completed') return null;
    
    if (isOverdue(task.dueDate)) {
      return { type: 'overdue', message: 'Overdue' };
    }
    
    if (isDueSoon(task.dueDate)) {
      return { type: 'due-soon', message: 'Due soon' };
    }
    
    return null;
  };

  if (loading) return <div>Loading task...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!task) return <div>Task not found</div>;

  const dueDateStatus = getDueDateStatus();

  return (
    <div className="task-detail">
      <div className="task-header">
        <div className="task-title">
          <h1>{task.title}</h1>
          <div className="task-meta">
            <span className={`task-badge status-badge ${task.status}`}>
              {task.status.replace(/-/g, ' ')}
            </span>
            <span className={`task-badge priority-badge ${task.priority}`}>
              {task.priority} priority
            </span>
            {dueDateStatus && (
              <span className={`task-badge due-date-badge ${dueDateStatus.type}`}>
                {dueDateStatus.message}
              </span>
            )}
          </div>
        </div>
        
        <div className="task-actions">
          <button 
            onClick={handleEditTask}
            className="btn-secondary"
          >
            Edit Task
          </button>
          <button 
            onClick={handleDeleteTask}
            className="btn-secondary btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
      
      {task.description && (
        <div className="task-description">
          <h3>Description</h3>
          <p>{task.description}</p>
        </div>
      )}
      
      <div className="task-details">
        <div className="detail-item">
          <span className="label">Project</span>
          <div className="value">
            <a 
              href={`/projects/${task.project._id}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/projects/${task.project._id}`);
              }}
            >
              {task.project.name}
            </a>
          </div>
        </div>
        
        <div className="detail-item">
          <span className="label">Status</span>
          <div className="value">
            <span className={`status-badge ${task.status}`}>
              {task.status.replace(/-/g, ' ')}
            </span>
          </div>
        </div>
        
        <div className="detail-item">
          <span className="label">Assigned To</span>
          <div className="value">
            {task.assignedTo ? (
              <div className="assignee">
                {task.assignedTo.avatar ? (
                  <img 
                    src={task.assignedTo.avatar} 
                    alt={task.assignedTo.name} 
                    className="assignee-avatar" 
                  />
                ) : (
                  <div className="assignee-initials">
                    {task.assignedTo.name.charAt(0)}
                  </div>
                )}
                <span>{task.assignedTo.name}</span>
              </div>
            ) : (
              <span>Unassigned</span>
            )}
          </div>
        </div>
        
        <div className="detail-item">
          <span className="label">Priority</span>
          <div className="value">
            <span className={`priority-badge ${task.priority}`}>
              {task.priority}
            </span>
          </div>
        </div>
        
        <div className="detail-item">
          <span className="label">Created By</span>
          <div className="value">
            <div className="assignee">
              {task.createdBy.avatar ? (
                <img 
                  src={task.createdBy.avatar} 
                  alt={task.createdBy.name} 
                  className="assignee-avatar" 
                />
              ) : (
                <div className="assignee-initials">
                  {task.createdBy.name.charAt(0)}
                </div>
              )}
              <span>{task.createdBy.name}</span>
            </div>
          </div>
        </div>
        
        <div className="detail-item">
          <span className="label">Created On</span>
          <div className="value">
            {formatDisplayDate(task.createdAt)}
          </div>
        </div>
        
        {task.dueDate && (
          <div className="detail-item">
            <span className="label">Due Date</span>
            <div className="value">
              <div className="due-date-info">
                <span className={dueDateStatus ? `due-date ${dueDateStatus.type}` : 'due-date'}>
                  {formatDisplayDate(task.dueDate)}
                </span>
                <span className="relative-time">
                  ({getRelativeTime(task.dueDate)})
                </span>
              </div>
            </div>
          </div>
        )}
        
        {task.completedAt && (
          <div className="detail-item">
            <span className="label">Completed On</span>
            <div className="value">
              {formatDisplayDate(task.completedAt)}
            </div>
          </div>
        )}
      </div>
      
      {task.githubIssue && (
        <div className="github-issue">
          <h3>
            <span className="github-icon">🔗</span>
            GitHub Issue
          </h3>
          <a 
            href={task.githubIssue.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="issue-link"
          >
            Issue #{task.githubIssue.number}
          </a>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;