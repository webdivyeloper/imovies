import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TicketModal from '../components/TicketModal';
import { Ticket, Film, Calendar, Clock, MapPin, AlertCircle, XCircle, Printer } from 'lucide-react';

const MyBookingsPage = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('confirmed'); // 'confirmed' | 'cancelled'
  const [activeTicket, setActiveTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsAPI.getMyBookings();
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      setError('Could not load your ticket history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket reservation? Your reserved seats will be released immediately.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await bookingsAPI.cancel(bookingId);
      if (res.data.success) {
        // Refresh bookings
        await fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5 max-w-md mx-auto" style={{ maxWidth: '480px' }}>
          <Ticket size={48} className="text-primary mb-3" />
          <h4 className="fw-bold text-white brand-font mb-2">Sign In to View Your Tickets</h4>
          <p className="text-secondary small mb-4">
            Access your active cinema reservations, download tickets, or manage bookings.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="btn btn-cinema-primary px-4 py-2"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-white brand-font mb-1 d-flex align-items-center gap-2">
            <Ticket size={28} className="text-primary" />
            <span>My Movie Tickets</span>
          </h2>
          <p className="text-secondary small mb-0">
            Manage your movie tickets, access gate passes, and view admission receipts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="btn-group p-1 bg-dark rounded-pill border border-secondary border-opacity-50">
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${
              activeTab === 'confirmed' ? 'btn-primary' : 'btn-dark text-secondary'
            }`}
          >
            Active Tickets ({bookings.filter((b) => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${
              activeTab === 'cancelled' ? 'btn-primary' : 'btn-dark text-secondary'
            }`}
          >
            Cancelled / Refunded ({bookings.filter((b) => b.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading tickets...</span>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="glass-card text-center py-5 px-3">
          <Ticket size={48} className="text-secondary opacity-40 mb-3" />
          <h5 className="text-white fw-bold">No {activeTab} bookings found</h5>
          <p className="text-secondary small mb-4">
            {activeTab === 'confirmed'
              ? 'You do not have any upcoming showtimes reserved.'
              : 'You have no cancelled tickets.'}
          </p>
          <Link to="/" className="btn btn-cinema-primary px-4 py-2">
            Explore Now Showing Movies
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {filteredBookings.map((b) => {
            const movie = b.movie || {};
            const cinema = b.cinema || {};
            const showtime = b.showtime || {};

            return (
              <div key={b._id} className="col-lg-6">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    {/* Header with Reference & Status */}
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                      <span className="font-monospace small text-secondary">
                        REF: <strong className="text-light">{b.bookingReference}</strong>
                      </span>
                      <span
                        className={`badge ${
                          b.status === 'confirmed'
                            ? 'bg-success bg-opacity-25 text-success border border-success border-opacity-50'
                            : 'bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50'
                        }`}
                      >
                        {b.status?.toUpperCase()}
                      </span>
                    </div>

                    {/* Movie info & Poster */}
                    <div className="d-flex gap-3 mb-3">
                      <img
                        src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=200&q=80'}
                        alt={movie.title}
                        className="rounded-2 shadow"
                        style={{ width: '70px', height: '100px', objectFit: 'cover' }}
                      />
                      <div>
                        <h5 className="fw-bold text-white mb-1 brand-font">{movie.title || 'Movie'}</h5>
                        <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                          <MapPin size={13} className="text-danger flex-shrink-0" />
                          <span>{cinema.name || 'IMovies Theater'}</span>
                        </div>
                        <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                          <Film size={13} className="text-primary flex-shrink-0" />
                          <span>{showtime.screenName || 'Screen 1 (Dolby)'}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 text-light small font-monospace">
                          <span className="d-flex align-items-center gap-1">
                            <Calendar size={13} className="text-warning" />
                            {showtime.showDate}
                          </span>
                          <span>•</span>
                          <span className="d-flex align-items-center gap-1 text-success fw-bold">
                            <Clock size={13} />
                            {showtime.showTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Seats & Price */}
                    <div className="p-2.5 rounded-2 bg-dark border border-secondary border-opacity-40 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-secondary small">Seats Reserved:</span>
                        <div className="d-flex flex-wrap gap-1">
                          {b.seats?.map((seat, idx) => (
                            <span key={idx} className="badge bg-primary px-2 py-0.5 small">
                              {typeof seat === 'string' ? seat : seat.seatNumber}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center text-secondary small">
                        <span>Total Paid:</span>
                        <span className="text-success fw-bold fs-6">${b.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="d-flex gap-2 justify-content-end pt-2 border-top border-secondary border-opacity-25">
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        disabled={cancellingId === b._id}
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1.5 px-3 py-1.5"
                      >
                        <XCircle size={15} />
                        <span>{cancellingId === b._id ? 'Cancelling...' : 'Cancel Reservation'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTicket(b)}
                      className="btn btn-cinema-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-1.5"
                    >
                      <Printer size={15} />
                      <span>View E-Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal */}
      {activeTicket && (
        <TicketModal
          booking={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;

