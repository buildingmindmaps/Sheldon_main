const express = require('express');
const router = express.Router();
const Module = require('../models/Module');

// Route to get modules by course ID
router.get('/by-course/:courseId', async (req, res) => {
  try {
    const modules = await Module.find({ courseId: req.params.courseId }).sort({ order: 1 });
    res.json(modules);
  } catch (err) {
    console.error('Error fetching modules by course ID:', err);
    res.status(500).json({ error: 'Server error while fetching modules' });
  }
});

module.exports = router;
