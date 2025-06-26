const User = require('../models/User');
const Course = require('../models/course');
const Module = require('../models/Module');
const mongoose = require('mongoose');

// @desc    Track user's module completion
// @route   POST /api/users/:userId/progress
// @access  Private
const trackModuleCompletion = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId, moduleId } = req.body;

    // Validate request body
    if (!courseId || !moduleId) {
      return res.status(400).json({ message: 'Course ID and Module ID are required' });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Check if course and module exist
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Find user and update progress
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if module is already completed by user
    const alreadyCompleted = user.modulesCompleted.some(
      (item) => item.courseId.toString() === courseId && item.moduleId.toString() === moduleId
    );

    if (alreadyCompleted) {
      return res.status(200).json({ message: 'Module already completed', user });
    }

    // Check if the module is unlocked for this user
    const isModuleUnlocked = user.unlockedModules.some(
      (id) => id.toString() === moduleId
    );

    if (!isModuleUnlocked) {
      return res.status(403).json({ message: 'Module is locked. Complete previous modules first.' });
    }

    // Get experience points from the completed module
    const xpGained = module.experiencePoints || 10; // Default to 10 if not set

    // Add module to completed list
    user.modulesCompleted.push({
      courseId,
      moduleId,
      completedAt: new Date()
    });

    // Award experience points to user
    user.experiencePoints += xpGained;

    // Find the next module in the course based on order
    const nextModule = await Module.findOne({
      courseId: courseId,
      order: module.order + 1
    });

    // If there's a next module and it's not already unlocked, add it to unlockedModules
    if (nextModule) {
      const isAlreadyUnlocked = user.unlockedModules.some(
        (id) => id.toString() === nextModule._id.toString()
      );

      if (!isAlreadyUnlocked) {
        user.unlockedModules.push(nextModule._id);
      }
    }

    await user.save();

    res.status(200).json({
      message: 'Progress updated successfully',
      moduleCompleted: {
        courseId,
        moduleId,
        completedAt: new Date(),
      },
      experiencePointsGained: xpGained,
      totalExperiencePoints: user.experiencePoints,
      nextModuleUnlocked: nextModule ? nextModule._id : null,
      user
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
};

// @desc    Get user's progress across all courses
// @route   GET /api/users/:userId/progress
// @access  Private
const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Find user with populated course and module data
    const user = await User.findById(userId)
      .populate({
        path: 'modulesCompleted.courseId',
        select: 'title slug'
      })
      .populate({
        path: 'modulesCompleted.moduleId',
        select: 'title order'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get total count of modules completed
    const totalModulesCompleted = user.modulesCompleted.length;

    // Get recent activity (last 5 completed modules)
    const recentActivity = user.modulesCompleted
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, 5);

    // Get progress by course
    const allCourses = await Course.find().select('_id title').lean();
    const courseProgress = [];

    for (const course of allCourses) {
      const courseId = course._id.toString();

      // Get all modules for this course
      const totalModules = await Module.countDocuments({ courseId: course._id });

      // Get completed modules for this course
      const completedModules = user.modulesCompleted.filter(
        item => item.courseId._id.toString() === courseId
      ).length;

      courseProgress.push({
        courseId,
        courseTitle: course.title,
        completedModules,
        totalModules,
        percentComplete: totalModules > 0 ? (completedModules / totalModules) * 100 : 0
      });
    }

    res.status(200).json({
      totalModulesCompleted,
      recentActivity,
      courseProgress
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Failed to fetch user progress' });
  }
};

// @desc    Get course modules with unlock status for a user
// @route   GET /api/users/:userId/course/:courseId/modules
// @access  Private
const getCourseModulesWithStatus = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all modules for the course
    const modules = await Module.find({ courseId }).sort({ order: 1 });
    if (!modules || modules.length === 0) {
      return res.status(404).json({ message: 'No modules found for this course' });
    }

    // Process modules to add status information
    const modulesWithStatus = modules.map(module => {
      // Check if module is completed
      const isCompleted = user.modulesCompleted.some(
        item => item.moduleId.toString() === module._id.toString()
      );

      // Check if module is unlocked
      const isUnlocked = user.unlockedModules.some(
        id => id.toString() === module._id.toString()
      );

      return {
        ...module.toObject(),
        isCompleted,
        isUnlocked,
      };
    });

    res.status(200).json({
      courseId,
      modules: modulesWithStatus,
      userExperiencePoints: user.experiencePoints
    });
  } catch (error) {
    console.error('Error fetching modules with status:', error);
    res.status(500).json({ message: 'Failed to fetch modules with status' });
  }
};

module.exports = {
  trackModuleCompletion,
  getUserProgress,
  getCourseModulesWithStatus
};
