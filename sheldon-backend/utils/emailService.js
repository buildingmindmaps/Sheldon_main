const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a verification email to the user
 * @param {string} email - The recipient's email address
 * @param {string} username - The recipient's name
 * @param {string} verificationToken - The token to verify the email
 * @returns {Promise} - Resolves when the email is sent
 */
const sendVerificationEmail = async (email, username, verificationToken) => {
  // Include both token and email in the verification link for a more robust process
  const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

  const mailOptions = {
    from: `"Sheldon AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your Sheldon AI account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Sheldon AI!</h2>
        <p>Hello ${username},</p>
        <p>Thank you for signing up. Please verify your email address to activate your account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background-color: #4CAF50; color: white; padding: 14px 20px; 
                    text-align: center; text-decoration: none; display: inline-block; 
                    border-radius: 4px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not sign up for a Sheldon AI account, please ignore this email.</p>
        <p>Best regards,<br>The Sheldon AI Team</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Sends a password reset email to the user
 * @param {string} email - The recipient's email address
 * @param {string} username - The recipient's name
 * @param {string} resetToken - The token to reset the password
 * @returns {Promise} - Resolves when the email is sent
 */
const sendPasswordResetEmail = async (email, username, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  const mailOptions = {
    from: `"Sheldon AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your Sheldon AI password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>Hello ${username},</p>
        <p>We received a request to reset your password. Click the button below to create a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #2196F3; color: white; padding: 14px 20px; 
                    text-align: center; text-decoration: none; display: inline-block; 
                    border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you're concerned.</p>
        <p>Best regards,<br>The Sheldon AI Team</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Sends a verification email with OTP to the user
 * @param {string} email - The recipient's email address
 * @param {string} username - The recipient's name
 * @param {string} otp - The one-time password for verification
 * @returns {Promise} - Resolves when the email is sent
 */
const sendVerificationEmailWithOTP = async (email, username, otp) => {
  const mailOptions = {
    from: `"Sheldon AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Verification Code for Sheldon AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Sheldon AI Account</h2>
        <p>Hello ${username},</p>
        <p>Thank you for signing up. Please use the verification code below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 32px; letter-spacing: 5px; padding: 20px; background-color: #f4f4f4; display: inline-block; border-radius: 5px; font-weight: bold;">${otp}</div>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you did not sign up for a Sheldon AI account, please ignore this email.</p>
        <p>Best regards,<br>The Sheldon AI Team</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendVerificationEmailWithOTP
};
