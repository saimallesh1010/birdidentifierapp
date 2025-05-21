const express = require('express');
const router = express.Router();
const User = require('../models/user');

// ✅ Test route
router.get('/ping', (req, res) => {
  res.send('✅ Auth route is working');
});

// ✅ Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const newUser = new User({ name, email, password });
  await newUser.save();
  res.json({ message: 'User created' });
});

// ✅ Login (THIS was missing)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ message: 'Login successful', userId: user._id });
});

// ✅ Reset password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
