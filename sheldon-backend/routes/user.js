const express = require('express');
const { updateUserProfile, updateModulesCompleted, addExperiencePoints } = require('../controllers/userController');
const { protect } = require('../middleware/auth'); // Import the protect middleware

const router = express.Router();

// All routes here are protected and require a valid JWT
router.put('/profile', protect, updateUserProfile);
router.put('/modules-completed', protect, updateModulesCompleted);
router.put('/add-xp', protect, addExperiencePoints);

module.exports = router;
