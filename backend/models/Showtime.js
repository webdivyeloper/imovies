const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  screenName: {
    type: String,
    default: 'Screen 1 (Dolby Atmos)'
  },
  screenType: {
    type: String,
    default: 'Dolby Atmos'
  },
  showDate: {
    type: String, // formatted as YYYY-MM-DD
    required: true
  },
  showTime: {
    type: String, // e.g. "10:30 AM", "02:15 PM", "06:45 PM", "09:30 PM"
    required: true
  },
  prices: {
    VIP: {
      type: Number,
      default: 20
    },
    Premium: {
      type: Number,
      default: 15
    },
    Standard: {
      type: Number,
      default: 10
    }
  },
  // Seat layout configuration
  rows: {
    type: [String],
    default: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  },
  cols: {
    type: Number,
    default: 10 // Seats 1 to 10 per row
  },
  // Array of seat codes that are already booked, e.g. ["A3", "A4", "C7"]
  bookedSeats: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Showtime', showtimeSchema);

