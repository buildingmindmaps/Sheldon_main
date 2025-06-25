const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendVerificationEmail, sendVerificationEmailWithOTP, sendPasswordResetEmail } = require('../utils/emailService');

// Helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// Helper function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user with email/password
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields: username, email, and password.' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create a new user (password will be hashed by the pre-save hook in User model)
    const user = await User.create({
      username,
      email,
      password,
      isVerified: false,
      verificationToken,
    });

    if (user) {
      // Send verification email
      try {
        await sendVerificationEmail(email, username, verificationToken);

        res.status(201).json({
          message: 'Registration successful! Please check your email to verify your account.',
          _id: user._id,
          username: user.username,
          email: user.email,
          // No token provided until email is verified
        });
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);

        // Delete the user if email sending fails
        await User.findByIdAndDelete(user._id);

        res.status(500).json({
          message: 'Failed to send verification email. Please try again later.'
        });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data provided.' });
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
};

// @desc    Authenticate user & get token with email/password
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        message: 'Please verify your email before logging in.',
        needsVerification: true
      });
    }

    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        dateOfJoining: user.dateOfJoining,
        modulesCompleted: user.modulesCompleted,
        experiencePoints: user.experiencePoints,
        avatar: user.avatar, // Include avatar in the response
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};

// @desc    Get authenticated user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user is populated by the 'protect' middleware
  if (req.user) {
    // Select all fields except password and Google ID (or other sensitive IDs)
    const user = await User.findById(req.user._id).select('-password -googleId');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } else {
    // This case should ideally be caught by 'protect' middleware, but as a fallback
    res.status(401).json({ message: 'Not authorized, user not logged in.' });
  }
};

// @desc    Verify user email with token
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required.' });
  }

  try {
    // Find the user with this verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid verification token or account already verified.'
      });
    }

    // Mark user as verified and remove the verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully! You can now log in.',
      verified: true
    });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ message: 'Server error during verification. Please try again.' });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, user.username, verificationToken);

    res.status(200).json({ message: 'Verification email sent successfully.' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Generate and send OTP for email verification
// @route   POST /api/auth/send-otp
// @access  Public
const sendVerificationOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Set OTP expiry (15 minutes from now)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    // Update user with OTP info
    user.verificationOTP = otp;
    user.verificationOTPExpiry = otpExpiry;
    await user.save();

    // Send verification email with OTP
    await sendVerificationEmailWithOTP(email, user.username, otp);

    res.status(200).json({
      message: 'OTP sent successfully to your email.',
      email
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send verification OTP. Please try again.' });
  }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyEmailWithOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(200).json({
        message: 'Email already verified. You can now login.',
        verified: true
      });
    }

    // Check if OTP matches and is not expired
    if (user.verificationOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    if (user.verificationOTPExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpiry = undefined;
    user.verificationToken = undefined; // Clear the old token as well
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully! You can now login.',
      verified: true
    });
  } catch (error) {
    console.error('Error verifying email with OTP:', error);
    res.status(500).json({ message: 'Server error during verification. Please try again.' });
  }
};

// @desc    Forgot password - generates a reset token and sends email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      // For security reasons, return a 200 even if user not found
      // This prevents user enumeration attacks
      return res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Set token expiry (1 hour from now)
    const resetExpiry = new Date();
    resetExpiry.setHours(resetExpiry.getHours() + 1);

    // Hash the token before saving it (for security)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save the hashed token and expiry to the user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = resetExpiry;
    await user.save();

    // Send password reset email with the unhashed token
    await sendPasswordResetEmail(user.email, user.username, resetToken);

    res.status(200).json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Error in forgot password process:', error);
    res.status(500).json({
      message: 'An error occurred while processing your request. Please try again.'
    });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    return res.status(400).json({
      message: 'Token, email, and new password are required.'
    });
  }

  try {
    // Hash the received token for comparison with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with the token and valid expiry
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() } // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired reset token. Please request a new password reset.'
      });
    }

    // Set the new password (will be hashed by the pre-save middleware)
    user.password = password;

    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
      message: 'Password has been successfully reset. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Error in reset password process:', error);
    res.status(500).json({
      message: 'An error occurred while resetting your password. Please try again.'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmail,
  resendVerificationEmail,
  sendVerificationOTP,
  verifyEmailWithOTP,
  forgotPassword,
  resetPassword,
  generateToken, // Added generateToken to the exports
};
