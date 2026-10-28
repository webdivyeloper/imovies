import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { bookingsAPI } from '../services/api';
import TicketModal from '../components/TicketModal';
import { CheckCircle2, Ticket, Home, Printer, MapPin, Calendar, Clock, Film } from 'lucide-react';

const BookingConfirmationPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await bookingsAPI.getById(id);
        if (res.data.success) {
          setBooking(res.data.data);
        }
      } catch (err) {
        setError('Could not retrieve booking confirmation.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Loading confirmation...</span>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">{error || 'Booking not found'}</h4>
        <Link to="/" className="btn btn-outline-light mt-3">Back to Movies</Link>
      </div>
    );
  }

  const movie = booking.movie || {};
  const cinema = booking.cinema || {};
  const showtime = booking.showtime || {};

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          {/* Success Banner */}
          <div className="text-center mb-4">
            <div className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-20 text-success mb-3 shadow">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="fw-bold text-white brand-font mb-1">Booking Confirmed!</h2>
            <p className="text-secondary small">
              Your movie reservation is secure. An electronic confirmation has been generated below.
            </p>
            <span className="badge bg-primary px-3 py-1.5 font-monospace fs-6">
              BOOKING REF: {booking.bookingReference}
            </span>
          </div>

          {/* Ticket Card Summary */}
          <div className="ticket-container p-4 text-light mb-4">
            <div className="ticket-notch-left" />
            <div className="ticket-notch-right" />

            <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-3 mb-3">
              <div>
                <h5 className="fw-bold text-white mb-0 brand-font">{movie.title}</h5>
                <span className="text-secondary small">{movie.genre?.join(', ') || 'Movie'}</span>
              </div>
              <div className="text-end">
                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                  PAID &amp; CONFIRMED
                </span>
              </div>
            </div>

            <div className="row g-3 small mb-3">
              <div className="col-6">
                <span className="text-secondary d-block">Cinema Location</span>
                <strong className="text-light d-flex align-items-center gap-1">
                  <MapPin size={13} className="text-danger flex-shrink-0" />
                  <span className="text-truncate">{cinema.name}</span>
                </strong>
                <span className="text-secondary" style={{ fontSize: '0.72rem' }}>{cinema.city}</span>
              </div>

              <div className="col-6">
                <span className="text-secondary d-block">Auditorium / Screen</span>
                <strong className="text-light d-flex align-items-center gap-1">
                  <Film size={13} className="text-primary flex-shrink-0" />
                  <span>{showtime.screenName || 'Screen 1'}</span>
                </strong>
              </div>

              <div className="col-6">
                <span className="text-secondary d-block">Date</span>
                <strong className="text-light d-flex align-items-center gap-1">
                  <Calendar size={13} className="text-warning flex-shrink-0" />
                  <span>{showtime.showDate}</span>
                </strong>
              </div>

              <div className="col-6">
                <span className="text-secondary d-block">Time</span>
                <strong className="text-light d-flex align-items-center gap-1">
                  <Clock size={13} className="text-success flex-shrink-0" />
                  <span>{showtime.showTime}</span>
                </strong>
              </div>
            </div>

            <div className="ticket-perforated-line" />

            <div className="d-flex justify-content-between align-items-center pt-1">
              <div>
                <span className="text-secondary small d-block mb-1">Seats Booked ({booking.seats?.length}):</span>
                <div className="d-flex flex-wrap gap-1.5 mb-2">
                  {booking.seats?.map((s, idx) => (
                    <span key={idx} className="badge bg-primary px-2.5 py-1 fw-bold fs-6">
                      {typeof s === 'string' ? s : s.seatNumber}
                    </span>
                  ))}
                </div>
                <div className="small text-secondary">
                  Total Paid: <span className="text-success fw-bold">${booking.totalAmount?.toFixed(2)}</span> via {booking.paymentMethod}
                </div>
              </div>

              <div className="text-center">
                {booking.qrCode && (
                  <img src={booking.qrCode} alt="Ticket QR" style={{ width: '90px', height: '90px', backgroundColor: '#fff', padding: '4px', borderRadius: '8px' }} />
                )}
                <span className="text-secondary font-monospace d-block mt-1" style={{ fontSize: '0.65rem' }}>
                  GATE PASS
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="btn btn-cinema-primary px-4 py-2.5 d-flex align-items-center gap-2"
            >
              <Printer size={18} />
              <span>View &amp; Print E-Ticket</span>
            </button>
            <Link
              to="/my-bookings"
              className="btn btn-outline-light px-4 py-2.5 d-flex align-items-center gap-2"
            >
              <Ticket size={18} />
              <span>Go to My Bookings</span>
            </Link>
            <Link
              to="/"
              className="btn btn-dark border-secondary border-opacity-50 px-4 py-2.5 d-flex align-items-center gap-2"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <TicketModal
          booking={booking}
          onClose={() => setIsTicketModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingConfirmationPage;

