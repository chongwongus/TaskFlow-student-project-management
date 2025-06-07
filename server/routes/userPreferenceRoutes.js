const express = require('express');
const {
  createUserPreference,
  getUserPreference,
} = require('../controllers/userPreferenceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Task routes
router.route('/')
  .post(createUserPreference);

router.route('/:userEmail')
  .get(getUserPreference)
  .put(createUserPreference);

module.exports = router;