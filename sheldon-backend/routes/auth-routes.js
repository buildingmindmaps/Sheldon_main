const express = require('express');
const passport = require('passport');
const { generateToken } = require('../utils/tokenService');
const router = express.Router();

// Initiate Google OAuth login - explicitly request profile.picture to ensure we get the photo
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/userinfo.profile']
}));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    try {
      // Add debug logging to see the user object
      console.log('OAuth user object before generating token:', JSON.stringify(req.user, null, 2));

      // User has been authenticated, create JWT token
      const token = generateToken(req.user);

      // Redirect to frontend with token
      const redirectUrl = process.env.NODE_ENV === 'production'
        ? `https://sheldonai.in/auth-success?token=${token}`
        : `http://localhost:8081/auth-success?token=${token}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error in Google callback route:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth-error`);
    }
  }
);

module.exports = router;
