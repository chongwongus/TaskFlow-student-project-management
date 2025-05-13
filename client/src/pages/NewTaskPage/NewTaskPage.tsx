import React from 'react';
import TaskForm from '../../components/Task/TaskForm';
import './NewTaskPage.scss';

const NewTaskPage: React.FC = () => {
  return (
    <div className="new-task-page">
      <TaskForm />
    </div>
  );
};

export default NewTaskPage;