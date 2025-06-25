const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

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
          return done(null, existingUserByGoogleId);
        }

        // Check if user exists with the same email
        const existingUserByEmail = await User.findOne({ email: profile.emails[0].value });

        if (existingUserByEmail) {
          // Update existing user with Google ID and ensure they're verified
          existingUserByEmail.googleId = profile.id;
          existingUserByEmail.isVerified = true; // Set to true as Google accounts are verified
          existingUserByEmail.avatar = profile.photos[0].value || existingUserByEmail.avatar;

          await existingUserByEmail.save();
          return done(null, existingUserByEmail);
        }

        // If not, create a new user
        const newUser = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0].value,
          isVerified: true // Google accounts are already verified
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
