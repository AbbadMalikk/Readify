// connectDB.js
const mongoose = require('mongoose');

// MongoDB URI (can be stored in .env)
const MONGODB_URI = 'mongodb://localhost:27017/Readify';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

// Use CommonJS syntax to export the function
module.exports = connectDB;
