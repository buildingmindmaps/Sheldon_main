const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  console.log('Middleware entered. Headers:', req.headers.authorization); // <-- Add this

  // Check for 'Bearer' token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found:', token); // <-- Add this

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded); // <-- Add this

      // Attach user to the request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found in DB:', req.user); // <-- Add this

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Token verification error:', error.message); // <-- Modify this
      res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    console.log('No token found in headers.'); // <-- Add this
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
