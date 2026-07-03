import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// middleware to protect routes - ensures user is authenticated
export async function protect(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated. Please login.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

// middleware to ensure the user is a guest (not authenticated)
export function guestOnly(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.status(400).json({ message: 'Already logged in.' });
    } catch {
      // token invalid/expired - allow to proceed as guest
    }
  }
  next();
}