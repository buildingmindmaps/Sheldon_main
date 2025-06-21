const express = require('express');
const { registerUser, loginUser, getUserProfile, generateToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const passport = require('passport'); // For OAuth integration

const router = express.Router();

// --- Traditional Email/Password Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile); // Protected route to get user's own profile

// --- Google OAuth Routes (Conditional: Only if you enable Google Sign-In) ---

// Route to initiate Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }) // Request profile and email access
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }), // Redirect on failure
  (req, res) => {
    // If authentication successful, Passport populates req.user with the user document from MongoDB
    const token = generateToken(req.user._id); // Generate your custom JWT

    // Redirect to your frontend with the token
    // It's common to pass the token as a query parameter or hash fragment
    // Your frontend will then parse this token and store it.
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;

