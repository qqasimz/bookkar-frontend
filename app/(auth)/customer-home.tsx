import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import VenueCard from '../components/VenueCard';
import { BookingProvider, useBookings } from '../contexts/BookingContext';
import Notification from '../components/Notification';

type TimeSlot = {
  start: string;
  end: string;
};

type Venue = {
  id: string;
  name: string;
  location: string;
  image_url: string;
  capacity: number;
  venue_type: string;
  available_time_slots: TimeSlot[];
  price: string;
  booking_status: string;
  address: string;
  description?: string;
};

const BookingsList = () => {
  const { bookings, cancelBooking } = useBookings();
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'success' as const });

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
    setNotification({
      visible: true,
      message: 'Booking cancelled successfully',
      type: 'success',
    });
  };

  return (
    <View style={styles.bookingsSection}>
      <Text style={styles.sectionTitle}>My Bookings</Text>
      {bookings.length === 0 ? (
        <Text style={styles.placeholderText}>You don't have any bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookingItem}>
              <View style={styles.bookingDetails}>
                <Text style={styles.bookingVenueName}>{item.venueName}</Text>
                <Text style={styles.bookingInfo}>Date: {item.date}</Text>
                <Text style={styles.bookingInfo}>Time: {item.timeSlot}</Text>
                <Text
                  style={[
                    styles.bookingStatus,
                    item.status === 'confirmed' ? styles.statusConfirmed : styles.statusCancelled,
                  ]}
                >
                  Status: {item.status}
                </Text>
              </View>
              {item.status === 'confirmed' && (
                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking(item.id)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          style={styles.bookingsList}
        />
      )}
    </View>
  );
};

const CustomerHome = () => {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'success' as const,
  });
  const { addBooking } = useBookings();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('http://bookar-d951ecf6cefd.herokuapp.com/api/v1/get-all-venues');
        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }
  
        const data = await response.json();
        console.log(data); // Log full response to confirm structure
  
        // Safely access data.data.venues
        if (data.data && Array.isArray(data.data.venues)) {
          const mappedVenues = data.data.venues.map((venue: any) => ({
            id: venue.venue_id, // Map venue_id to id
            name: venue.name,
            location: venue.location,
            image_url: venue.image_url,
            capacity: Number(venue.capacity),
            venue_type: venue.venue_type,
            available_time_slots: venue.available_time_slots,
            price: venue.price,
            booking_status: venue.booking_status,
            address: venue.address,
            description: venue.description || '',
          }));
  
          setVenues(mappedVenues); // Update state
        } else {
          console.error('No venues found or venues is not an array.');
          setVenues([]); // Set an empty array if no venues found
        }
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVenues();
  }, []);
  
  
  

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (err) {
      console.error('Error signing out: ', err);
    }
  };

  const handleBooking = (venueId: string, date: string, timeSlot: string) => {
    const venue = venues.find((v) => v.id === venueId);
    if (venue) {
      addBooking({
        venueId,
        venueName: venue.name,
        date,
        timeSlot,
        status: 'confirmed',
        userId: auth.currentUser?.uid || '',
      });

      setNotification({
        visible: true,
        message: 'Booking confirmed successfully!',
        type: 'success',
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Venues</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#4E73DF" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.venueSection}>
          <Text style={styles.sectionTitle}>Venues Near You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.venueList}>
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} onBooking={handleBooking} />
            ))}
          </ScrollView>
        </View>
      )}

      <BookingsList />

      <Notification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onHide={() => setNotification((prev) => ({ ...prev, visible: false }))}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4E73DF',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorText: {
    color: '#FF5F5F',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#FF5F5F',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  venueSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  venueList: {
    paddingRight: 20,
  },
  bookingsSection: {
    padding: 20,
  },
  bookingsList: {
    marginTop: 10,
  },
  bookingItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  bookingDetails: {
    flex: 1,
  },
  bookingVenueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bookingInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  bookingStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statusConfirmed: {
    color: '#4CAF50',
  },
  statusCancelled: {
    color: '#F44336',
  },
  cancelButton: {
    backgroundColor: '#FF5F5F',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});

const WrappedCustomerHome = () => (
  <BookingProvider>
    <CustomerHome />
  </BookingProvider>
);

export default WrappedCustomerHome;
