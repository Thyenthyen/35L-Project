const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and Password required' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    //create new User
    const newUser = new User({ username, password });
    await newUser.save();

    req.session.userId = newUser._id;
    
    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });

  if (!existing || existing.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.userId = existing._id;
  res.json({ message: 'Login successful', user: existing });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// GET /api/auth/check
router.get('/check', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;