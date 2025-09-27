const express = require('express');
const router = express.Router();

// Import section routes
const heroRoutes = require('./hero');
const servicesRoutes = require('./services');
const teamMembersRoutes = require('./teamMembers');
const blogsRoutes = require('./blogs');
const contactsRoutes = require('./contacts');
const successRoutes = require('./success');
const aboutRoutes = require('./about');

// Mount section routes
router.use('/hero', heroRoutes);
router.use('/services', servicesRoutes);
router.use('/team-members', teamMembersRoutes);
router.use('/blogs', blogsRoutes);
router.use('/contacts', contactsRoutes);
router.use('/success', successRoutes);
router.use('/about', aboutRoutes);

// Add more section routes here as you create them
// router.use('/about', aboutRoutes);
// router.use('/contact', contactRoutes);

module.exports = router;
