const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const os = require('os');

dotenv.config();
const app = express();

// Retrieve the allowed origin from environment variables
const allowedOrigin = process.env.ALLOWED_ORIGIN;

// Middleware to allow requests only from the specified origin
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  mongodbUrl: { type: String, required: true }, // Already encrypted MongoDB URL
});

const User = mongoose.model('User', userSchema);

// Register route to handle user registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, mongodbUrl } = req.body;

    // Validate required fields
    if (!name || !email || !password || !mongodbUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user without re-encrypting mongodbUrl
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mongodbUrl, // Save already encrypted URL directly
    });

    await newUser.save();
    res.status(200).json({ success: true, message: 'User created successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Utility to get the machine’s local IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const details of iface) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address; // Returns the first non-internal IPv4 address
      }
    }
  }
  return 'localhost';
};

// Start the server
const PORT = process.env.PORT || 5174;
app.listen(PORT, '0.0.0.0', () => {
  const ipAddress = getLocalIP();
  console.log(`Server running on: \nhttp://localhost:${PORT} \nhttp://${ipAddress}:${PORT}`);
});