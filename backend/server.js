const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const os = require('os');
const moment = require('moment-timezone');
const axios = require('axios');
const fileUpload = require('express-fileupload');
const FormData = require('form-data');
const cron = require('node-cron');

dotenv.config();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN, methods: ['GET', 'POST'] }));
app.use(bodyParser.json());
app.use(fileUpload());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  mongodbUrl: { type: String, required: true },
  loginToken: { type: String, default: null },
  loginStatus: { type: Boolean, default: false },
  tokenExpiration: {
    type: Object, // Store token expiration in both IST and GMT
    default: null,
  },
  last_logged_in_on: { type: Object, default: null },
  login_times: { type: Number, default: 0 },
  last_logged_in_ip: { type: String, default: null },
  position: { type: String, default: '' },
  bio: { type: String, default: '' },
  profileImageUrl: { type: String, default: '' },
});

const User = mongoose.model('User', userSchema);

// Utility to fetch public IP using ipify
const getPublicIP = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching public IP:', error);
    return null;
  }
};

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  const now = moment();
  const istTime = now.tz("Asia/Kolkata").add(1, 'hour').format("DD-MMM-YYYY HH:mm:ss");
  const gmtTime = now.tz("GMT").add(1, 'hour').format("DD-MMM-YYYY HH:mm:ss");
  const publicIP = await getPublicIP();

  user.loginToken = token;
  user.loginStatus = true;
  user.tokenExpiration = { IST: istTime, GMT: gmtTime }; // Set expiration in both time zones
  user.login_times += 1;
  user.last_logged_in_on = { IST: istTime, GMT: gmtTime };
  user.last_logged_in_ip = publicIP;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    name: user.name,
  });
});

// Middleware to clear expired tokens
cron.schedule('*/5 * * * *', async () => {
  const nowGMT = moment().tz("GMT").format("DD-MMM-YYYY HH:mm:ss");

  const expiredUsers = await User.find({
    "tokenExpiration.GMT": { $lt: nowGMT },
    loginToken: { $ne: null },
  });

  expiredUsers.forEach(async (user) => {
    user.loginToken = null;
    user.loginStatus = false;
    user.tokenExpiration = null;
    await user.save();
    console.log(`User ${user.email} logged out due to token expiration.`);
  });
});

// Logout route
app.post('/api/logout', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(400).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.loginToken = null;
    user.loginStatus = false;
    await user.save();

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

app.post('/api/verify-token', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Token not found' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.loginToken !== token) {
      return res.status(401).json({ success: false, error: 'Token mismatch' });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      token,
      name: user.name
    });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
});

// Profile route - Fetch user profile details
app.get('/api/profile', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Token not found' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId, 'name email position bio profileImageUrl');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        position: user.position,
        bio: user.bio,
        profileImage: user.profileImageUrl
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
});

// Update profile route
app.post('/api/updateProfile', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Token not found' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, position, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { name, position, bio },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        name: updatedUser.name,
        position: updatedUser.position,
        bio: updatedUser.bio
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Profile update failed' });
  }
});

// Upload profile image route
app.post('/api/uploadImage', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Token not found' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    if (!req.files || !req.files.image) return res.status(400).json({ success: false, error: 'No image uploaded' });

    // Create a FormData instance and append the file with correct options
    const formData = new FormData();
    formData.append('image', req.files.image.data.toString("base64"));

    // Set the header to specify form-data
    const imgbbResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, 
      formData, 
      { headers: formData.getHeaders() }
    );

    const imageUrl = imgbbResponse.data.data.url;
    user.profileImageUrl = imageUrl; // Update user's profile image URL in the database
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ success: false, error: 'Image upload failed' });
  }
});

// Utility to get the machine’s local IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const details of iface) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT || 5174;
app.listen(PORT, '0.0.0.0', () => {
  const ipAddress = getLocalIP();
  console.log(`Server running on: \nhttp://localhost:${PORT} \nhttp://${ipAddress}:${PORT}`);
});
