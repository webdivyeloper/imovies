const mongoose = require('mongoose');
const Cinema = require('../models/Cinema');
const mockStore = require('../models/mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all cinemas
// @route   GET /api/cinemas
// @access  Public
const getCinemas = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, count: mockStore.cinemas.length, data: mockStore.cinemas });
    }
    const cinemas = await Cinema.find().sort({ name: 1 });
    res.json({ success: true, count: cinemas.length, data: cinemas });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cinema
// @route   GET /api/cinemas/:id
// @access  Public
const getCinemaById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const cinema = mockStore.cinemas.find(c => c._id === req.params.id);
      if (!cinema) return res.status(404).json({ success: false, message: 'Cinema not found' });
      return res.json({ success: true, data: cinema });
    }
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) return res.status(404).json({ success: false, message: 'Cinema not found' });
    res.json({ success: true, data: cinema });
  } catch (error) {
    next(error);
  }
};

const createCinema = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const cinema = { ...req.body, _id: Date.now().toString() };
      mockStore.cinemas.push(cinema);
      return res.status(201).json({ success: true, data: cinema });
    }
    const cinema = await Cinema.create(req.body);
    res.status(201).json({ success: true, data: cinema });
  } catch (error) {
    next(error);
  }
};

const updateCinema = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const index = mockStore.cinemas.findIndex(c => c._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Cinema not found' });
      mockStore.cinemas[index] = { ...mockStore.cinemas[index], ...req.body };
      return res.json({ success: true, data: mockStore.cinemas[index] });
    }
    const cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: cinema });
  } catch (error) {
    next(error);
  }
};

const deleteCinema = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      mockStore.cinemas = mockStore.cinemas.filter(c => c._id !== req.params.id);
      return res.json({ success: true, message: 'Cinema deleted successfully' });
    }
    await Cinema.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Cinema deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema
};
