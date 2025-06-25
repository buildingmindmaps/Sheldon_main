const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  badge: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'Package'
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  // --- NEW FIELD: caseStatement and caseFacts ---
  caseStatement: {
    type: String,
    // Make this required if every module should have a case statement,
    // otherwise, leave it optional.
  },
  caseFacts: [{
    type: String // An array of strings for case facts
  }],

  caseConversation: {
    type: String,
    // Make this required if every module should have a case statement,
    // otherwise, leave it optional.
  },
  // --- END NEW FIELDS ---
}, { timestamps: true });

module.exports = mongoose.model('Module', ModuleSchema);
