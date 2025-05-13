const axios = require('axios');

/**
 * Service to handle GitHub API interactions
 */
class GitHubService {
  constructor(token) {
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
  }

  /**
   * Get the authenticated user's profile
   */
  async getUserProfile() {
    try {
      const response = await this.api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Error getting GitHub user profile:', error.response?.data || error.message);
      throw new Error('Failed to get GitHub user profile');
    }
  }

  /**
   * Get the authenticated user's repositories
   */
  async getUserRepositories() {
    try {
      const response = await this.api.get('/user/repos', {
        params: {
          sort: 'updated',
          per_page: 100
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting user repositories:', error.response?.data || error.message);
      throw new Error('Failed to get user repositories');
    }
  }

  /**
   * Get details for a specific repository
   */
  async getRepositoryDetails(owner, repo) {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      console.error('Error getting repository details:', error.response?.data || error.message);
      throw new Error('Failed to get repository details');
    }
  }

  /**
   * Get commits for a repository
   */
  async getRepositoryCommits(owner, repo) {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/commits`, {
        params: {
          per_page: 30
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting repository commits:', error.response?.data || error.message);
      throw new Error('Failed to get repository commits');
    }
  }

  /**
   * Get issues for a repository
   */
  async getRepositoryIssues(owner, repo) {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/issues`, {
        params: {
          state: 'all',
          per_page: 100
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting repository issues:', error.response?.data || error.message);
      throw new Error('Failed to get repository issues');
    }
  }

  /**
   * Create an issue in a repository
   */
  async createIssue(owner, repo, issueData) {
    try {
      const response = await this.api.post(`/repos/${owner}/${repo}/issues`, issueData);
      return response.data;
    } catch (error) {
      console.error('Error creating issue:', error.response?.data || error.message);
      throw new Error('Failed to create issue');
    }
  }

  /**
   * Update an issue in a repository
   */
  async updateIssue(owner, repo, issueNumber, issueData) {
    try {
      const response = await this.api.patch(`/repos/${owner}/${repo}/issues/${issueNumber}`, issueData);
      return response.data;
    } catch (error) {
      console.error('Error updating issue:', error.response?.data || error.message);
      throw new Error('Failed to update issue');
    }
  }
}

module.exports = GitHubService;