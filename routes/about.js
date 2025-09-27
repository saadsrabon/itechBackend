const express = require('express');
const router = express.Router();
const { getAbout, getAllAbout, getAboutById, createAbout, updateAbout, deleteAbout, updateAboutOrder } = require('../controllers/aboutController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { validateAbout } = require('../middleware/validation');

// Public
router.get('/', getAbout);
router.get('/:id', getAboutById);

// Admin list (before :id)
router.get('/admin/all', authenticateToken, authorize('admin', 'editor'), getAllAbout);

// Authenticated
router.use(authenticateToken);
router.post('/', authorize('admin', 'editor'), upload.single('image'), handleUploadError, validateAbout, createAbout);
router.put('/:id', authorize('admin', 'editor'), upload.single('image'), handleUploadError, validateAbout, updateAbout);
router.delete('/:id', authorize('admin'), deleteAbout);
router.patch('/:id/order', authorize('admin', 'editor'), updateAboutOrder);

module.exports = router;




