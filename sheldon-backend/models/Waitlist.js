// filepath: /Users/harshita_shar25/Documents/CODES/games/Sheldon_Main/case-sheldonai-462f5ce0 2/sheldon-backend/models/Waitlist.js

const mongoose = require('mongoose');

const WaitlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  education: {
    type: String,
    default: 'Not specified'
  },
  source: {
    type: String,
    enum: ['waitlist_form', 'newsletter'],
    default: 'waitlist_form'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Waitlist', WaitlistSchema);
