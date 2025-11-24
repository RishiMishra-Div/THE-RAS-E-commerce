// User Model - Defines the structure for user data in MongoDB
const mongoose = require('mongoose');

// Create a schema (blueprint) for User
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
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
module.exports = mongoose.model('User', userSchema);
