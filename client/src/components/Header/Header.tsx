import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.scss';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  // Don't show header on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <Link to={isAuthenticated ? '/projects' : '/'} className="logo-link">
            TaskFlow
          </Link>
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
              <div className="profile-dropdown">
                <div className="profile-trigger">
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="profile-avatar" 
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {user?.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="profile-menu">
                  <div className="profile-header">
                    <div className="profile-name">{user?.name}</div>
                    <div className="profile-email">{user?.email}</div>
                  </div>
                  <div className="profile-actions">
                    <button onClick={logout} className="logout-button">
                      Logout
                    </button>
                  </div>
                </div>
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