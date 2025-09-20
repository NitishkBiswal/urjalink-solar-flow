const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const router = express.Router();
const client = new OAuth2Client('123391924209-nhs08cakrvmdodklsjeu2c10hg3pl061.apps.googleusercontent.com');

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, walletAddress } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, walletAddress });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, 'your_super_secret_key');
    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, walletAddress: newUser.walletAddress } });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, 'your_super_secret_key');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, walletAddress: user.walletAddress } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Google Sign-In Route
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: '123391924209-nhs08cakrvmdodklsjeu2c10hg3pl061.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    const { name, email } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = new User({
        name,
        email,
        password: hashedPassword,
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, 'your_super_secret_key');
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, walletAddress: user.walletAddress } });
  } catch (error) {
    res.status(500).json({ message: 'Error with Google sign-in' });
  }
});

module.exports = router;