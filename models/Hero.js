const mongoose = require('mongoose');

const HeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  primaryButton: {
    text: {
      type: String,
      required: [true, 'Primary button text is required'],
      trim: true,
      maxlength: [50, 'Button text cannot exceed 50 characters']
    },
    link: {
      type: String,
      required: [true, 'Primary button link is required'],
      trim: true
    },
    target: {
      type: String,
      enum: ['_blank', '_self'],
      default: '_blank'
    }
  },
  secondaryButton: {
    text: {
      type: String,
      required: [true, 'Secondary button text is required'],
      trim: true,
      maxlength: [50, 'Button text cannot exceed 50 characters']
    },
    link: {
      type: String,
      required: [true, 'Secondary button link is required'],
      trim: true
    },
    target: {
      type: String,
      enum: ['_blank', '_self'],
      default: '_self'
    }
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
      },
      message: 'Please provide a valid YouTube URL'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Ensure only one active hero section
HeroSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

module.exports = mongoose.model('Hero', HeroSchema);
