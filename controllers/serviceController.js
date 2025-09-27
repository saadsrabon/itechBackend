const Service = require('../models/Service');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// @desc    Get all active services grouped by section
// @route   GET /api/sections/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ section: 1, order: 1 });

    // Transform services to include full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedServices = services.map(service => {
      const transformedService = service.toObject();
      if (transformedService.images && transformedService.images.length > 0) {
        transformedService.images = transformedService.images.map(img => ({
          ...img,
          image: img.image.startsWith('http') ? img.image : `${baseUrl}${img.image}`
        }));
      }
      return transformedService;
    });

    // Group services by section
    const groupedServices = transformedServices.reduce((acc, service) => {
      if (!acc[service.section]) {
        acc[service.section] = [];
      }
      acc[service.section].push(service);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: services.length,
      data: groupedServices
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services'
    });
  }
};

// @desc    Get all services (for admin)
// @route   GET /api/sections/services/all
// @access  Private
const getAllServices = async (req, res) => {
  try {
    const { section, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (section) {
      query.section = section;
    }

    const services = await Service.find(query)
      .sort({ section: 1, order: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Service.countDocuments(query);

    // Transform services to include full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedServices = services.map(service => {
      const transformedService = service.toObject();
      if (transformedService.images && transformedService.images.length > 0) {
        transformedService.images = transformedService.images.map(img => ({
          ...img,
          image: img.image.startsWith('http') ? img.image : `${baseUrl}${img.image}`
        }));
      }
      return transformedService;
    });

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: transformedServices
    });
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services'
    });
  }
};

// @desc    Get service by ID
// @route   GET /api/sections/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Transform service to include full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedService = service.toObject();
    console.log(transformedService);
    if (transformedService.images && transformedService.images.length > 0) {
      transformedService.images = transformedService.images.map(img => ({
        ...img,
        image: img.image.startsWith('http') ? img.image : `${baseUrl}${img.image}`
      }));
    }

    res.status(200).json({
      success: true,
      data: transformedService
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching service'
    });
  }
};

// @desc    Create new service
// @route   POST /api/sections/services
// @access  Private
const createService = async (req, res) => {
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

    // Handle uploaded images
    const imageData = [];
    console.log('req.files:', req.files);
    console.log('req.files length:', req.files ? req.files.length : 'undefined');
    
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        console.log(`Processing file ${index}:`, file);
        imageData.push({
          image: `/uploads/services/${file.filename}`,
          alt: req.body.imageAlts && req.body.imageAlts[index] ? req.body.imageAlts[index] : '',
          order: index + 1
        });
      });
    }
    
    console.log('imageData:', imageData);

    const serviceData = {
      ...req.body,
      images: imageData
    };

    const service = await Service.create(serviceData);

    // Transform service to include full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedService = service.toObject();
    if (transformedService.images && transformedService.images.length > 0) {
      transformedService.images = transformedService.images.map(img => ({
        ...img,
        image: img.image.startsWith('http') ? img.image : `${baseUrl}${img.image}`
      }));
    }

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: transformedService
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating service'
    });
  }
};

// @desc    Update service
// @route   PUT /api/sections/services/:id
// @access  Private
const updateService = async (req, res) => {
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

    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Handle new uploaded images
    let imageData = [...service.images];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        imageData.push({
          image: `/uploads/services/${file.filename}`,
          alt: req.body.imageAlts && req.body.imageAlts[index] ? req.body.imageAlts[index] : '',
          order: imageData.length + 1
        });
      });
    }

    // Update existing images if provided
    if (req.body.existingImages) {
      try {
        const existingImages = JSON.parse(req.body.existingImages);
        imageData = existingImages;
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid existingImages format'
        });
      }
    }

    const updateData = {
      ...req.body,
      images: imageData
    };

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Transform service to include full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedService = updatedService.toObject();
    if (transformedService.images && transformedService.images.length > 0) {
      transformedService.images = transformedService.images.map(img => ({
        ...img,
        image: img.image.startsWith('http') ? img.image : `${baseUrl}${img.image}`
      }));
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: transformedService
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating service'
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/sections/services/:id
// @access  Private
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Delete associated image files
    service.images.forEach(imageData => {
      const imagePath = path.join(__dirname, '..', 'uploads', 'services', path.basename(imageData.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting service'
    });
  }
};

// @desc    Delete service image
// @route   DELETE /api/sections/services/:id/images/:imageIndex
// @access  Private
const deleteServiceImage = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const imageIndex = parseInt(req.params.imageIndex);
    if (imageIndex < 0 || imageIndex >= service.images.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image index'
      });
    }

    // Delete the image file
    const imageToDelete = service.images[imageIndex];
    const imagePath = path.join(__dirname, '..', 'uploads', 'services', path.basename(imageToDelete.image));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove image from array
    service.images.splice(imageIndex, 1);
    await service.save();

    // Transform service to include full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedService = service.toObject();
    if (transformedService.images && transformedService.images.length > 0) {
      transformedService.images = transformedService.images.map(img => ({
        ...img,
        image: img.image.startsWith('http') ? img.image : `${baseUrl}${img.image}`
      }));
    }

    res.status(200).json({
      success: true,
      message: 'Service image deleted successfully',
      data: transformedService
    });
  } catch (error) {
    console.error('Error deleting service image:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting service image'
    });
  }
};

// @desc    Get services by section
// @route   GET /api/sections/services/section/:section
// @access  Public
const getServicesBySection = async (req, res) => {
  try {
    const services = await Service.find({ 
      section: req.params.section, 
      isActive: true 
    }).sort({ order: 1 });

    // Transform services to include full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedServices = services.map(service => {
      const transformedService = service.toObject();
      if (transformedService.images && transformedService.images.length > 0) {
        transformedService.images = transformedService.images.map(img => ({
          ...img,
          image: img.image.startsWith('http') ? img.image : `${baseUrl}${img.image}`
        }));
      }
      return transformedService;
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: transformedServices
    });
  } catch (error) {
    console.error('Error fetching services by section:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services by section'
    });
  }
};

// @desc    Update service order
// @route   PATCH /api/sections/services/:id/order
// @access  Private
const updateServiceOrder = async (req, res) => {
  try {
    const { order } = req.body;
    
    if (!order || order < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid order number is required'
      });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Transform service to include full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedService = service.toObject();
    if (transformedService.images && transformedService.images.length > 0) {
      transformedService.images = transformedService.images.map(img => ({
        ...img,
        image: img.image.startsWith('http') ? img.image : `${baseUrl}${img.image}`
      }));
    }

    res.status(200).json({
      success: true,
      message: 'Service order updated successfully',
      data: transformedService
    });
  } catch (error) {
    console.error('Error updating service order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating service order'
    });
  }
};

module.exports = {
  getServices,
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  deleteServiceImage,
  getServicesBySection,
  updateServiceOrder
};
