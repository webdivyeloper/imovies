const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const mockStore = require('../models/mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all movies with filters and search
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const { status, genre, search, featured } = req.query;

    if (!isDbConnected()) {
      let filtered = [...mockStore.movies];
      if (status) filtered = filtered.filter(m => m.status === status);
      if (featured === 'true') filtered = filtered.filter(m => m.isFeatured);
      if (genre && genre !== 'All') {
        filtered = filtered.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
      }
      if (search && search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter(m =>
          m.title.toLowerCase().includes(s) ||
          m.director?.toLowerCase().includes(s) ||
          m.cast?.some(c => c.name.toLowerCase().includes(s))
        );
      }
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    let query = {};
    if (status) query.status = status;
    if (featured === 'true') query.isFeatured = true;
    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { director: { $regex: search.trim(), $options: 'i' } },
        { 'cast.name': { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1 });
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID with showtimes
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const movie = mockStore.movies.find(m => m._id === req.params.id);
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }
      const showtimes = mockStore.showtimes
        .filter(st => st.movie === movie._id)
        .map(st => ({
          ...st,
          cinema: mockStore.cinemas.find(c => c._id === st.cinema)
        }));
      return res.json({ success: true, data: { movie, showtimes } });
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const showtimes = await Showtime.find({ movie: movie._id })
      .populate('cinema', 'name city address amenities screens')
      .sort({ showDate: 1, showTime: 1 });

    res.json({ success: true, data: { movie, showtimes } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private (Admin)
const createMovie = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const movie = { ...req.body, _id: Date.now().toString() };
      mockStore.movies.unshift(movie);
      return res.status(201).json({ success: true, data: movie });
    }

    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private (Admin)
const updateMovie = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const index = mockStore.movies.findIndex(m => m._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Movie not found' });
      mockStore.movies[index] = { ...mockStore.movies[index], ...req.body };
      return res.json({ success: true, data: mockStore.movies[index] });
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private (Admin)
const deleteMovie = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      mockStore.movies = mockStore.movies.filter(m => m._id !== req.params.id);
      return res.json({ success: true, message: 'Movie deleted successfully' });
    }

    await Showtime.deleteMany({ movie: req.params.id });
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured movies
// @route   GET /api/movies/featured
// @access  Public
const getFeaturedMovies = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const featured = mockStore.movies.filter(m => m.isFeatured);
      return res.json({ success: true, count: featured.length, data: featured });
    }
    const featured = await Movie.find({ isFeatured: true }).limit(5);
    res.json({ success: true, count: featured.length, data: featured });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getFeaturedMovies
};
