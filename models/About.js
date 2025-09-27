const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
  content: { type: String, required: [true, 'Content is required'], trim: true },
  image: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 1 }
}, { timestamps: true });

AboutSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('About', AboutSchema);




