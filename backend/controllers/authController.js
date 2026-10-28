const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

const DEMO_USERS = {
  'user@imovies.com': {
    _id: '661b00010000000000000001',
    name: 'Demo Moviegoer',
    email: 'user@imovies.com',
    role: 'user',
    phone: '+1 (555) 382-9102',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    credits: 300
  },
  'admin@imovies.com': {
    _id: '661b00010000000000000002',
    name: 'IMovies Administrator',
    email: 'admin@imovies.com',
    role: 'admin',
    phone: '+1 (555) 999-0001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    credits: 1000
  }
};

// @desc    Register a new user
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    if (!isDbConnected()) {
      const mockId = Date.now().toString();
      const user = {
        _id: mockId,
        name,
        email: email.toLowerCase(),
        role: 'user',
        phone: phone || '+1 (555) 019-2834',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        credits: 300,
        token: generateToken(mockId)
      };
      return res.status(201).json({ success: true, user });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '+1 (555) 019-2834',
      role: 'user'
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        credits: user.credits,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const lowerEmail = email.toLowerCase();

    // Check demo accounts fallback
    if (!isDbConnected() || DEMO_USERS[lowerEmail]) {
      if (DEMO_USERS[lowerEmail]) {
        const u = DEMO_USERS[lowerEmail];
        return res.json({
          success: true,
          user: {
            ...u,
            token: generateToken(u._id)
          }
        });
      }
    }

    const user = await User.findOne({ email: lowerEmail }).select('+password');
    if (user && (await user.matchPassword(password))) {
      return res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          credits: user.credits,
          token: generateToken(user._id)
        }
      });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
const getMe = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, user: req.user });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, user: { ...req.user, ...req.body } });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    const updated = await user.save();
    res.json({ success: true, user: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
