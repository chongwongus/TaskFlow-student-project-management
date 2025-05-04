import React from 'react';
import './LandingPage.scss';

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
          <a href="#" className="nav-link">Login</a>
          <a href="#" className="nav-link btn-primary">Get Started</a>
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
              <a href="#" className="btn-primary">Create Free Account</a>
              <a href="#" className="btn-secondary">See How It Works</a>
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