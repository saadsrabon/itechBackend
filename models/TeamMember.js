const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    enum: [
      'Core Team',
      'Design',
      'Digital Marketing',
      'Video Editing',
      'Web Development',
      'Support',
      'SEO'
    ]
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true,
    maxlength: [200, 'Designation cannot exceed 200 characters']
  },
  content: {
    type: String,
    trim: true,
    maxlength: [1000, 'Content cannot exceed 1000 characters'],
    default: ''
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
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

// Index for better query performance
TeamMemberSchema.index({ section: 1, order: 1 });
TeamMemberSchema.index({ isActive: 1 });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);

