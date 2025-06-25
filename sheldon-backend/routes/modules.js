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

// Route to get a single module by ID
router.get('/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(module);
  } catch (err) {
    console.error('Error fetching module by ID:', err);
    res.status(500).json({ error: 'Server error while fetching module' });
  }
});

module.exports = router;
