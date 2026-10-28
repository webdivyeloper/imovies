import React from 'react';
import { Lock, Check } from 'lucide-react';

const SeatGrid = ({ showtime, selectedSeats = [], onToggleSeat }) => {
  if (!showtime) return null;

  const rows = showtime.rows || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = showtime.cols || 10;
  const bookedSeats = showtime.bookedSeats || [];

  const getSeatTierAndPrice = (rowLetter) => {
    if (rowLetter === 'A' || rowLetter === 'B') {
      return { tier: 'VIP', price: showtime.prices?.VIP || 22, color: 'vip' };
    }
    if (rowLetter === 'C' || rowLetter === 'D' || rowLetter === 'E') {
      return { tier: 'Premium', price: showtime.prices?.Premium || 16, color: 'premium' };
    }
    return { tier: 'Standard', price: showtime.prices?.Standard || 12, color: 'standard' };
  };

  const isSeatBooked = (seatNum) => bookedSeats.includes(seatNum);
  const isSeatSelected = (seatNum) => selectedSeats.some((s) => s.seatNumber === seatNum);

  return (
    <div className="seat-grid-container text-center py-4 px-2">
      {/* Curved Screen Graphic */}
      <div className="cinema-screen-container mx-auto" style={{ maxWidth: '640px' }}>
        <div className="cinema-screen">
          Screen This Way
        </div>
        <p className="text-secondary small mt-2 text-uppercase tracking-wider" style={{ fontSize: '0.72rem' }}>
          All eyes towards the screen
        </p>
      </div>

      {/* Seat Rows Matrix */}
      <div className="d-flex flex-column gap-2.5 align-items-center my-4 overflow-x-auto pb-3">
        {rows.map((rowLetter) => {
          const { tier, price, color } = getSeatTierAndPrice(rowLetter);

          return (
            <div key={rowLetter} className="d-flex align-items-center gap-2">
              {/* Row Label Left */}
              <span className="text-secondary fw-bold small text-end" style={{ width: '22px' }}>
                {rowLetter}
              </span>

              {/* Seats in Row */}
              <div className="d-flex gap-2">
                {Array.from({ length: cols }, (_, i) => i + 1).map((seatIndex) => {
                  const seatNumber = `${rowLetter}${seatIndex}`;
                  const booked = isSeatBooked(seatNumber);
                  const selected = isSeatSelected(seatNumber);

                  return (
                    <React.Fragment key={seatNumber}>
                      {/* Walkway gap in middle between seats 5 and 6 */}
                      {seatIndex === 6 && <div style={{ width: '24px' }} />}

                      <div
                        onClick={() => {
                          if (!booked) {
                            onToggleSeat({ seatNumber, tier, price });
                          }
                        }}
                        className={`seat ${color} ${selected ? 'selected' : ''} ${booked ? 'booked' : ''}`}
                        title={`${seatNumber} - ${tier} ($${price}) ${booked ? '(Sold Out)' : ''}`}
                      >
                        {booked ? (
                          <Lock size={12} className="opacity-50" />
                        ) : selected ? (
                          <Check size={14} strokeWidth={3} />
                        ) : (
                          seatIndex
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <span className="text-secondary fw-bold small text-start" style={{ width: '22px' }}>
                {rowLetter}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tier Category Dividers / Pricing Legend */}
      <div className="d-flex flex-wrap justify-content-center gap-4 py-3 border-top border-secondary border-opacity-25 mt-4 small">
        <div className="d-flex align-items-center gap-2">
          <span className="seat vip" style={{ width: '20px', height: '20px', cursor: 'default' }} />
          <span className="text-light">VIP Recliners (${showtime.prices?.VIP || 22})</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat premium" style={{ width: '20px', height: '20px', cursor: 'default' }} />
          <span className="text-light">Premium (${showtime.prices?.Premium || 16})</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="seat standard" style={{ width: '20px', height: '20px', cursor: 'default' }} />
          <span className="text-light">Standard (${showtime.prices?.Standard || 12})</span>
        </div>
      </div>

      {/* Seat Status Legend */}
      <div className="d-flex flex-wrap justify-content-center gap-4 py-2 small text-secondary">
        <div className="d-flex align-items-center gap-2">
          <div className="seat standard" style={{ width: '18px', height: '18px', cursor: 'default' }} />
          <span>Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat selected" style={{ width: '18px', height: '18px', cursor: 'default' }} />
          <span className="text-light fw-medium">Your Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat booked" style={{ width: '18px', height: '18px', cursor: 'default' }} />
          <span>Reserved / Sold</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;

