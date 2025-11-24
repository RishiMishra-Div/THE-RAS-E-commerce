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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/the-ras-ecommerce')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

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
