const express = require('express');
const router = express.Router();
const { getCourses, getCourseById } = require('../controllers/courseController');

// Routes for course-related operations
router.get('/', getCourses);
router.get('/:id', getCourseById);

module.exports = router;
