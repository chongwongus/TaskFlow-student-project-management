import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.scss';
import { setTheme } from '../../components/ThemeToggle/theme-toggle';
import { userPreferenceService } from '../../services/api';
import { DarkTheme, LightTheme } from '../../style/colors';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle/theme-toggle';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

const LandingPage: React.FC = () => {
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  const { user } = useAuth();
  
  // Check localStorage first, then system preference
  const [darkTheme, setDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return darkThemeMq.matches;
  });

  useEffect(() => {
    const initializeTheme = async () => {
      let themeToUse = darkTheme;

      // If user is logged in, try to get their preference from the server
      if (user?.email) {
        try {
          const response = await userPreferenceService.getUserPreference(user.email);
          if (response?.data?.theme) {
            themeToUse = response.data.theme === 'dark';
            setDarkTheme(themeToUse);
          }
        } catch (error) {
          console.log('Could not fetch user preference, using local storage or default');
        }
      }

      // Apply the theme
      const theme = themeToUse ? DarkTheme : LightTheme;
      setTheme(theme);
      
      // Save to localStorage for persistence
      localStorage.setItem('theme', themeToUse ? 'dark' : 'light');
    };

    initializeTheme();
  }, [user?.email, darkTheme]);

  const features: FeatureCardProps[] = [
    {
      icon: '📋',
      title: 'Project Organization',
      description: 'Create projects, set milestones, and establish clear timelines for your team assignments.'
    },
    {
      icon: '✅',
      title: 'Task Management',
      description: 'Assign tasks, set priorities, track dependencies, and monitor progress with intuitive tools.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Communicate effectively, share files, and work together seamlessly on your projects.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Visualize project completion, individual contributions, and upcoming deadlines at a glance.'
    }
  ];

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo-container">
          <h1 className="logo">TaskFlow</h1>
          <p className="tagline">Streamline your team projects</p>
        </div>
        <nav className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link btn-primary">Get Started</Link>
          {/* Theme Toggle on Landing Page */}
          <ThemeToggle 
            DarkTheme={DarkTheme} 
            LightTheme={LightTheme} 
            userEmail={user?.email}
          />
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Project Management Made Simple for Student Teams</h2>
            <p className="hero-description">
              TaskFlow helps you organize projects, assign tasks, track progress, and collaborate 
              effectively—all in one centralized platform designed specifically for academic teams.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-primary">Create Free Account</Link>
              <Link to="/login" className="btn-secondary">See How It Works</Link>
            </div>
          </div>
          <div className="hero-image">
            {/* Placeholder for hero image */}
            <div className="placeholder-image"></div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Powerful Features for Effective Teamwork</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2 className="logo">TaskFlow</h2>
            <p className="tagline">TCSS 506 Web App Project</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© 2025 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;