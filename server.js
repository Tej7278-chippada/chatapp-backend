// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/authRoutes');
const cors = require('cors');


const app = express();

// Add these lines to parse JSON and URL-encoded data
// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Allow CORS
app.use(cors());



// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('MongoDB Connected');
//   } catch (error) {
//     console.error('MongoDB connection failed', error);
//     process.exit(1);
//   }
// };
// connectDB();

// Define the API route
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find(); // Fetch all messages from the database
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Mount the user routes at /api/users

const PORT = process.env.PORT || 5002;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => { 
    console.log('MongoDB Connected');
    app.listen(PORT, () => 
      console.log(`Server running on port ${PORT}`));
  }) .catch(err => console.error('MongoDB Connection Error:', err));

