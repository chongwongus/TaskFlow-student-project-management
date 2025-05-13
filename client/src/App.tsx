import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './pages/router';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="app-body">
        <div className="app-main-content">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
};

export default App;