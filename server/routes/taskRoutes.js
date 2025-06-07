const express = require('express');
const {
  createTask,
  getProjectTasks,
  getMyTasks,
  getTask,
  updateTask,
  deleteTask,
  connectGithubIssue
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Task routes
router.route('/')
  .post(createTask);

router.route('/my-tasks')
  .get(getMyTasks);

  router.route('/my-tasks')
  .get(getMyTasks);

router.route('/project/:projectId')
  .get(getProjectTasks);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// GitHub issue connection
router.route('/:id/github-issue')
  .post(connectGithubIssue);

module.exports = router;