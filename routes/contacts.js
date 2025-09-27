const express = require('express');
const router = express.Router();
const { submitMessage, getAllMessages, getMessageById, updateStatus, removeMessage } = require('../controllers/contactController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

// Public submit
router.post('/', validateContact, submitMessage);

// Admin
router.get('/admin/all', authenticateToken, authorize('admin', 'editor'), getAllMessages);
router.get('/:id', authenticateToken, authorize('admin', 'editor'), getMessageById);
router.patch('/:id/status', authenticateToken, authorize('admin', 'editor'), updateStatus);
router.delete('/:id', authenticateToken, authorize('admin'), removeMessage);

module.exports = router;




