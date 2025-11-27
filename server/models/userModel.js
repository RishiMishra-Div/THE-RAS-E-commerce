// User Model - Defines the structure for user data in MongoDB
const mongoose = require('mongoose');

// Create a schema (blueprint) for User
const userSchema = new mongoose.Schema({
  // User's full name
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  // User's email (must be unique)
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // Hashed password (never store plain text passwords)
  password: {
    type: String,
    required: true
  },
  // otp for verification
  verifyotp :{
        type: String,
        default : null,
  },
    //  verification otp expiry time
  verifyotpexpiry :{
      type: Number,
      defoult:0
  },

    // verification checkup
  isverified :{
      type: Boolean,
      default: false
  },

  // password reset otp
  resetotp:{
      type: String,
      default: null
  },

  // password reset otp expiry time
  resetotpexpiry:{
      type: Number,
      default: 0
  },

  // User role: 'user' or 'admin'
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

// Export the User model
module.exports = mongoose.models.User || mongoose.model('User', userSchema);

