const express = require('express');
const router = express.Router();
const {
  getTeamMembers,
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMembersBySection,
  updateTeamMemberOrder
} = require('../controllers/teamMemberController');
const { validateTeamMember } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');
const { authenticateToken, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getTeamMembers);
router.get('/section/:section', getTeamMembersBySection);

// Admin listing must be defined before dynamic :id to avoid route conflicts
router.get('/admin/all', authenticateToken, authorize('admin', 'editor'), getAllTeamMembers);

// Public route by id
router.get('/:id', getTeamMemberById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Create team member with image upload
router.post('/', 
  authorize('admin', 'editor'),
  upload.single('image'), // Single image upload
  handleUploadError,
  validateTeamMember,
  createTeamMember
);

// Update team member with image upload
router.put('/:id',
  authorize('admin', 'editor'),
  upload.single('image'),
  handleUploadError,
  validateTeamMember,
  updateTeamMember
);

// Delete team member
router.delete('/:id', authorize('admin'), deleteTeamMember);

// Update team member order
router.patch('/:id/order', authorize('admin', 'editor'), updateTeamMemberOrder);

module.exports = router;
