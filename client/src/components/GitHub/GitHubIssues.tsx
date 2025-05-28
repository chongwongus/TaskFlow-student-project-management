import React, { useState, useEffect } from 'react';
import { githubService, taskService } from '../../services/api';
import './GitHubIssues.scss';

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  assignee?: {
    login: string;
    avatar_url: string;
  };
  user: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubIssuesProps {
  projectId: string;
  repoOwner: string;
  repoName: string;
  onTaskCreated?: () => void;
}

const GitHubIssues: React.FC<GitHubIssuesProps> = ({ 
  projectId, 
  repoOwner, 
  repoName,
  onTaskCreated
}) => {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open');
  const [creatingTask, setCreatingTask] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchIssues();
  }, [repoOwner, repoName]);

  const handleRefresh = () => {
    fetchIssues(true);
  };

  const fetchIssues = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await githubService.getRepositoryIssues(repoOwner, repoName);
      setIssues(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch GitHub issues');
      console.error('Error fetching GitHub issues:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateTaskFromIssue = async (issue: GitHubIssue) => {
    try {
      setCreatingTask(issue.number);
      setError(null);
      setSuccessMessage(null);

      // Create task with GitHub issue information
      const taskData = {
        title: issue.title,
        description: issue.body || `GitHub Issue #${issue.number}\n\n${issue.html_url}`,
        status: 'to-do' as const,
        priority: 'medium' as const,
        project: projectId
      };

      const taskResponse = await taskService.createTask(taskData);
      const newTask = taskResponse.data.data;

      // Link the task to the GitHub issue
      await githubService.connectGithubIssue(newTask._id, {
        id: issue.id,
        number: issue.number,
        url: issue.html_url
      });

      // Show success message
      setSuccessMessage(`✅ Task created from GitHub issue #${issue.number}: "${issue.title}"`);
      
      // Call the callback to refresh parent component
      if (onTaskCreated) {
        onTaskCreated();
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task from issue');
      console.error('Error creating task from issue:', err);
    } finally {
      setCreatingTask(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    return issue.state === filter;
  });

  const getIssueStateColor = (state: string) => {
    return state === 'open' ? '#28a745' : '#6f42c1';
  };

  const getIssueStateIcon = (state: string) => {
    return state === 'open' ? '🟢' : '🟣';
  };

  if (loading) {
    return (
      <div className="github-issues">
        <div className="loading">Loading GitHub issues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="github-issues">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => fetchIssues()} className="btn-secondary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="github-issues">
      <div className="issues-header">
        <h4>GitHub Issues ({filteredIssues.length})</h4>
        <div className="header-actions">
          <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh GitHub issues"
          >
            {refreshing ? (
              <div className="loading-spinner small" />
            ) : (
              '🔄'
            )}
          </button>
          <div className="issues-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({issues.length})
            </button>
            <button
              className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
              onClick={() => setFilter('open')}
            >
              🟢 Open ({issues.filter(i => i.state === 'open').length})
            </button>
            <button
              className={`filter-btn ${filter === 'closed' ? 'active' : ''}`}
              onClick={() => setFilter('closed')}
            >
              🟣 Closed ({issues.filter(i => i.state === 'closed').length})
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {filteredIssues.length === 0 ? (
        <div className="no-issues">
          <p>No {filter === 'all' ? '' : filter} issues found in this repository.</p>
          <a 
            href={`https://github.com/${repoOwner}/${repoName}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Create New Issue on GitHub
          </a>
        </div>
      ) : (
        <div className="issues-list">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <div className="issue-header">
                <div className="issue-title-section">
                  <span 
                    className="issue-state"
                    style={{ color: getIssueStateColor(issue.state) }}
                  >
                    {getIssueStateIcon(issue.state)}
                  </span>
                  <h5 className="issue-title">
                    <a 
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="issue-link"
                    >
                      {issue.title}
                    </a>
                  </h5>
                  <span className="issue-number">#{issue.number}</span>
                </div>
                <div className="issue-actions">
                  <button
                    className="btn-primary create-task-btn"
                    onClick={() => handleCreateTaskFromIssue(issue)}
                    disabled={creatingTask === issue.number}
                    title="Create TaskFlow task from this issue"
                  >
                    {creatingTask === issue.number ? (
                      <>
                        <span>Creating...</span>
                        <div className="loading-spinner" />
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        <span>Create Task</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {issue.body && (
                <div className="issue-body">
                  <p>{issue.body.length > 200 ? `${issue.body.substring(0, 200)}...` : issue.body}</p>
                </div>
              )}

              <div className="issue-meta">
                <div className="issue-info">
                  <span className="issue-author">
                    <img 
                      src={issue.user.avatar_url} 
                      alt={issue.user.login}
                      className="author-avatar"
                    />
                    {issue.user.login}
                  </span>
                  <span className="issue-date">
                    opened {formatDate(issue.created_at)}
                  </span>
                  {issue.updated_at !== issue.created_at && (
                    <span className="issue-updated">
                      updated {formatDate(issue.updated_at)}
                    </span>
                  )}
                </div>

                {issue.labels.length > 0 && (
                  <div className="issue-labels">
                    {issue.labels.map((label) => (
                      <span
                        key={label.name}
                        className="issue-label"
                        style={{ 
                          backgroundColor: `#${label.color}`,
                          color: parseInt(label.color, 16) > 0xffffff / 2 ? '#000' : '#fff'
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}

                {issue.assignee && (
                  <div className="issue-assignee">
                    <span>Assigned to:</span>
                    <img 
                      src={issue.assignee.avatar_url} 
                      alt={issue.assignee.login}
                      className="assignee-avatar"
                    />
                    <span>{issue.assignee.login}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GitHubIssues;