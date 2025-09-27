const ContactMessage = require('../models/ContactMessage');
const { validationResult } = require('express-validator');

// Public: submit contact message
const submitMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
    const created = await ContactMessage.create({ name: req.body.name, email: req.body.email, message: req.body.message });
    res.status(201).json({ success: true, message: 'Message received', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while submitting message' });
  }
};

// Admin: list messages with pagination and optional status filter
const getAllMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await ContactMessage.countDocuments(query);
    res.status(200).json({ success: true, count: messages.length, total, currentPage: parseInt(page), totalPages: Math.ceil(total / limit), data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching messages' });
  }
};

const getMessageById = async (req, res) => {
  try {
    const found = await ContactMessage.findById(req.params.id);
    if (!found) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, data: found });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching message' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, message: 'Status updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while updating status' });
  }
};

const removeMessage = async (req, res) => {
  try {
    const existing = await ContactMessage.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Message not found' });
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while deleting message' });
  }
};

module.exports = { submitMessage, getAllMessages, getMessageById, updateStatus, removeMessage };




