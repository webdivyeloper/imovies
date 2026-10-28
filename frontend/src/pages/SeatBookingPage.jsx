import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showtimesAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import SeatGrid from '../components/SeatGrid';
import {
  Film,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  CreditCard,
  Popcorn,
  Coffee,
  CheckCircle2,
  AlertCircle,
  Coins,
  ChevronLeft
} from 'lucide-react';

const CONCESSION_ITEMS = [
  { id: 'popcorn', name: 'Caramel & Butter Popcorn (Large)', price: 6.50, icon: '🍿' },
  { id: 'soda', name: 'Fountain Soda (Large)', price: 4.00, icon: '🥤' },
  { id: 'nachos', name: 'Cheesy Loaded Nachos', price: 5.50, icon: '🧀' }
];

const SeatBookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const {
    selectedSeats,
    toggleSeat,
    clearSeats,
    setLatestConfirmedBooking
  } = useBooking();

  const [showtime, setShowtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Concessions state
  const [concessionQty, setConcessionQty] = useState({ popcorn: 0, soda: 0, nachos: 0 });
  const [applyCredits, setApplyCredits] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Simulated)');

  useEffect(() => {
    // Clear previously selected seats on page load
    clearSeats();

    const fetchShowtime = async () => {
      try {
        setLoading(true);
        const res = await showtimesAPI.getById(showtimeId);
        if (res.data.success) {
          setShowtime(res.data.data);
        }
      } catch (err) {
        setError('Failed to load showtime details.');
      } finally {
        setLoading(false);
      }
    };

    fetchShowtime();
  }, [showtimeId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Loading auditorium layout...</span>
        </div>
      </div>
    );
  }

  if (error || !showtime) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">{error || 'Showtime not found'}</h4>
        <button onClick={() => navigate('/')} className="btn btn-outline-light mt-3">Back to Movies</button>
      </div>
    );
  }

  const movie = showtime.movie || {};
  const cinema = showtime.cinema || {};

  // Calculations
  const seatsSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const snacksTotal =
    concessionQty.popcorn * 6.50 +
    concessionQty.soda * 4.00 +
    concessionQty.nachos * 5.50;
  const bookingFee = selectedSeats.length > 0 ? 2.50 : 0;
  const creditsDiscount = applyCredits && user?.credits >= 50 ? 5.00 : 0;
  const grandTotal = Math.max(0, seatsSubtotal + snacksTotal + bookingFee - creditsDiscount);

  const handleConcessionChange = (id, delta) => {
    setConcessionQty((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  const handleProceedBooking = async () => {
    setBookingError('');

    if (selectedSeats.length === 0) {
      setBookingError('Please select at least one seat from the cinema auditorium.');
      return;
    }

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await bookingsAPI.create({
        showtimeId: showtime._id,
        seats: selectedSeats,
        paymentMethod
      });

      if (res.data.success) {
        setLatestConfirmedBooking(res.data.data);
        navigate(`/confirmation/${res.data.data._id}`);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError(
        err.response?.data?.message || 'Booking reservation failed. Please try choosing another seat.'
      );
      // Refresh showtime in case seats were taken
      const refreshRes = await showtimesAPI.getById(showtimeId);
      if (refreshRes.data.success) {
        setShowtime(refreshRes.data.data);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Top Breadcrumb & Movie Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <button
          onClick={() => navigate(`/movies/${movie._id}`)}
          className="btn btn-sm btn-dark text-secondary d-inline-flex align-items-center gap-1.5 border border-secondary border-opacity-50 rounded-pill px-3 py-1"
        >
          <ChevronLeft size={16} />
          <span>Change Movie / Showtime</span>
        </button>

        <div className="d-flex align-items-center gap-3 text-secondary small">
          <span className="d-flex align-items-center gap-1 text-light">
            <Film size={14} className="text-primary" />
            <strong>{movie.title}</strong>
          </span>
          <span>•</span>
          <span className="d-flex align-items-center gap-1">
            <Calendar size={14} className="text-warning" />
            {showtime.showDate}
          </span>
          <span>•</span>
          <span className="d-flex align-items-center gap-1 text-success fw-bold">
            <Clock size={14} />
            {showtime.showTime}
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Interactive Screen & Seat Layout */}
        <div className="col-lg-8">
          <div className="glass-card p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-3 mb-2">
              <div>
                <h5 className="fw-bold text-white mb-0 brand-font">Select Auditorium Seats</h5>
                <span className="text-secondary small">{showtime.screenName || 'Screen 1 (Dolby Atmos)'}</span>
              </div>
              <div className="text-end">
                <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50 small">
                  Max 10 Seats
                </span>
              </div>
            </div>

            {/* Error banner if concurrency collision */}
            {bookingError && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 my-3" role="alert">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Interactive Seat Grid */}
            <SeatGrid
              showtime={showtime}
              selectedSeats={selectedSeats}
              onToggleSeat={toggleSeat}
            />

            {/* Concessions / Snack Add-ons */}
            <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
              <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                <span>🍿</span>
                <span>Enhance Your Cinema Experience (Optional Snacks)</span>
              </h6>

              <div className="row g-3">
                {CONCESSION_ITEMS.map((item) => (
                  <div key={item.id} className="col-md-4">
                    <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-40 d-flex flex-column justify-content-between h-100">
                      <div>
                        <div className="fs-3 mb-1">{item.icon}</div>
                        <h6 className="text-light fw-semibold small mb-1">{item.name}</h6>
                        <span className="text-primary fw-bold small">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top border-secondary border-opacity-25">
                        <button
                          type="button"
                          onClick={() => handleConcessionChange(item.id, -1)}
                          disabled={concessionQty[item.id] === 0}
                          className="btn btn-sm btn-dark border border-secondary border-opacity-50 px-2.5 py-0.5"
                        >
                          -
                        </button>
                        <span className="fw-bold text-light small">{concessionQty[item.id]}</span>
                        <button
                          type="button"
                          onClick={() => handleConcessionChange(item.id, 1)}
                          className="btn btn-sm btn-dark border border-secondary border-opacity-50 px-2.5 py-0.5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div className="col-lg-4">
          <div className="glass-card p-4 sticky-top" style={{ top: '80px' }}>
            <h5 className="fw-bold text-white brand-font mb-3 d-flex align-items-center gap-2">
              <Ticket size={20} className="text-primary" />
              <span>Booking Summary</span>
            </h5>

            {/* Movie card snippet */}
            <div className="d-flex gap-3 mb-3 pb-3 border-bottom border-secondary border-opacity-25">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-2 shadow"
                style={{ width: '60px', height: '85px', objectFit: 'cover' }}
              />
              <div className="d-flex flex-column justify-content-center">
                <h6 className="fw-bold text-white mb-1 small">{movie.title}</h6>
                <span className="text-secondary small d-flex align-items-center gap-1">
                  <MapPin size={12} className="text-danger" />
                  {cinema.name}
                </span>
                <span className="text-light small mt-1 font-monospace">
                  {showtime.showDate} | {showtime.showTime}
                </span>
              </div>
            </div>

            {/* Selected Seats Chips */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1.5">
                <span className="text-secondary small">Selected Seats:</span>
                <span className="badge bg-primary">{selectedSeats.length} seats</span>
              </div>

              {selectedSeats.length > 0 ? (
                <div className="d-flex flex-wrap gap-1.5 p-2 rounded-2 bg-dark border border-secondary border-opacity-40">
                  {selectedSeats.map((s) => (
                    <span key={s.seatNumber} className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 small">
                      {s.seatNumber} ({s.tier} - ${s.price})
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-2 rounded-2 bg-dark border border-secondary border-opacity-25 text-center text-secondary small">
                  No seats selected yet. Click on available auditorium seats.
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="small text-secondary mb-3 pb-3 border-bottom border-secondary border-opacity-25 d-flex flex-column gap-1.5">
              <div className="d-flex justify-content-between">
                <span>Tickets Subtotal:</span>
                <span className="text-light fw-semibold">${seatsSubtotal.toFixed(2)}</span>
              </div>
              {snacksTotal > 0 && (
                <div className="d-flex justify-content-between text-info">
                  <span>Concessions &amp; Snacks:</span>
                  <span>+${snacksTotal.toFixed(2)}</span>
                </div>
              )}
              {selectedSeats.length > 0 && (
                <div className="d-flex justify-content-between">
                  <span>Convenience &amp; Booking Fee:</span>
                  <span className="text-light fw-semibold">${bookingFee.toFixed(2)}</span>
                </div>
              )}
              {applyCredits && (
                <div className="d-flex justify-content-between text-success">
                  <span>Loyalty Discount (50 Credits):</span>
                  <span>-${creditsDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Credits loyalty toggle */}
            {user && user.credits >= 50 && (
              <div className="form-check form-switch mb-3 p-2 rounded-2 bg-dark border border-warning border-opacity-25">
                <input
                  className="form-check-input ms-0 me-2"
                  type="checkbox"
                  role="switch"
                  id="creditsSwitch"
                  checked={applyCredits}
                  onChange={(e) => setApplyCredits(e.target.checked)}
                />
                <label className="form-check-label text-light small d-flex align-items-center gap-1" htmlFor="creditsSwitch">
                  <Coins size={14} className="text-warning" />
                  <span>Redeem 50 Credits for $5.00 OFF</span>
                </label>
              </div>
            )}

            {/* Grand Total */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="text-light fw-bold fs-6">Grand Total:</span>
              <span className="text-success fw-extrabold fs-4 brand-font">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-4">
              <label className="form-label small text-secondary">Payment Method</label>
              <select
                className="form-select bg-dark border-secondary border-opacity-50 text-light small"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card (Simulated)">💳 Credit / Debit Card (Instant)</option>
                <option value="Google Pay / Apple Pay">📱 Google Pay / Apple Pay</option>
                <option value="UPI / Net Banking">🏦 Net Banking / UPI</option>
              </select>
            </div>

            {/* CTA Book Button */}
            <button
              onClick={handleProceedBooking}
              disabled={selectedSeats.length === 0 || bookingLoading}
              className="btn btn-cinema-primary w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg"
            >
              {bookingLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  <span>Reserving Seats...</span>
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>{isAuthenticated ? 'Pay & Confirm Tickets' : 'Sign In to Book Seats'}</span>
                </>
              )}
            </button>

            <p className="text-secondary text-center small mt-2 mb-0" style={{ fontSize: '0.72rem' }}>
              🔒 256-Bit SSL Encrypted • Real-time Reservation Lock
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBookingPage;

