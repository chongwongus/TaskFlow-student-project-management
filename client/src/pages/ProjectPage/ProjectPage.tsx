import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectBoard from '../../components/ProjectBoard/ProjectBoard';
import './ProjectPage.scss';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="project-page">
      <ProjectBoard />
    </div>
  );
};

export default ProjectPage;