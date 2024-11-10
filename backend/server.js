const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware to allow requests from frontend
app.use(cors({
  origin: 'http://localhost:5173', // Specify frontend origin
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
  console.log('Received request body:', req.body);

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

// Start the server
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});