import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectList from './ProjectList';
import ProjectDetail from './ProjectDetail';
import './ProjectBoard.scss';

const ProjectBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (id) {
    // If we have a project ID, show the project detail view
    return <ProjectDetail projectId={id} />;
  }
  
  // Otherwise show the project list
  return <ProjectList />;
};

export default ProjectBoard;