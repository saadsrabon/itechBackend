const mongoose = require('mongoose');

const ServiceImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  alt: {
    type: String,
    trim: true,
    default: ''
  },
  order: {
    type: Number,
    default: 1
  }
}, { _id: false });

const ServiceSchema = new mongoose.Schema({
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    enum: [
      'Design',
      'Web Development', 
      'Video Editing',
      'Search Engine Marketing',
      'Social Media Marketing',
      'Business Consultation',
      'Virtual Assistant',
      'Cyber Security'
    ]
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [1000, 'Content cannot exceed 1000 characters']
  },
  images: {
    type: [ServiceImageSchema],
    default: [],
    validate: {
      validator: function(images) {
        return images.length <= 10; // Maximum 10 images per service
      },
      message: 'Maximum 10 images allowed per service'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 1
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Create slug from title before saving
ServiceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Index for better query performance
ServiceSchema.index({ section: 1, order: 1 });
ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Service', ServiceSchema);