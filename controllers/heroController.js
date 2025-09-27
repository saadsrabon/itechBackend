const Hero = require('../models/Hero');
const { validationResult } = require('express-validator');

// @desc    Get active hero section
// @route   GET /api/sections/hero
// @access  Public
const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne({ isActive: true });
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'No active hero section found'
      });
    }

    res.status(200).json({
      success: true,
      data: hero
    });
  } catch (error) {
    console.error('Error fetching hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hero section'
    });
  }
};

// @desc    Get all hero sections (for admin)
// @route   GET /api/sections/hero/all
// @access  Private
const getAllHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    console.error('Error fetching all hero sections:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hero sections'
    });
  }
};

// @desc    Create new hero section
// @route   POST /api/sections/hero
// @access  Private
const createHero = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // If setting as active, deactivate all other hero sections
    if (req.body.isActive !== false) {
      await Hero.updateMany({}, { isActive: false });
    }

    const hero = await Hero.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hero section created successfully',
      data: hero
    });
  } catch (error) {
    console.error('Error creating hero section:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Only one hero section can be active at a time'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating hero section'
    });
  }
};

// @desc    Update hero section
// @route   PUT /api/sections/hero/:id
// @access  Private
const updateHero = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found'
      });
    }

    // If setting as active, deactivate all other hero sections
    if (req.body.isActive === true) {
      await Hero.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    const updatedHero = await Hero.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully',
      data: updatedHero
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Only one hero section can be active at a time'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating hero section'
    });
  }
};

// @desc    Delete hero section
// @route   DELETE /api/sections/hero/:id
// @access  Private
const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found'
      });
    }

    await Hero.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Hero section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting hero section'
    });
  }
};

// @desc    Set hero section as active
// @route   PATCH /api/sections/hero/:id/activate
// @access  Private
const activateHero = async (req, res) => {
  try {
    // First, deactivate all hero sections
    await Hero.updateMany({}, { isActive: false });
    
    // Then activate the selected one
    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true, runValidators: true }
    );

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hero section activated successfully',
      data: hero
    });
  } catch (error) {
    console.error('Error activating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating hero section'
    });
  }
};

module.exports = {
  getHero,
  getAllHeroes,
  createHero,
  updateHero,
  deleteHero,
  activateHero
};
