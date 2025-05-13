const express = require('express');
const {
  getGithubToken,
  getRepositories,
  getRepositoryDetails,
  getRepositoryCommits,
  getRepositoryIssues,
  createIssue,
  updateIssue
} = require('../controllers/githubController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get GitHub access token
router.post('/token', getGithubToken);

// Get user repositories
router.get('/repositories', getRepositories);

// Repository details
router.get('/repository/:owner/:repo', getRepositoryDetails);

// Repository commits
router.get('/repository/:owner/:repo/commits', getRepositoryCommits);

// Repository issues
router.get('/repository/:owner/:repo/issues', getRepositoryIssues);

// Create issue
router.post('/repository/:owner/:repo/issues', createIssue);

// Update issue
router.put('/repository/:owner/:repo/issues/:issueNumber', updateIssue);

module.exports = router;