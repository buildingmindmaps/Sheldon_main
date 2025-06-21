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
        // Check if a user with this Google ID already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return the user
          done(null, user);
        } else {
          // If not, create a new user account
          // Ensure profile.emails exists and has at least one email
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

          if (!email) {
            return done(new Error('No email found in Google profile.'), null);
          }

          user = await User.create({
            googleId: profile.id,
            email: email,
            username: profile.displayName || email.split('@')[0], // Use display name or part of email
            // Password is not stored for OAuth users
          });
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
