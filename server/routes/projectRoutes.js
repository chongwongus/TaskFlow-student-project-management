const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  updateMemberRole,
  connectGithubRepo
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Project routes
router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

// Project member routes
router.route('/:id/members')
  .post(addProjectMember);

router.route('/:id/members/:userId')
  .put(updateMemberRole)
  .delete(removeProjectMember);

// GitHub repository connection
router.route('/:id/github')
  .post(connectGithubRepo);

module.exports = router;