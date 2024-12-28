const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model
require('dotenv').config();

const router = express.Router();

// Registration Route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user without hashing the password
    const newUser = new User({
      email,
      password, // Save the password as plain text
    });

    // Save the new user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, "readify", { expiresIn: '1h' });

    // Return success message and token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    // Compare provided password with the stored password (plain text comparison)
    if (password !== user.password) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "readify", { expiresIn: '1h' });

    // Return success message and token
  res.json({ message: 'Login successful', token, userId: user._id, email: user.email });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
