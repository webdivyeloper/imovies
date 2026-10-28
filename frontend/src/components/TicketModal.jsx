import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Printer, X, Film, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';

const TicketModal = ({ booking, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const printRef = useRef();

  useEffect(() => {
    if (booking?.bookingReference) {
      QRCode.toDataURL(booking.bookingReference, {
        width: 160,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error(err));
    }
  }, [booking]);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const movie = booking.movie || {};
  const cinema = booking.cinema || {};
  const showtime = booking.showtime || {};

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1070 }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
        <div className="modal-content bg-transparent border-0">
          {/* Modal Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2 text-success">
              <CheckCircle2 size={20} />
              <span className="fw-bold text-light">Official Movie Ticket Pass</span>
            </div>
            <button
              onClick={onClose}
              className="btn btn-dark btn-sm rounded-circle p-1.5 border border-secondary"
            >
              <X size={18} className="text-light" />
            </button>
          </div>

          {/* Printable Ticket Container */}
          <div ref={printRef} className="ticket-container p-4 text-light">
            <div className="ticket-notch-left" />
            <div className="ticket-notch-right" />

            {/* Header info */}
            <div className="d-flex justify-content-between align-items-start border-bottom border-secondary border-opacity-25 pb-3 mb-3">
              <div>
                <span className="badge bg-primary px-2 py-0.5 small mb-1">IMOVIES ADMISSION</span>
                <h5 className="fw-bold mb-0 text-white brand-font">{movie.title || 'Movie'}</h5>
                <span className="text-secondary small">{movie.genre?.join(', ') || 'Feature Film'}</span>
              </div>
              <div className="text-end">
                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                  {booking.status?.toUpperCase() || 'CONFIRMED'}
                </span>
                <p className="font-monospace small text-secondary mt-1 mb-0">
                  REF: {booking.bookingReference}
                </p>
              </div>
            </div>

            {/* Movie details grid */}
            <div className="row g-3 small mb-3">
              <div className="col-6">
                <span className="text-secondary d-block">Cinema Complex</span>
                <strong className="text-light d-flex align-items-center gap-1">
                  <MapPin size={13} className="text-primary flex-shrink-0" />
                  <span className="text-truncate">{cinema.name || 'IMovies Luxe'}</span>
                </strong>
                <span className="text-secondary" style={{ fontSize: '0.72rem' }}>{cinema.city || 'New York'}</span>
              </div>

              <div className="col-6">
                <span className="text-secondary d-block">Screen &amp; Format</span>
                <strong className="text-light d-flex align-items-center gap-1">
                  <Film size={13} className="text-info flex-shrink-0" />
                  <span>{showtime.screenName || 'Screen 1 (Dolby)'}</span>
                </strong>
              </div>

              <div className="col-6">
                <span className="text-secondary d-block">Show Date</span>
                <strong className="text-light d-flex align-items-center gap-1">
                  <Calendar size={13} className="text-warning flex-shrink-0" />
                  <span>{showtime.showDate || 'Today'}</span>
                </strong>
              </div>

              <div className="col-6">
                <span className="text-secondary d-block">Show Time</span>
                <strong className="text-light d-flex align-items-center gap-1">
                  <Clock size={13} className="text-success flex-shrink-0" />
                  <span>{showtime.showTime || '07:00 PM'}</span>
                </strong>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="ticket-perforated-line" />

            {/* Seats & QR Barcode Section */}
            <div className="d-flex justify-content-between align-items-center pt-1">
              <div>
                <span className="text-secondary small d-block mb-1">Seats Reserved ({booking.seats?.length || 0})</span>
                <div className="d-flex flex-wrap gap-1.5 mb-2">
                  {booking.seats?.map((seat, idx) => (
                    <span key={idx} className="badge bg-primary px-2.5 py-1 fw-bold fs-6">
                      {typeof seat === 'string' ? seat : seat.seatNumber}
                    </span>
                  ))}
                </div>
                <div className="small text-secondary">
                  Total Paid: <span className="text-success fw-bold">${booking.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-2 rounded-3 text-center shadow-sm">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Ticket QR" style={{ width: '90px', height: '90px', display: 'block' }} />
                ) : (
                  <div style={{ width: '90px', height: '90px' }} className="d-flex align-items-center justify-content-center text-dark">
                    QR
                  </div>
                )}
                <span className="text-dark font-monospace" style={{ fontSize: '0.6rem', fontWeight: 700 }}>SCAN AT GATE</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="d-flex gap-2 justify-content-end mt-3">
            <button
              onClick={handlePrint}
              className="btn btn-outline-light d-flex align-items-center gap-2 px-3 py-2 rounded-2"
            >
              <Printer size={16} />
              <span>Print / Download Ticket</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-cinema-primary px-4 py-2 rounded-2"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;

