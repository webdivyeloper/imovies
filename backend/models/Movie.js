const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a movie title'],
    trim: true
  },
  tagline: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Please add movie description']
  },
  posterUrl: {
    type: String,
    required: [true, 'Please provide a poster image URL']
  },
  backdropUrl: {
    type: String,
    required: [true, 'Please provide a backdrop image URL']
  },
  trailerUrl: {
    type: String,
    default: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  genre: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number, // duration in minutes
    required: [true, 'Please provide movie duration in minutes']
  },
  rating: {
    type: Number,
    default: 8.5
  },
  censorRating: {
    type: String,
    default: 'UA' // UA, PG-13, R, A, U
  },
  languages: [{
    type: String,
    default: ['English']
  }],
  releaseDate: {
    type: Date,
    required: true
  },
  director: {
    type: String,
    default: ''
  },
  cast: [{
    name: String,
    role: String,
    image: String
  }],
  status: {
    type: String,
    enum: ['now_showing', 'upcoming'],
    default: 'now_showing'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);

