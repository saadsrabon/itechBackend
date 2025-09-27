const express = require('express');
const router = express.Router();
const {
  getServices,
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  deleteServiceImage,
  getServicesBySection,
  updateServiceOrder
} = require('../controllers/serviceController');
const { validateService } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');
const { authenticateToken, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getServices);
router.get('/section/:section', getServicesBySection);

// Admin listing must be defined before dynamic :id to avoid route conflicts
router.get('/admin/all', authenticateToken, authorize('admin', 'editor'), getAllServices);

// Public route by id
router.get('/:id', getServiceById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Create service with image upload
router.post('/', 
  authorize('admin', 'editor'),
  upload.array('images', 10), // Allow up to 10 images
  handleUploadError,
  validateService,
  createService
);

// Update service with image upload
router.put('/:id',
  authorize('admin', 'editor'),
  upload.array('images', 10),
  handleUploadError,
  validateService,
  updateService
);

// Delete service
router.delete('/:id', authorize('admin'), deleteService);

// Delete specific image from service
router.delete('/:id/images/:imageIndex', authorize('admin', 'editor'), deleteServiceImage);

// Update service order
router.patch('/:id/order', authorize('admin', 'editor'), updateServiceOrder);

module.exports = router;
