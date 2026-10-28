const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const mockStore = require('../models/mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateBookingRef = () => {
  const prefix = 'IMOV';
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timePart = Date.now().toString().slice(-4);
  return `${prefix}-${randomPart}${timePart}`;
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { showtimeId, seats, paymentMethod } = req.body;

    if (!showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select valid seats and a showtime' });
    }

    if (!isDbConnected()) {
      const showtime = mockStore.showtimes.find(s => s._id === showtimeId);
      if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found' });

      const requestedSeatNumbers = seats.map(s => typeof s === 'string' ? s : s.seatNumber);
      const alreadyBooked = requestedSeatNumbers.some(seat => showtime.bookedSeats.includes(seat));
      if (alreadyBooked) {
        return res.status(400).json({
          success: false,
          message: 'One or more selected seats were just reserved. Please choose alternative seats.'
        });
      }

      const formattedSeats = requestedSeatNumbers.map(seatNum => {
        const row = seatNum.charAt(0).toUpperCase();
        let tier = 'Standard';
        let price = showtime.prices.Standard || 12;
        if (row === 'A' || row === 'B') {
          tier = 'VIP';
          price = showtime.prices.VIP || 22;
        } else if (['C', 'D', 'E'].includes(row)) {
          tier = 'Premium';
          price = showtime.prices.Premium || 16;
        }
        return { seatNumber: seatNum, tier, price };
      });

      const subtotal = formattedSeats.reduce((sum, s) => sum + s.price, 0);
      const bookingFee = 2.50;
      const totalAmount = subtotal + bookingFee;
      const bookingRef = generateBookingRef();

      showtime.bookedSeats.push(...requestedSeatNumbers);

      const booking = {
        _id: Date.now().toString(),
        bookingReference: bookingRef,
        user: req.user?._id || 'mock_user_1',
        movie: mockStore.movies.find(m => m._id === showtime.movie),
        cinema: mockStore.cinemas.find(c => c._id === showtime.cinema),
        showtime: {
          _id: showtime._id,
          showDate: showtime.showDate,
          showTime: showtime.showTime,
          screenName: showtime.screenName,
          screenType: showtime.screenType
        },
        seats: formattedSeats,
        subtotal,
        bookingFee,
        totalAmount,
        status: 'confirmed',
        paymentMethod: paymentMethod || 'Credit Card (Simulated)',
        paymentStatus: 'completed',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${bookingRef}`,
        createdAt: new Date()
      };

      mockStore.bookings.unshift(booking);
      return res.status(201).json({ success: true, data: booking });
    }

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found' });

    const requestedSeatNumbers = seats.map(s => typeof s === 'string' ? s : s.seatNumber);
    const alreadyBooked = requestedSeatNumbers.some(seat => showtime.bookedSeats.includes(seat));
    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected seats were just reserved. Please choose alternative seats.'
      });
    }

    const formattedSeats = requestedSeatNumbers.map(seatNum => {
      const row = seatNum.charAt(0).toUpperCase();
      let tier = 'Standard';
      let price = showtime.prices.Standard || 10;
      if (row === 'A' || row === 'B') {
        tier = 'VIP';
        price = showtime.prices.VIP || 20;
      } else if (['C', 'D', 'E'].includes(row)) {
        tier = 'Premium';
        price = showtime.prices.Premium || 15;
      }
      return { seatNumber: seatNum, tier, price };
    });

    const subtotal = formattedSeats.reduce((sum, s) => sum + s.price, 0);
    const bookingFee = 2.50;
    const totalAmount = subtotal + bookingFee;
    const bookingRef = generateBookingRef();

    showtime.bookedSeats.push(...requestedSeatNumbers);
    await showtime.save();

    const booking = await Booking.create({
      bookingReference: bookingRef,
      user: req.user._id,
      movie: showtime.movie,
      cinema: showtime.cinema,
      showtime: showtime._id,
      seats: formattedSeats,
      subtotal,
      bookingFee,
      totalAmount,
      status: 'confirmed',
      paymentMethod: paymentMethod || 'Credit Card (Simulated)',
      paymentStatus: 'completed',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${bookingRef}`
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl duration censorRating genre rating')
      .populate('cinema', 'name city address screens')
      .populate('showtime', 'showDate showTime screenName screenType');

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, count: mockStore.bookings.length, data: mockStore.bookings });
    }

    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl duration censorRating genre rating')
      .populate('cinema', 'name city address')
      .populate('showtime', 'showDate showTime screenName screenType')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID or reference
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const booking = mockStore.bookings.find(b => b._id === req.params.id || b.bookingReference === req.params.id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      return res.json({ success: true, data: booking });
    }

    const isRef = req.params.id.startsWith('IMOV-');
    const query = isRef ? { bookingReference: req.params.id } : { _id: req.params.id };

    const booking = await Booking.findOne(query)
      .populate('movie', 'title posterUrl backdropUrl duration censorRating genre rating')
      .populate('cinema', 'name city address phone')
      .populate('showtime', 'showDate showTime screenName screenType')
      .populate('user', 'name email phone');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking & release seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const booking = mockStore.bookings.find(b => b._id === req.params.id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
      booking.status = 'cancelled';
      booking.paymentStatus = 'refunded';

      const showtime = mockStore.showtimes.find(s => s._id === booking.showtime?._id);
      if (showtime) {
        const toRemove = booking.seats.map(s => s.seatNumber);
        showtime.bookedSeats = showtime.bookedSeats.filter(s => !toRemove.includes(s));
      }
      return res.json({ success: true, message: 'Booking cancelled and seats released', data: booking });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const showtime = await Showtime.findById(booking.showtime);
    if (showtime) {
      const seatNumbersToRemove = booking.seats.map(s => s.seatNumber);
      showtime.bookedSeats = showtime.bookedSeats.filter(s => !seatNumbersToRemove.includes(s));
      await showtime.save();
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled and seats released', data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin dashboard)
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const totalRev = mockStore.bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      const totalTix = mockStore.bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.seats?.length || 0), 0);

      return res.json({
        success: true,
        count: mockStore.bookings.length,
        metrics: {
          totalRevenue: Math.round(totalRev * 100) / 100,
          totalTicketsSold: totalTix,
          totalBookings: mockStore.bookings.length,
          activeBookings: mockStore.bookings.filter(b => b.status === 'confirmed').length
        },
        data: mockStore.bookings
      });
    }

    const bookings = await Booking.find()
      .populate('movie', 'title posterUrl')
      .populate('cinema', 'name city')
      .populate('showtime', 'showDate showTime screenName')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const totalTicketsSold = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.seats.length, 0);

    res.json({
      success: true,
      count: bookings.length,
      metrics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalTicketsSold,
        totalBookings: bookings.length,
        activeBookings: bookings.filter(b => b.status === 'confirmed').length
      },
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
};
