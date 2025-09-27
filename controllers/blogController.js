const Blog = require('../models/Blog');
const { validationResult } = require('express-validator');

// Public: list active blogs ordered
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching blogs' });
  }
};

// Admin list with pagination
const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Blog.countDocuments({});
    res.status(200).json({ success: true, count: blogs.length, total, currentPage: parseInt(page), totalPages: Math.ceil(total / limit), data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching all blogs' });
  }
};

const getBlogById = async (req, res) => {
  try {
    const found = await Blog.findById(req.params.id);
    if (!found) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, data: found });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching blog' });
  }
};

const createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });

    const imagePath = req.file ? `/uploads/blogs/${req.file.filename}` : req.body.image;
    const created = await Blog.create({ ...req.body, image: imagePath });
    res.status(201).json({ success: true, message: 'Blog created successfully', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while creating blog' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });

    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Blog not found' });

    let imagePath = existing.image;
    if (req.file) imagePath = `/uploads/blogs/${req.file.filename}`;

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imagePath },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, message: 'Blog updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while updating blog' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Blog not found' });
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while deleting blog' });
  }
};

const updateBlogOrder = async (req, res) => {
  try {
    const { order } = req.body;
    if (!order || order < 1) return res.status(400).json({ success: false, message: 'Valid order number is required' });
    const updated = await Blog.findByIdAndUpdate(req.params.id, { order }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, message: 'Blog order updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while updating blog order' });
  }
};

module.exports = {
  getBlogs,
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogOrder
};




