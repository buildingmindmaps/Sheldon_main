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

    // Add module to completed list
    user.modulesCompleted.push({
      courseId,
      moduleId,
      completedAt: new Date()
    });

    await user.save();

    res.status(200).json({
      message: 'Progress updated successfully',
      moduleCompleted: {
        courseId,
        moduleId,
        completedAt: new Date()
      },
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

module.exports = {
  trackModuleCompletion,
  getUserProgress
};
