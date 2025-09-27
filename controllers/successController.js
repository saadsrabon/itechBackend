const SuccessStory = require('../models/SuccessStory');
const { validationResult } = require('express-validator');

const getSuccessStories = async (req, res) => {
  try {
    const items = await SuccessStory.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
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
    res.status(500).json({ success: false, message: 'Server error while fetching success stories' });
  }
};

const getAllSuccessStories = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const items = await SuccessStory.find({}).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await SuccessStory.countDocuments({});
    res.status(200).json({ success: true, count: items.length, total, currentPage: parseInt(page), totalPages: Math.ceil(total / limit), data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching success stories' });
  }
};

const getSuccessById = async (req, res) => {
  try {
    const item = await SuccessStory.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Success story not found' });
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching success story' });
  }
};

const createSuccess = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
    const imagePath = req.file ? `/uploads/success/${req.file.filename}` : req.body.image;
    const created = await SuccessStory.create({ ...req.body, image: imagePath });
    res.status(201).json({ success: true, message: 'Success story created', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while creating success story' });
  }
};

const updateSuccess = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
    const existing = await SuccessStory.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Success story not found' });
    const imagePath = req.file ? `/uploads/success/${req.file.filename}` : existing.image;
    const updated = await SuccessStory.findByIdAndUpdate(req.params.id, { ...req.body, image: imagePath }, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Success story updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while updating success story' });
  }
};

const deleteSuccess = async (req, res) => {
  try {
    const existing = await SuccessStory.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Success story not found' });
    await SuccessStory.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Success story deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while deleting success story' });
  }
};

const updateSuccessOrder = async (req, res) => {
  try {
    const { order } = req.body;
    if (!order || order < 1) return res.status(400).json({ success: false, message: 'Valid order number is required' });
    const updated = await SuccessStory.findByIdAndUpdate(req.params.id, { order }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Success story not found' });
    res.status(200).json({ success: true, message: 'Success story order updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while updating success story order' });
  }
};

module.exports = { getSuccessStories, getAllSuccessStories, getSuccessById, createSuccess, updateSuccess, deleteSuccess, updateSuccessOrder };




