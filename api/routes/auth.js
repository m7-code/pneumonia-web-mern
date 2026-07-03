import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, guestOnly } from '../middleware/protect.js';

const router = express.Router();

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function sendTokenCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
  });
}

// ── Register  ────────────────────────────────
router.post('/register', guestOnly, async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({ message: 'All fields are required.' });
    }
    if (password.length < 8) {
      return res.status(422).json({ message: 'Password must be at least 8 characters long.' });
    }
    if (password_confirmation && password !== password_confirmation) {
      return res.status(422).json({ message: 'Password confirmation does not match.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(201).json({
      message: 'Account created successfully!',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── Login  ──────────────────────────────────────
router.post('/login', guestOnly, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.json({
      message: 'Welcome back!',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── Logout ───────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully!' });
});

// ── Current logged-in user ────────────────────────────────────────
router.get('/me', protect, (req, res) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
});

export default router;