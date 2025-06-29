// This file is only needed if you are implementing OAuth (e.g., Google Sign-In)
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Your Mongoose User model

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback', // This is the route on your backend
      // passReqToCallback: true // uncomment if you need access to req in verify callback
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Debug logging for Google profile data
        console.log('Google OAuth Profile Data:');
        console.log('Profile ID:', profile.id);
        console.log('Display Name:', profile.displayName);
        console.log('Full profile object:', JSON.stringify(profile, null, 2));

        // Check if a user with this Google ID already exists
        let user = await User.findOne({ googleId: profile.id });

        // Get the profile image from Google - try multiple possible locations
        let avatar = '';

        // Try to find the avatar from different potential places in the profile object
        if (profile.photos && profile.photos.length > 0) {
          avatar = profile.photos[0].value;
          console.log('Found avatar in profile.photos:', avatar);
        } else if (profile._json && profile._json.picture) {
          avatar = profile._json.picture;
          console.log('Found avatar in profile._json.picture:', avatar);
        } else if (profile.picture) {
          avatar = profile.picture;
          console.log('Found avatar in profile.picture:', avatar);
        }

        // Remove size limitation from Google profile picture if present
        // (Google often adds '=s96-c' to restrict the image size)
        if (avatar && avatar.includes('=s')) {
          avatar = avatar.split('=s')[0];
          console.log('Removed size restriction from avatar URL:', avatar);
        }

        console.log('Final avatar URL to be used:', avatar);

        if (user) {
          // User exists, update their avatar URL
          console.log('Updating existing user with avatar:', avatar);
          user.avatar = avatar;
          await user.save();
          console.log('Updated user:', user);

          // Return the user
          done(null, user);
        } else {
          // If not, create a new user account
          // Ensure profile.emails exists and has at least one email
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

          if (!email) {
            return done(new Error('No email found in Google profile.'), null);
          }

          console.log('Creating new user with avatar:', avatar);

          // Find all courses to unlock first module of each course (Same as in registerUser)
          const Course = require('../models/course');
          const Module = require('../models/Module');

          // Find all courses
          const courses = await Course.find();

          // Get first module from each course
          const unlockedModules = [];
          for (const course of courses) {
            // Find the first module (lowest order) for this course
            const firstModule = await Module.findOne({ courseId: course._id })
              .sort({ order: 1 })
              .limit(1);

            if (firstModule) {
              unlockedModules.push(firstModule._id);
            }
          }

          user = await User.create({
            googleId: profile.id,
            email: email,
            username: profile.displayName || email.split('@')[0], // Use display name or part of email
            avatar: avatar, // Save the avatar URL from Google
            isVerified: true, // OAuth users are considered verified
            unlockedModules: unlockedModules, // Add the first module of each course
            // Password is not stored for OAuth users
          });
          console.log('New user created with avatar:', user.avatar);
          console.log('New user has unlocked modules:', user.unlockedModules);
          done(null, user);
        }
      } catch (err) {
        console.error('Error during Google OAuth:', err);
        done(err, null);
      }
    }
  )
);

// Serialize user for session (Passport.js uses this to store user ID in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session (Passport.js uses this to retrieve user from DB)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
