const mongoose = require('mongoose');
const Showtime = require('../models/Showtime');
const mockStore = require('../models/mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get showtimes with filters
// @route   GET /api/showtimes
// @access  Public
const getShowtimes = async (req, res, next) => {
  try {
    const { movieId, cinemaId, date } = req.query;

    if (!isDbConnected()) {
      let filtered = [...mockStore.showtimes];
      if (movieId) filtered = filtered.filter(st => st.movie === movieId);
      if (cinemaId) filtered = filtered.filter(st => st.cinema === cinemaId);
      if (date) filtered = filtered.filter(st => st.showDate === date);

      const populated = filtered.map(st => ({
        ...st,
        movie: mockStore.movies.find(m => m._id === st.movie),
        cinema: mockStore.cinemas.find(c => c._id === st.cinema)
      }));

      return res.json({ success: true, count: populated.length, data: populated });
    }

    let query = {};
    if (movieId) query.movie = movieId;
    if (cinemaId) query.cinema = cinemaId;
    if (date) query.showDate = date;

    const showtimes = await Showtime.find(query)
      .populate('movie', 'title posterUrl duration censorRating genre rating')
      .populate('cinema', 'name city address amenities')
      .sort({ showDate: 1, showTime: 1 });

    res.json({ success: true, count: showtimes.length, data: showtimes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single showtime with real-time seat availability
// @route   GET /api/showtimes/:id
// @access  Public
const getShowtimeById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const st = mockStore.showtimes.find(s => s._id === req.params.id);
      if (!st) return res.status(404).json({ success: false, message: 'Showtime not found' });

      const populated = {
        ...st,
        movie: mockStore.movies.find(m => m._id === st.movie),
        cinema: mockStore.cinemas.find(c => c._id === st.cinema)
      };
      return res.json({ success: true, data: populated });
    }

    const showtime = await Showtime.findById(req.params.id)
      .populate('movie', 'title posterUrl backdropUrl duration censorRating genre rating')
      .populate('cinema', 'name city address screenType amenities');

    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    res.json({ success: true, data: showtime });
  } catch (error) {
    next(error);
  }
};

const createShowtime = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const showtime = {
        _id: Date.now().toString(),
        ...req.body,
        bookedSeats: []
      };
      mockStore.showtimes.push(showtime);
      return res.status(201).json({ success: true, data: showtime });
    }

    const showtime = await Showtime.create(req.body);
    res.status(201).json({ success: true, data: showtime });
  } catch (error) {
    next(error);
  }
};

const deleteShowtime = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      mockStore.showtimes = mockStore.showtimes.filter(s => s._id !== req.params.id);
      return res.json({ success: true, message: 'Showtime deleted successfully' });
    }
    await Showtime.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Showtime deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  deleteShowtime
};
