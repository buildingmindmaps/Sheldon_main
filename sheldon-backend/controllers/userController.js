const User = require('../models/User');

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  // req.user is populated by the 'protect' middleware
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // Only update password if provided in the request body
    if (req.body.password) {
      user.password = req.body.password; // Mongoose pre-save hook will hash this
    }

    try {
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        dateOfJoining: updatedUser.dateOfJoining,
        modulesCompleted: updatedUser.modulesCompleted,
        experiencePoints: updatedUser.experiencePoints,
        message: 'Profile updated successfully!',
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Handle potential validation errors (e.g., duplicate email)
      if (error.code === 11000) { // MongoDB duplicate key error code
        return res.status(400).json({ message: 'The provided email is already in use.' });
      }
      res.status(500).json({ message: 'Error saving profile changes.' });
    }
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
};

// @desc    Mark a module as completed for the authenticated user
// @route   PUT /api/users/modules-completed
// @access  Private
const updateModulesCompleted = async (req, res) => {
  const { moduleId } = req.body;

  if (!moduleId) {
    return res.status(400).json({ message: 'Module ID is required.' });
  }

  const user = await User.findById(req.user._id);

  if (user) {
    // Check if the module is already completed to prevent duplicates
    const moduleAlreadyCompleted = user.modulesCompleted.some(
      (module) => module.moduleId === moduleId
    );

    if (moduleAlreadyCompleted) {
      return res.status(400).json({ message: `Module "${moduleId}" is already marked as completed.` });
    }

    // Add the new completed module
    user.modulesCompleted.push({ moduleId, completedAt: Date.now() });

    try {
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        modulesCompleted: updatedUser.modulesCompleted,
        message: `Module "${moduleId}" marked as completed successfully!`,
      });
    } catch (error) {
      console.error('Error updating modules completed:', error);
      res.status(500).json({ message: 'Error marking module as completed.' });
    }
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
};

// @desc    Add experience points (XP) to the authenticated user
// @route   PUT /api/users/add-xp
// @access  Private
const addExperiencePoints = async (req, res) => {
  const { xpAmount } = req.body;

  if (typeof xpAmount !== 'number' || xpAmount <= 0) {
    return res.status(400).json({ message: 'Valid positive XP amount is required.' });
  }

  const user = await User.findById(req.user._id);

  if (user) {
    user.experiencePoints += xpAmount; // Increment XP

    try {
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        experiencePoints: updatedUser.experiencePoints,
        message: `${xpAmount} XP added successfully! Total XP: ${updatedUser.experiencePoints}`,
      });
    } catch (error) {
      console.error('Error adding experience points:', error);
      res.status(500).json({ message: 'Error adding experience points.' });
    }
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
};

module.exports = { updateUserProfile, updateModulesCompleted, addExperiencePoints };
