const About = require('../models/About');
const { validationResult } = require('express-validator');

const getAbout = async (req, res) => {
  try {
    const items = await About.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    // Transform items to include full image URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const transformedItems = items.map(item => {
      const transformedItem = item.toObject();
      if (transformedItem.image) {
        transformedItem.image = transformedItem.image.startsWith('http') 
          ? transformedItem.image 
          : `${baseUrl}${transformedItem.image}`;
      }
      return transformedItem;
    });
    
    res.status(200).json({ success: true, count: items.length, data: transformedItems });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching about items' });
  }
};

const getAllAbout = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const items = await About.find({}).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await About.countDocuments({});
    res.status(200).json({ success: true, count: items.length, total, currentPage: parseInt(page), totalPages: Math.ceil(total / limit), data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching about items' });
  }
};

const getAboutById = async (req, res) => {
  try {
    const item = await About.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'About item not found' });
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching about item' });
  }
};

const createAbout = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
    const imagePath = req.file ? `/uploads/about/${req.file.filename}` : req.body.image;
    const created = await About.create({ ...req.body, image: imagePath });
    res.status(201).json({ success: true, message: 'About item created', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while creating about item' });
  }
};

const updateAbout = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
    const existing = await About.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'About item not found' });
    const imagePath = req.file ? `/uploads/about/${req.file.filename}` : existing.image;
    const updated = await About.findByIdAndUpdate(req.params.id, { ...req.body, image: imagePath }, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'About item updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while updating about item' });
  }
};

const deleteAbout = async (req, res) => {
  try {
    const existing = await About.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'About item not found' });
    await About.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'About item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while deleting about item' });
  }
};

const updateAboutOrder = async (req, res) => {
  try {
    const { order } = req.body;
    if (!order || order < 1) return res.status(400).json({ success: false, message: 'Valid order number is required' });
    const updated = await About.findByIdAndUpdate(req.params.id, { order }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'About item not found' });
    res.status(200).json({ success: true, message: 'About order updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while updating about order' });
  }
};

module.exports = { getAbout, getAllAbout, getAboutById, createAbout, updateAbout, deleteAbout, updateAboutOrder };




