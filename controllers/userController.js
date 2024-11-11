// /controllers/userController.js
const User = require('../models/userModel');
const sendOtp = require('../utils/sendOtp');
const bcrypt = require('bcryptjs');

// Search usernames in the database
exports.searchUsernames = async (req, res) => {
  try {
    const searchTerm = req.query.username; // Get search term from query params

    if (!searchTerm) {
      return res.status(400).json({ message: 'No search term provided' });
    }

    // Find usernames that contain the search term
    const users = await User.find({ 
      username: { $regex: searchTerm, $options: 'i' } // Case-insensitive match
    }).select('username'); // Return only the username field

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching usernames', error });
  }
};

// // Request OTP
// exports.requestOtp = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ message: 'Email not found' });

//   const otp = generateOtp(); // Implement OTP generation
//   await sendOtp(email, otp); // Implement OTP sending logic
//   res.json({ message: 'OTP sent' });
// };

// // Reset password
// exports.resetPassword = async (req, res) => {
//   const { email, otp, newPassword } = req.body;
//   const isOtpValid = await verifyOtp(email, otp); // Implement OTP verification

//   if (!isOtpValid) return res.status(400).json({ message: 'Invalid OTP' });
//   const user = await User.findOne({ email });

//   user.password = await bcrypt.hash(newPassword, 12);
//   await user.save();
//   console.log('Hashed password 10:', this.password);
//   res.json({ message: 'Password reset successful' });
// };
