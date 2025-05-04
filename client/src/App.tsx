import React from 'react';
import './App.css';
import { router } from './pages/router';
import { RouterProvider } from 'react-router';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="app-body">
        <div className="app-left-nav-container">
        </div>
        <div className="app-main-content">
              <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
};

export default App;