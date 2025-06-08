const User = require('../models/User');
const GitHubService = require('../services/githubService');
const axios = require('axios');

// @desc    Get GitHub OAuth URL
// @route   GET /api/github/auth-url
// @access  Private
exports.getGithubAuthUrl = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = `http://13.220.160.13/github/callback`; // Frontend route
    const scope = 'repo,user:email';
    const state = req.user.id; // Use user ID as state for security
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    
    console.log('GitHub OAuth URL:', authUrl); // Debug log
    
    res.status(200).json({
      success: true,
      data: {
        authUrl
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// @desc    Exchange GitHub code for access token
// @route   POST /api/github/token
// @access  Private
exports.getGithubToken = async (req, res) => {
  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a GitHub authorization code'
      });
    }

    // Verify state matches current user ID for security
    if (state !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state parameter'
      });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );

    const { access_token, error } = tokenResponse.data;

    if (error || !access_token) {
      return res.status(400).json({
        success: false,
        message: error || 'Failed to get GitHub access token'
      });
    }

    // Get GitHub user profile
    const github = new GitHubService(access_token);
    const githubUser = await github.getUserProfile();

    // Update user with GitHub token and username
    await User.findByIdAndUpdate(
      req.user.id,
      {
        githubUsername: githubUser.login,
        githubToken: access_token
      }
    );

    res.status(200).json({
      success: true,
      data: {
        username: githubUser.login,
        connected: true
      }
    });
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check GitHub connection status
// @route   GET /api/github/status
// @access  Private
exports.getGithubStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+githubToken');
    
    if (!user.githubToken || !user.githubUsername) {
      return res.status(200).json({
        success: true,
        data: {
          connected: false
        }
      });
    }

    // Test if token is still valid
    try {
      const github = new GitHubService(user.githubToken);
      await github.getUserProfile();
      
      res.status(200).json({
        success: true,
        data: {
          connected: true,
          username: user.githubUsername
        }
      });
    } catch (error) {
      // Token might be invalid, clear it
      await User.findByIdAndUpdate(req.user.id, {
        $unset: { githubToken: 1, githubUsername: 1 }
      });
      
      res.status(200).json({
        success: true,
        data: {
          connected: false
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Disconnect GitHub account
// @route   DELETE /api/github/disconnect
// @access  Private
exports.disconnectGithub = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $unset: { githubToken: 1, githubUsername: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'GitHub account disconnected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's GitHub repositories
// @route   GET /api/github/repositories
// @access  Private
exports.getRepositories = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+githubToken');

    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub account not connected'
      });
    }

    const github = new GitHubService(user.githubToken);
    const repositories = await github.getUserRepositories();

    res.status(200).json({
      success: true,
      count: repositories.length,
      data: repositories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get repository details
// @route   GET /api/github/repository/:owner/:repo
// @access  Private
exports.getRepositoryDetails = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const user = await User.findById(req.user.id).select('+githubToken');

    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub account not connected'
      });
    }

    const github = new GitHubService(user.githubToken);
    const repository = await github.getRepositoryDetails(owner, repo);

    res.status(200).json({
      success: true,
      data: repository
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get repository commits
// @route   GET /api/github/repository/:owner/:repo/commits
// @access  Private
exports.getRepositoryCommits = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const user = await User.findById(req.user.id).select('+githubToken');

    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub account not connected'
      });
    }

    const github = new GitHubService(user.githubToken);
    const commits = await github.getRepositoryCommits(owner, repo);

    res.status(200).json({
      success: true,
      count: commits.length,
      data: commits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get repository issues
// @route   GET /api/github/repository/:owner/:repo/issues
// @access  Private
exports.getRepositoryIssues = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const user = await User.findById(req.user.id).select('+githubToken');

    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub account not connected'
      });
    }

    const github = new GitHubService(user.githubToken);
    const issues = await github.getRepositoryIssues(owner, repo);

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create an issue in a repository
// @route   POST /api/github/repository/:owner/:repo/issues
// @access  Private
exports.createIssue = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { title, body, labels } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an issue title'
      });
    }

    const user = await User.findById(req.user.id).select('+githubToken');

    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub account not connected'
      });
    }

    const github = new GitHubService(user.githubToken);
    const issue = await github.createIssue(owner, repo, {
      title,
      body,
      labels
    });

    res.status(201).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update an issue in a repository
// @route   PUT /api/github/repository/:owner/:repo/issues/:issueNumber
// @access  Private
exports.updateIssue = async (req, res) => {
  try {
    const { owner, repo, issueNumber } = req.params;
    const { title, body, state, labels } = req.body;

    const user = await User.findById(req.user.id).select('+githubToken');

    if (!user.githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub account not connected'
      });
    }

    const github = new GitHubService(user.githubToken);
    const issue = await github.updateIssue(owner, repo, issueNumber, {
      title,
      body,
      state,
      labels
    });

    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};