const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/course');
const Module = require('../models/Module');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Migration function to update modules and users
async function migrateData() {
  try {
    console.log('Starting migration...');

    // Step 1: Add experiencePoints field to all modules if not present
    console.log('Adding experience points to modules...');
    const updatedModules = await Module.updateMany(
      { experiencePoints: { $exists: false } },
      { $set: { experiencePoints: 10 } }
    );
    console.log(`Updated ${updatedModules.modifiedCount} modules with experience points`);

    // Step 2: Get the first module of each course
    console.log('Finding first modules for each course...');
    const courses = await Course.find();

    const firstModulesByCourse = {};
    for (const course of courses) {
      const firstModule = await Module.findOne({ courseId: course._id }).sort({ order: 1 });
      if (firstModule) {
        firstModulesByCourse[course._id.toString()] = firstModule._id;
      }
    }

    // Step 3: Find all users
    console.log('Updating users with unlocked modules...');
    const users = await User.find();
    let userUpdateCount = 0;

    // Step 4: Update each user
    for (const user of users) {
      // Initialize unlockedModules array if it doesn't exist
      if (!user.unlockedModules || user.unlockedModules.length === 0) {
        // Get first modules and modules user has already completed
        const unlockedModuleIds = new Set();

        // Add the first module of each course
        Object.values(firstModulesByCourse).forEach(moduleId => {
          unlockedModuleIds.add(moduleId.toString());
        });

        // Add modules the user has already completed
        if (user.modulesCompleted && user.modulesCompleted.length > 0) {
          for (const completedModule of user.modulesCompleted) {
            unlockedModuleIds.add(completedModule.moduleId.toString());

            // Try to unlock the next module for each completed module
            const courseId = completedModule.courseId;
            const completedModuleDetails = await Module.findById(completedModule.moduleId);

            if (completedModuleDetails) {
              const nextModule = await Module.findOne({
                courseId: courseId,
                order: completedModuleDetails.order + 1
              });

              if (nextModule) {
                unlockedModuleIds.add(nextModule._id.toString());
              }
            }
          }
        }

        // Convert Set back to array for database update
        user.unlockedModules = Array.from(unlockedModuleIds).map(id => new mongoose.Types.ObjectId(id));
        await user.save();
        userUpdateCount++;
      }
    }

    console.log(`Updated ${userUpdateCount} users with unlocked modules`);
    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close connection
    mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateData();
