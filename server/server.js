// Main Server File - Entry point for the backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from public folder

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('localhost')) {
  console.log('⚠️  WARNING: No MongoDB connection configured!');
  console.log('📝 To fix this:');
  console.log('   1. Get a FREE database at https://mongodb.com/cloud/atlas');
  console.log('   2. Add your connection string to the MONGODB_URI environment variable');
  console.log('   3. Restart the application\n');
  console.log('🚀 Server will run, but database features won\'t work until connected.\n');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      console.log('💡 Check your MONGODB_URI environment variable');
    });
}

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/products.html'));
});

app.get('/product-detail', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/product-detail.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/cart.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/checkout.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
