const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add cinema name'],
    trim: true
  },
  chain: {
    type: String,
    default: 'IMovies Cinemas'
  },
  city: {
    type: String,
    required: true,
    default: 'New York'
  },
  address: {
    type: String,
    required: true
  },
  screens: [{
    screenNumber: Number,
    name: String,
    screenType: {
      type: String,
      enum: ['IMAX 3D', 'Dolby Atmos', '4K Laser', 'Standard 2D'],
      default: 'Dolby Atmos'
    },
    totalSeats: {
      type: Number,
      default: 80
    }
  }],
  amenities: [{
    type: String
  }],
  phone: {
    type: String,
    default: '+1 (800) 555-FILM'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cinema', cinemaSchema);

