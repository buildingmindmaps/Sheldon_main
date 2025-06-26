const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Course = require('../models/course');
const Module = require('../models/Module');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      // Options for the Google strategy
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in database by googleId
        const existingUserByGoogleId = await User.findOne({ googleId: profile.id });

        if (existingUserByGoogleId) {
          // User already exists with this Google ID
          // Ensure isVerified is true for existing Google users
          if (!existingUserByGoogleId.isVerified) {
            existingUserByGoogleId.isVerified = true;
            await existingUserByGoogleId.save();
          }

          // Check if user has empty unlockedModules and update if needed
          if (existingUserByGoogleId.unlockedModules && existingUserByGoogleId.unlockedModules.length === 0) {
            // Find all courses and their first modules
            const courses = await Course.find();
            const firstModules = [];

            for (const course of courses) {
              const firstModule = await Module.findOne({ courseId: course._id })
                .sort({ order: 1 })
                .limit(1);

              if (firstModule) {
                firstModules.push(firstModule._id);
              }
            }

            // Update user with first modules
            existingUserByGoogleId.unlockedModules = firstModules;
            await existingUserByGoogleId.save();
          }

          return done(null, existingUserByGoogleId);
        }

        // Check if user exists with the same email
        const existingUserByEmail = await User.findOne({ email: profile.emails[0].value });

        if (existingUserByEmail) {
          // Update existing user with Google ID and ensure they're verified
          existingUserByEmail.googleId = profile.id;
          existingUserByEmail.isVerified = true; // Set to true as Google accounts are verified
          existingUserByEmail.avatar = profile.photos[0].value || existingUserByEmail.avatar;

          // Check if user has empty unlockedModules and update if needed
          if (existingUserByEmail.unlockedModules && existingUserByEmail.unlockedModules.length === 0) {
            // Find all courses and their first modules
            const courses = await Course.find();
            const firstModules = [];

            for (const course of courses) {
              const firstModule = await Module.findOne({ courseId: course._id })
                .sort({ order: 1 })
                .limit(1);

              if (firstModule) {
                firstModules.push(firstModule._id);
              }
            }

            // Update user with first modules
            existingUserByEmail.unlockedModules = firstModules;
          }

          await existingUserByEmail.save();
          return done(null, existingUserByEmail);
        }

        // Find all courses and their first modules for new user
        const courses = await Course.find();
        const unlockedModules = [];

        for (const course of courses) {
          const firstModule = await Module.findOne({ courseId: course._id })
            .sort({ order: 1 })
            .limit(1);

          if (firstModule) {
            unlockedModules.push(firstModule._id);
          }
        }

        // If not, create a new user with unlocked modules
        const newUser = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0].value,
          isVerified: true, // Google accounts are already verified
          unlockedModules // Add first module of each course
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
