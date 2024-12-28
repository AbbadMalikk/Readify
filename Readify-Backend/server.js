// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connectDB'); // Import the connectDB function
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const jwt = require('jsonwebtoken');
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({limit:"10mb"})); // Parse incoming JSON
app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded data
app.use(cors({
  origin: '*',  // Ensure this matches your frontend URL
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'userId'],
})); // Allow cross-origin requests

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('API is working');
});

// Add your routes for user authentication here
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes); // Prefix '/api' for order routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
