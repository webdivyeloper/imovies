import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [concessions, setConcessions] = useState([]);
  const [latestConfirmedBooking, setLatestConfirmedBooking] = useState(null);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.seatNumber === seat.seatNumber);
      if (exists) {
        return prev.filter((s) => s.seatNumber !== seat.seatNumber);
      } else {
        // Max 10 seats per booking
        if (prev.length >= 10) {
          alert('You can select a maximum of 10 seats per booking.');
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  const clearSeats = () => {
    setSelectedSeats([]);
  };

  const clearBooking = () => {
    setSelectedMovie(null);
    setSelectedCinema(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setConcessions([]);
  };

  // Pricing calculations
  const seatsSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const concessionsSubtotal = concessions.reduce((sum, c) => sum + (c.price * c.qty), 0);
  const bookingFee = selectedSeats.length > 0 ? 2.50 : 0;
  const totalAmount = seatsSubtotal + concessionsSubtotal + bookingFee;

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        setSelectedMovie,
        selectedCinema,
        setSelectedCinema,
        selectedShowtime,
        setSelectedShowtime,
        selectedSeats,
        setSelectedSeats,
        toggleSeat,
        clearSeats,
        concessions,
        setConcessions,
        seatsSubtotal,
        concessionsSubtotal,
        bookingFee,
        totalAmount,
        clearBooking,
        latestConfirmedBooking,
        setLatestConfirmedBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);

