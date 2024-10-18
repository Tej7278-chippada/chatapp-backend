const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const router = express.Router();

// Secret key for JWT (make sure this is in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'qwertyuiop'; //secret key

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Username and password validation
  const usernameRegex = /^[A-Z][A-Za-z0-9@_-]{5,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*@).{8,}$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Invalid username format.' });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Invalid password format.' });
  }

  try {
    // const { username, password, confirmPassword } = req.body;

    //     // Username and password validation logic here...
    //     if (password !== confirmPassword) {
    //         return res.status(400).json({ message: 'Passwords do not match' });
    //     }
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create and save the new user
    const newUser = new User({ username, password });
    await newUser.save();

    console.log('Registered user:', newUser); // Log the newly saved user
    res.status(201).json({ message: `Your new account created with username: ${newUser.username}` });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});


// router.post('/register', async (req, res) => {
//   const { username, password } = req.body;

//   // Check if user already exists
//   const existingUser = await User.findOne({ username });
//   if (existingUser) {
//     return res.status(400).json({ message: 'Username already taken' });
//   }

//   // Hash the password before saving
//   const hashedPassword = await bcrypt.hash(password, 12);

//   const newUser = new User({ username, password: hashedPassword });
//   await newUser.save();

//   res.status(201).json({ message: 'User registered successfully' });
// });



// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: `Your entered username doesn't match to the existing one` });
    }

    // Compare passwords
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: `Password not matched with this username: ${username}` });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful:', user); // Log successful login
    res.status(200).json({ message: `You are logged in with username: ${username}` });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Login failed', error });
  }
});

module.exports = router;
