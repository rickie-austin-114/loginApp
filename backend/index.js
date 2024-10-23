// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User'); // Assuming you'll create a User model
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User registration
app.post('/api/register', async (req, res) => {
  const { name, introduction, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, introduction, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User registered!' });
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get user account info
app.get('/api/account', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

// Update user account
app.put('/api/account', authenticateToken, async (req, res) => {
  const { name, introduction } = req.body;
  await User.findByIdAndUpdate(req.user.id, { name, introduction });
  res.json({ message: 'Account updated!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});