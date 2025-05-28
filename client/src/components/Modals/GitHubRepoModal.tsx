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

  useEffect(() => {
    checkGitHubConnection();
  }, []);

  const checkGitHubConnection = async () => {
    try {
      setLoading(true);
      // Try to fetch repositories to see if GitHub is connected
      const response = await githubService.getRepositories();
      setRepositories(response.data.data);
      setGithubConnected(true);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.message?.includes('GitHub account not connected')) {
        setGithubConnected(false);
        setError('Please connect your GitHub account first.');
      } else {
        setError(err.response?.data?.message || 'Failed to load repositories');
      }
      console.error('Error checking GitHub connection:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGitHub = () => {
    // For now, we'll show instructions. In a full implementation, 
    // this would redirect to GitHub OAuth
    setError('GitHub OAuth setup required. Please contact your administrator.');
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
              <div className="github-icon">🔗</div>
              <h4>Connect Your GitHub Account</h4>
              <p>To link repositories to your projects, you need to first connect your GitHub account.</p>
              <button 
                className="btn-primary"
                onClick={handleConnectGitHub}
                disabled={loading}
              >
                Connect GitHub Account
              </button>
            </div>
          ) : loading ? (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>Loading your repositories...</p>
            </div>
          ) : (
            <>
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="repo-search-input"
                />
              </div>
              
              <div className="repositories-list">
                <div className="repo-count">
                  {filteredRepositories.length} repositories found
                </div>
                
                {filteredRepositories.length === 0 ? (
                  <div className="no-repos">
                    <p>No repositories found matching "{searchTerm}"</p>
                  </div>
                ) : (
                  <div className="repo-items">
                    {filteredRepositories.map((repo) => (
                      <div
                        key={repo.id}
                        className={`repo-item ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                        onClick={() => handleSelectRepo(repo)}
                      >
                        <div className="repo-info">
                          <div className="repo-name">
                            {repo.name}
                            {repo.private && <span className="private-badge">Private</span>}
                          </div>
                          <div className="repo-full-name">{repo.full_name}</div>
                          {repo.description && (
                            <div className="repo-description">{repo.description}</div>
                          )}
                          <div className="repo-meta">
                            {repo.language && (
                              <span className="repo-language">{repo.language}</span>
                            )}
                            <span className="repo-updated">
                              Updated {formatDate(repo.updated_at)}
                            </span>
                          </div>
                        </div>
                        <div className="repo-actions">
                          <a 
                            href={repo.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="view-repo-link"
                            onClick={(e) => e.stopPropagation()}
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
            >
              {connecting ? 'Connecting...' : `Connect ${selectedRepo.name}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubRepoModal;