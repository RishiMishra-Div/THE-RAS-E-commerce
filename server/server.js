// Main Server File - Entry point for the backend
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();


// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from public folder
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//connect to database
const db = require('./config/mongodbConnection');

// Import routes
const authRouter = require('./routes/authRouter');
const productRouter = require('./routes/productRouter');
const categoryRouter = require('./routes/categoryRouter');
const orderRouter = require('./routes/orderRouter');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');


// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/admin/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/users' , userRouter);
app.use('/admin', adminRouter);

// Test route
app.get("/", (req, res) => {
  res.send("RAS Backend Running 🚀");
});


// Start server
const PORT =process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on : ${PORT}`);
});



