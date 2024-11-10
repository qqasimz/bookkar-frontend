import React, { createContext, useContext, useState } from 'react';
import { Booking, BookingContextType } from '../types/booking';

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (newBooking: Omit<Booking, 'id'>) => {
    const booking: Booking = {
      ...newBooking,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
    };
    setBookings((prev) => [...prev, booking]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' as const }
          : booking
      )
    );
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};