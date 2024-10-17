const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const router = express.Router();

// Secret key for JWT (make sure this is in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'qwertyuiop'; //secret key

// POST /api/auth/register
router.post(
  '/register',
  [
    // Validation rules for username and password
    body('username')
      .isLength({ min: 6 })
      .matches(/^[A-Za-z][A-Za-z0-9@_]*$/)
      .withMessage('Username must start with a letter and contain @ or _ and a number.'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@]).{8,}$/)
      .withMessage('Password must contain at least one letter, one number, and @.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      // Hash the password before saving to the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      user = new User({
        username,
        password: hashedPassword,
      });

      await user.save();

      console.log('New Account created :', username);

      // Send success message and redirect the user to the login page
      res.status(201).json({ message: 'User registered successfully, please login' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);


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
  // Check if request body is correct
  console.log('Login attempt:', req.body);
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', username);  // <-- Add this

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found'); // gives headsup notification
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful:', user);

    // Send response with token and user info // If password matches, send a success response
    return res.status(200).json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error); // Log any unexpected errors
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
