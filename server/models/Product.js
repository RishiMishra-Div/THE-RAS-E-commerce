// Product Model - Defines the structure for product data in MongoDB
const mongoose = require('mongoose');

// Create a schema (blueprint) for Product
const productSchema = new mongoose.Schema({
  // Product title/name
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Product description
  description: {
    type: String,
    required: true
  },
  // Product price in dollars
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Product category (Electronics, Fashion, etc.)
  category: {
    type: String,
    required: true
  },
  // Stock available
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  // Image URL for the product
  image: {
    type: String,
    required: true
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

// Export the Product model
module.exports = mongoose.model('Product', productSchema);
