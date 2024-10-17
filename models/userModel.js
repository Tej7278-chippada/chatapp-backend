// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if the password is new or modified
  this.password = await bcrypt.hash(this.password, 12); // Hashing with salt rounds
  next();
});

// Method to compare input password with hashed password
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password); // Returns true if password matches
};

const User = mongoose.model('User', userSchema);
module.exports = User;
