import React from 'react';
import TaskDetail from '../../components/Task/TaskDetail';
import './TaskDetailPage.scss';

const TaskDetailPage: React.FC = () => {
  return (
    <div className="task-detail-page">
      <TaskDetail />
    </div>
  );
};

export default TaskDetailPage;