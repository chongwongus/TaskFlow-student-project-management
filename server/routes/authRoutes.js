const express = require('express');
const { 
  register, 
  login, 
  googleLogin, 
  getMe, 
  logout 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;