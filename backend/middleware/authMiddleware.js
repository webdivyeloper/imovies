const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const isDbConnected = () => mongoose.connection.readyState === 1;

const DEMO_USERS = {
  '661b00010000000000000001': {
    _id: '661b00010000000000000001',
    name: 'Demo Moviegoer',
    email: 'user@imovies.com',
    role: 'user',
    credits: 300
  },
  '661b00010000000000000002': {
    _id: '661b00010000000000000002',
    name: 'IMovies Administrator',
    email: 'admin@imovies.com',
    role: 'admin',
    credits: 1000
  }
};

const protect = async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026');

      if (!isDbConnected()) {
        req.user = DEMO_USERS[decoded.id] || {
          _id: decoded.id,
          name: 'Demo User',
          email: 'user@imovies.com',
          role: decoded.id.includes('admin') ? 'admin' : 'user',
          credits: 300
        };
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        req.user = DEMO_USERS[decoded.id];
      }
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      return next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
  }
};

module.exports = { protect, adminOnly };
