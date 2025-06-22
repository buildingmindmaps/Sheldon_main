const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for authenticated users
 * @param {Object} user - The user object from database
 * @returns {String} - JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

/**
 * Verifies a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
