// Main Server File - Entry point for the backend
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();


// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from public folder
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//connect to database
const db = require('./config/mongodbConnection');

// Import routes
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const categoryRouter = require('./routes/categoryRouter');
const orderRouter = require('./routes/orderRouter');


// API Routes
app.use('/api/auth', userRouter);
app.use('/api/products', productRouter);
app.use('/api/admin/categories', categoryRouter);
app.use('/api/orders', orderRouter);



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
  res.sendFile(path.join(__dirname, '../public/adminpanel.html'));
});

app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/account.html'));
});

// admin panel routes

app.get('/admin/addProduct', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/adminPanel/addProduct.html'));
});


app.get('/admin/manageProduct', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/adminPanel/admin-manage-products.html'));
});

app.get('/admin/edit/product', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/adminPanel/admin-edit-product.html'));
});

app.get('/admin/categories', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/adminPanel/admin-categories.html'));
});

app.get('/admin/orders', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/adminPanel/admin-orders.html'));
});


app.get('/admin/users', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/adminPanel/admin-users.html'));
});






// Start server
const PORT =4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on : ${PORT}`);
});



