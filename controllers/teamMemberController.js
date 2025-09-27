const TeamMember = require('../models/TeamMember');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// @desc    Get all active team members grouped by section
// @route   GET /api/sections/team-members
// @access  Public
const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true })
      .sort({ section: 1, order: 1 });

    // Transform team members to include full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedTeamMembers = teamMembers.map(member => {
      const transformedMember = member.toObject();
      if (transformedMember.image) {
        transformedMember.image = transformedMember.image.startsWith('http') 
          ? transformedMember.image 
          : `${baseUrl}${transformedMember.image}`;
      }
      return transformedMember;
    });

    // Group team members by section
    const groupedTeamMembers = transformedTeamMembers.reduce((acc, member) => {
      if (!acc[member.section]) {
        acc[member.section] = [];
      }
      acc[member.section].push(member);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: groupedTeamMembers
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team members'
    });
  }
};

// @desc    Get all team members (for admin)
// @route   GET /api/sections/team-members/all
// @access  Private
const getAllTeamMembers = async (req, res) => {
  try {
    const { section, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (section) {
      query.section = section;
    }

    const teamMembers = await TeamMember.find(query)
      .sort({ section: 1, order: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await TeamMember.countDocuments(query);

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: teamMembers
    });
  } catch (error) {
    console.error('Error fetching all team members:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team members'
    });
  }
};

// @desc    Get team member by ID
// @route   GET /api/sections/team-members/:id
// @access  Public
const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team member'
    });
  }
};

// @desc    Create new team member
// @route   POST /api/sections/team-members
// @access  Private
const createTeamMember = async (req, res) => {
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

    // Handle uploaded image
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/team-members/${req.file.filename}`;
    }

    const teamMemberData = {
      ...req.body,
      image: imagePath || req.body.image
    };

    const teamMember = await TeamMember.create(teamMemberData);

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: teamMember
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating team member'
    });
  }
};

// @desc    Update team member
// @route   PUT /api/sections/team-members/:id
// @access  Private
const updateTeamMember = async (req, res) => {
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

    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Handle new uploaded image
    let imagePath = teamMember.image;
    if (req.file) {
      // Delete old image if it exists
      if (teamMember.image && teamMember.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', teamMember.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/team-members/${req.file.filename}`;
    }

    const updateData = {
      ...req.body,
      image: imagePath
    };

    const updatedTeamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedTeamMember
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating team member'
    });
  }
};

// @desc    Delete team member
// @route   DELETE /api/sections/team-members/:id
// @access  Private
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Delete associated image file
    if (teamMember.image && teamMember.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', teamMember.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await TeamMember.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting team member'
    });
  }
};

// @desc    Get team members by section
// @route   GET /api/sections/team-members/section/:section
// @access  Public
const getTeamMembersBySection = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ 
      section: req.params.section, 
      isActive: true 
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    console.error('Error fetching team members by section:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team members by section'
    });
  }
};

// @desc    Update team member order
// @route   PATCH /api/sections/team-members/:id/order
// @access  Private
const updateTeamMemberOrder = async (req, res) => {
  try {
    const { order } = req.body;
    
    if (!order || order < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid order number is required'
      });
    }

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team member order updated successfully',
      data: teamMember
    });
  } catch (error) {
    console.error('Error updating team member order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating team member order'
    });
  }
};

module.exports = {
  getTeamMembers,
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMembersBySection,
  updateTeamMemberOrder
};
