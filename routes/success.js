const express = require('express');
const router = express.Router();
const { getSuccessStories, getAllSuccessStories, getSuccessById, createSuccess, updateSuccess, deleteSuccess, updateSuccessOrder } = require('../controllers/successController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { validateSuccess } = require('../middleware/validation');

// Public
router.get('/', getSuccessStories);
router.get('/:id', getSuccessById);

// Admin list (before :id)
router.get('/admin/all', authenticateToken, authorize('admin', 'editor'), getAllSuccessStories);

// Authenticated
router.use(authenticateToken);
router.post('/', authorize('admin', 'editor'), upload.single('image'), handleUploadError, validateSuccess, createSuccess);
router.put('/:id', authorize('admin', 'editor'), upload.single('image'), handleUploadError, validateSuccess, updateSuccess);
router.delete('/:id', authorize('admin'), deleteSuccess);
router.patch('/:id/order', authorize('admin', 'editor'), updateSuccessOrder);

module.exports = router;




