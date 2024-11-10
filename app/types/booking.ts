export type Booking = {
    id: string;
    venueId: string;
    venueName: string;
    date: string;
    timeSlot: string;
    status: 'confirmed' | 'cancelled';
    userId: string;
  };
  
  export type BookingContextType = {
    bookings: Booking[];
    addBooking: (booking: Omit<Booking, 'id'>) => void;
    cancelBooking: (bookingId: string) => void;
  };