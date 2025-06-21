const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Password is required UNLESS user signs up via Google (or other OAuth)
      required: function() { return !this.googleId; },
      minlength: 6, // Example minimum length
    },
    googleId: { // Optional: for Google OAuth users
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to have a null value for this field
    },
    modulesCompleted: [
      {
        moduleId: {
          type: String, // Or mongoose.Schema.Types.ObjectId if you link to a separate Modules collection
          required: true,
          trim: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    experiencePoints: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Pre-save hook to hash password BEFORE saving if it's new or modified
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Only try to compare if a password exists for this user (not an OAuth user)
  if (this.password) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  return false; // No password to compare
};

const User = mongoose.model('User', userSchema);

module.exports = User;
