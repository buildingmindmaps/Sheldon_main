// Script to unlock the first module of each course for existing users with empty unlockedModules arrays
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/course');
const Module = require('../models/Module');
require('dotenv').config(); // Load environment variables

/**
 * Migrates existing users by adding the first module of each course to their unlockedModules array
 */
async function migrateExistingUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Find all users with empty unlockedModules arrays
    const users = await User.find({ unlockedModules: { $size: 0 } });
    console.log(`Found ${users.length} users with empty unlockedModules arrays`);

    // Find all courses
    const courses = await Course.find();
    console.log(`Found ${courses.length} courses`);

    if (courses.length === 0) {
      console.log('No courses found. Exiting.');
      await mongoose.disconnect();
      return;
    }

    // Find first module of each course
    const firstModules = [];
    for (const course of courses) {
      const firstModule = await Module.findOne({ courseId: course._id })
        .sort({ order: 1 })
        .limit(1);

      if (firstModule) {
        console.log(`First module for course "${course.title}": ${firstModule._id} (${firstModule.title})`);
        firstModules.push(firstModule._id);
      }
    }

    if (firstModules.length === 0) {
      console.log('No first modules found. Exiting.');
      await mongoose.disconnect();
      return;
    }

    // Update users
    for (const user of users) {
      console.log(`Updating user: ${user.email}`);
      user.unlockedModules = [...firstModules];
      await user.save();
    }

    console.log(`Successfully updated ${users.length} users`);
    console.log('Migration complete');

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
}

// Run the migration
migrateExistingUsers();
