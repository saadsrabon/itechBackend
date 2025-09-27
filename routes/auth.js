const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword
} = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', validateLogin, login);

// Protected routes (require authentication)
router.use(authenticateToken); // Apply authentication middleware to all routes below

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/profile', validateUpdateProfile, updateProfile);
router.put('/change-password', validateChangePassword, changePassword);

// Admin only routes
router.post('/register', authorize('admin'), validateRegister, register);

module.exports = router;
