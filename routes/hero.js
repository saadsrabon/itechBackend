const express = require('express');
const router = express.Router();
const {
  getHero,
  getAllHeroes,
  createHero,
  updateHero,
  deleteHero,
  activateHero
} = require('../controllers/heroController');
const { validateHero } = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getHero);

// Protected routes (require authentication)
router.use(authenticateToken);

// Admin routes
router.get('/all', authorize('admin', 'editor'), getAllHeroes);
router.post('/', authorize('admin', 'editor'), validateHero, createHero);
router.put('/:id', authorize('admin', 'editor'), validateHero, updateHero);
router.delete('/:id', authorize('admin'), deleteHero);
router.patch('/:id/activate', authorize('admin', 'editor'), activateHero);

module.exports = router;
