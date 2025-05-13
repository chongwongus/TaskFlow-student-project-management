import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.scss';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Always show the header now
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/'); // Redirect to landing page after logout
  };

  // Function to determine if we're on a project detail page
  const isProjectDetailPage = () => {
    // Check if we're on a project page, but not on the main projects list
    return location.pathname.includes('/projects/') && 
           location.pathname !== '/projects' && 
           !location.pathname.includes('/new');
  };

  // Function to get back to projects list
  const getBackToProjectsLink = () => {
    return (
      <Link to="/projects" className="nav-link back-to-projects">
        <span className="back-icon">←</span> Back to Projects
      </Link>
    );
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo-section">
          {/* Always show the TaskFlow logo */}
          <div className="header-logo">
            <Link to={isAuthenticated ? '/projects' : '/'} className="logo-link">
              TaskFlow
            </Link>
          </div>
          
          {/* Show back button on project detail pages */}
          {isAuthenticated && isProjectDetailPage() && getBackToProjectsLink()}
        </div>
        
        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <Link 
                to="/projects" 
                className={`nav-link ${location.pathname.includes('/projects') ? 'active' : ''}`}
              >
                Projects
              </Link>
              
              {/* Add a visible logout button */}
              <button 
                onClick={handleLogout}
                className="logout-button-visible"
              >
                Logout
              </button>
              
              <div className="profile-dropdown">
                <div className="profile-trigger" onClick={toggleMenu}>
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="profile-avatar" 
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                {menuOpen && (
                  <div className="profile-menu">
                    <div className="profile-header">
                      <div className="profile-name">{user?.name || 'User'}</div>
                      <div className="profile-email">{user?.email || ''}</div>
                    </div>
                    <div className="profile-actions">
                      <button onClick={handleLogout} className="logout-button">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;