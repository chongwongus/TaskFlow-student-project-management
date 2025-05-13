import React from 'react';
import ProjectForm from '../../components/ProjectBoard/ProjectForm';
import './NewProjectPage.scss';

const NewProjectPage: React.FC = () => {
  return (
    <div className="new-project-page">
      <ProjectForm />
    </div>
  );
};

export default NewProjectPage;