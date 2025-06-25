// filepath: /Users/harshita_shar25/Documents/CODES/games/Sheldon_Main/case-sheldonai-462f5ce0 2/sheldon-backend/routes/waitlist.js

const express = require('express');
const router = express.Router();
const Waitlist = require('../models/Waitlist');

// POST: Add new entry to waitlist
router.post('/', async (req, res) => {
  try {
    const { name, email, education, source } = req.body;

    // Check if email already exists
    const existingEntry = await Waitlist.findOne({ email });
    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: 'This email is already on our waitlist'
      });
    }

    const waitlistEntry = new Waitlist({
      name,
      email,
      education,
      source
    });

    await waitlistEntry.save();

    res.status(201).json({
      success: true,
      data: waitlistEntry,
      message: 'Successfully added to waitlist'
    });
  } catch (error) {
    console.error('Waitlist submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing your request'
    });
  }
});

module.exports = router;
