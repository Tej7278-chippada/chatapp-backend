const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

// Secret key for JWT (make sure this is in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'qwertyuiop'; //secret key

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', username);  // <-- Add this

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful:', user);

    // Send response with token and user info
    return res.status(200).json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error); // Log any unexpected errors
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
