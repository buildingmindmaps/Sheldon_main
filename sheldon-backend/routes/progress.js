const express = require('express');
const router = express.Router();
const { trackModuleCompletion, getUserProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth'); // Fixed path from authMiddleware to auth

// All routes here are protected and require authentication
// Routes for progress tracking
router.post('/:userId/progress', protect, trackModuleCompletion);
router.get('/:userId/progress', protect, getUserProgress);

module.exports = router;
