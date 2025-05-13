import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskForm from '../../components/Task/TaskForm';
import { taskService } from '../../services/api';
import './EditTaskPage.scss';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'to-do' | 'in-progress' | 'in-review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  project: string;
  assignedTo?: string;
  dueDate?: string;
}

const EditTaskPage: React.FC = () => {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
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

  if (loading) return <div>Loading task...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!task) return <div>Task not found</div>;

  // Format the date for the form
  let formattedDueDate = undefined;
  if (task.dueDate) {
    const date = new Date(task.dueDate);
    formattedDueDate = date.toISOString().split('T')[0];
  }

  const initialData = {
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    assignedTo: task.assignedTo,
    dueDate: formattedDueDate
  };

  return (
    <div className="edit-task-page">
      <TaskForm 
        initialData={initialData}
        isEditing={true}
        taskId={taskId}
      />
    </div>
  );
};

export default EditTaskPage;