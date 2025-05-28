import React, { useState, useEffect } from 'react';
import { githubService } from '../../services/api';
import './Modals.scss';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  private: boolean;
  updated_at: string;
  language?: string;
}

interface GitHubRepoModalProps {
  projectId: string;
  onClose: () => void;
  onRepoConnected: () => void;
}

const GitHubRepoModal: React.FC<GitHubRepoModalProps> = ({ 
  projectId, 
  onClose,
  onRepoConnected
}) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState<string>('');

  useEffect(() => {
    checkGitHubConnection();
  }, []);

  const checkGitHubConnection = async () => {
    try {
      setLoading(true);
      // Check GitHub connection status first
      const statusResponse = await githubService.getStatus();
      
      if (statusResponse.data.data.connected) {
        // If connected, fetch repositories
        const repoResponse = await githubService.getRepositories();
        setRepositories(repoResponse.data.data);
        setGithubConnected(true);
        setGithubUsername(statusResponse.data.data.username || '');
        setError(null);
      } else {
        setGithubConnected(false);
        setError(null);
      }
    } catch (err: any) {
      setGithubConnected(false);
      setError(err.response?.data?.message || 'Failed to check GitHub connection');
      console.error('Error checking GitHub connection:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGitHub = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get GitHub OAuth URL
      const response = await githubService.getAuthUrl();
      const authUrl = response.data.data.authUrl;
      
      // Redirect to GitHub OAuth
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate GitHub connection');
      setLoading(false);
    }
  };

  const handleDisconnectGitHub = async () => {
    if (window.confirm('Are you sure you want to disconnect your GitHub account? This will remove access to all repositories.')) {
      try {
        setLoading(true);
        await githubService.disconnect();
        setGithubConnected(false);
        setRepositories([]);
        setGithubUsername('');
        setSelectedRepo(null);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to disconnect GitHub account');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
  };

  const handleConnectRepository = async () => {
    if (!selectedRepo) return;

    try {
      setConnecting(true);
      setError(null);

      // Extract owner from full_name (e.g., "owner/repo" -> "owner")
      const [owner, repoName] = selectedRepo.full_name.split('/');

      const repoData = {
        owner,
        name: repoName,
        fullName: selectedRepo.full_name,
        url: selectedRepo.html_url
      };

      await githubService.connectGithubRepo(projectId, repoData);
      
      onRepoConnected();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect repository');
      console.error('Error connecting repository:', err);
    } finally {
      setConnecting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container github-repo-modal">
        <div className="modal-header">
          <h3>Connect GitHub Repository</h3>
          <button 
            className="close-button"
            onClick={onClose}
            disabled={loading || connecting}
          >
            &times;
          </button>
        </div>
        
        {error && <div className="modal-error">{error}</div>}
        
        <div className="modal-content">
          {!githubConnected ? (
            <div className="github-connect-section">
              <div className="github-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
              <h4>Connect Your GitHub Account</h4>
              <p>To link repositories to your projects, you need to first connect your GitHub account.</p>
              <button 
                className="btn-primary"
                onClick={handleConnectGitHub}
                disabled={loading}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  margin: '0 auto'
                }}
              >
                {loading ? (
                  <>
                    <span>Connecting...</span>
                    <div className="loading-spinner" style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  </>
                ) : (
                  <>
                    <span>📱</span>
                    <span>Connect GitHub Account</span>
                  </>
                )}
              </button>
            </div>
          ) : loading ? (
            <div className="loading-section">
              <div className="loading-spinner" style={{
                width: '50px',
                height: '50px',
                border: '4px solid #e3f2fd',
                borderTop: '4px solid #2196f3',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p>Loading your repositories...</p>
            </div>
          ) : (
            <>
              <div className="github-status-section" style={{
                backgroundColor: '#e8f5e9',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ color: '#388e3c', fontWeight: '600' }}>
                    ✅ Connected as {githubUsername}
                  </span>
                </div>
                <button
                  onClick={handleDisconnectGitHub}
                  className="btn-secondary"
                  style={{ 
                    fontSize: '0.8rem', 
                    padding: '0.4rem 0.8rem',
                    color: '#d32f2f',
                    borderColor: '#d32f2f'
                  }}
                  disabled={loading}
                >
                  Disconnect
                </button>
              </div>
              
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="repo-search-input"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    marginBottom: '1rem'
                  }}
                />
              </div>
              
              <div className="repositories-list">
                <div className="repo-count" style={{
                  color: '#666',
                  fontSize: '0.9rem',
                  marginBottom: '1rem'
                }}>
                  {filteredRepositories.length} of {repositories.length} repositories
                  {searchTerm && ` matching "${searchTerm}"`}
                </div>
                
                {filteredRepositories.length === 0 ? (
                  <div className="no-repos" style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#666'
                  }}>
                    {searchTerm ? (
                      <p>No repositories found matching "{searchTerm}"</p>
                    ) : (
                      <p>No repositories found in your GitHub account</p>
                    )}
                  </div>
                ) : (
                  <div className="repo-items" style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px'
                  }}>
                    {filteredRepositories.map((repo) => (
                      <div
                        key={repo.id}
                        className={`repo-item ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                        onClick={() => handleSelectRepo(repo)}
                        style={{
                          padding: '1rem',
                          borderBottom: '1px solid #f0f0f0',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          backgroundColor: selectedRepo?.id === repo.id ? '#e3f2fd' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedRepo?.id !== repo.id) {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRepo?.id !== repo.id) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <div className="repo-info">
                          <div className="repo-name" style={{
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <span>📁</span>
                            {repo.name}
                            {repo.private && (
                              <span className="private-badge" style={{
                                backgroundColor: '#ffecb3',
                                color: '#f57c00',
                                fontSize: '0.7rem',
                                padding: '0.2rem 0.4rem',
                                borderRadius: '4px',
                                fontWeight: '500'
                              }}>
                                Private
                              </span>
                            )}
                          </div>
                          <div className="repo-full-name" style={{
                            color: '#666',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem'
                          }}>
                            {repo.full_name}
                          </div>
                          {repo.description && (
                            <div className="repo-description" style={{
                              color: '#555',
                              fontSize: '0.9rem',
                              marginBottom: '0.75rem',
                              lineHeight: '1.4'
                            }}>
                              {repo.description}
                            </div>
                          )}
                          <div className="repo-meta" style={{
                            display: 'flex',
                            gap: '1rem',
                            fontSize: '0.8rem',
                            color: '#888'
                          }}>
                            {repo.language && (
                              <span className="repo-language">
                                🔵 {repo.language}
                              </span>
                            )}
                            <span className="repo-updated">
                              Updated {formatDate(repo.updated_at)}
                            </span>
                          </div>
                        </div>
                        <div className="repo-actions" style={{
                          marginTop: '0.75rem',
                          textAlign: 'right'
                        }}>
                          <a 
                            href={repo.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="view-repo-link"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              color: '#4a6cfa',
                              textDecoration: 'none',
                              fontSize: '0.9rem',
                              fontWeight: '500'
                            }}
                          >
                            View on GitHub →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {githubConnected && selectedRepo && (
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onClose}
              disabled={connecting}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn-primary"
              onClick={handleConnectRepository}
              disabled={connecting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {connecting ? (
                <>
                  <span>Connecting...</span>
                  <div className="loading-spinner" style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>Connect {selectedRepo.name}</span>
                </>
              )}
            </button>
          </div>
        )}
        
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default GitHubRepoModal;