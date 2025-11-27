const mongoose = require('mongoose');
require('dotenv').config();
const dbgr = require('debug')('database');

const mongoURI = process.env.MONGODB_URI; // Make sure your .env key matches

// Connect function
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);

        console.log("🔥 MongoDB connected successfully!");
        dbgr("MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        dbgr(error.message);
    }
};

// Call the function immediately
connectDB();

// Export (optional but clean)
module.exports = connectDB;
