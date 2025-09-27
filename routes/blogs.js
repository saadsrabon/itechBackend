const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogOrder
} = require('../controllers/blogController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { validateBlog } = require('../middleware/validation');

// Public
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin list (must precede :id)
router.get('/admin/all', authenticateToken, authorize('admin', 'editor'), getAllBlogs);

// Authenticated routes
router.use(authenticateToken);

router.post('/', authorize('admin', 'editor'), upload.single('image'), handleUploadError, validateBlog, createBlog);
router.put('/:id', authorize('admin', 'editor'), upload.single('image'), handleUploadError, validateBlog, updateBlog);
router.delete('/:id', authorize('admin'), deleteBlog);
router.patch('/:id/order', authorize('admin', 'editor'), updateBlogOrder);

module.exports = router;


