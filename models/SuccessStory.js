const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
  designation: { type: String, required: [true, 'Designation is required'], trim: true, maxlength: 200 },
  description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 2000 },
  image: { type: String, required: [true, 'Image URL is required'], trim: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 1 }
}, { timestamps: true });

SuccessStorySchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);




