const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  badge: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'Package'
  },
  features: [{
    type: String
  }],
  reviews: [{
    name: String,
    avatar: String,
    rating: Number,
    text: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
