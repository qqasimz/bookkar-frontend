import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import VenueCard from '../components/VenueCard';
import { BookingProvider, useBookings } from '../contexts/BookingContext';
import Notification from '../components/Notification';

type Venue = {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  capacity: number;
  venueType: string;
  facilities: string[];
  availableTimeslots: string[];
  pricing: string;
  ratings: number;
  bookingStatus: string;
  address: string;
  description: string;
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
                <Text style={[
                  styles.bookingStatus,
                  item.status === 'confirmed' ? styles.statusConfirmed : styles.statusCancelled
                ]}>
                  Status: {item.status}
                </Text>
              </View>
              {item.status === 'confirmed' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(item.id)}
                >
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
        // Uncomment this section once the backend is ready
        /*
        const response = await fetch('https://bookar-backend.vercel.app/api/v1/fetch-venues', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }

        const data = await response.json();
        setVenues(data.venues);
        */

        const dummyData: Venue[] = [
          {
            id: '1',
            name: 'City Sports Arena',
            location: 'Downtown',
            imageUrl: 'https://via.placeholder.com/150',
            capacity: 5000,
            venueType: 'Stadium',
            facilities: ['Lights', 'Locker Rooms', 'Restrooms', 'Seating'],
            availableTimeslots: ['9:00 AM - 11:00 AM', '12:00 PM - 2:00 PM', '3:00 PM - 5:00 PM'],
            pricing: '$100/hr',
            ratings: 4.5,
            bookingStatus: 'Available',
            address: '123 Main Street, Downtown, City',
            description: 'A state-of-the-art sports arena featuring multiple courts, professional lighting, and modern amenities. Perfect for tournaments and professional matches.'
          },
          {
            id: '2',
            name: 'Beachside Courts',
            location: 'Coastline',
            imageUrl: 'https://via.placeholder.com/150',
            capacity: 100,
            venueType: 'Tennis Court',
            facilities: ['Lights', 'Restrooms', 'Seating'],
            availableTimeslots: ['8:00 AM - 10:00 AM', '10:30 AM - 12:30 PM', '1:00 PM - 3:00 PM'],
            pricing: '$50/hr',
            ratings: 4.7,
            bookingStatus: 'Available',
            address: '456 Beach Road, Coastline',
            description: 'Beautiful beachside tennis courts with stunning ocean views. Professionally maintained surfaces and equipment rental available.'
          },
          {
            id: '3',
            name: 'Mountain View Stadium',
            location: 'Uptown',
            imageUrl: 'https://via.placeholder.com/150',
            capacity: 8000,
            venueType: 'Football Field',
            facilities: ['Lights', 'Locker Rooms', 'Restrooms', 'VIP Seating'],
            availableTimeslots: ['7:00 AM - 9:00 AM', '10:00 AM - 12:00 PM', '1:00 PM - 3:00 PM'],
            pricing: '$200/hr',
            ratings: 4.3,
            bookingStatus: 'Booked',
            address: '789 Mountain Road, Uptown',
            description: 'Premier football stadium with VIP amenities and spectacular mountain views. Ideal for professional matches and tournaments.'
          },
          {
            id: '4',
            name: 'Greenfield Park',
            location: 'Suburbs',
            imageUrl: 'https://via.placeholder.com/150',
            capacity: 300,
            venueType: 'Basketball Court',
            facilities: ['Lights', 'Seating', 'Restrooms'],
            availableTimeslots: ['6:00 AM - 8:00 AM', '9:00 AM - 11:00 AM', '12:00 PM - 2:00 PM'],
            pricing: '$40/hr',
            ratings: 4.0,
            bookingStatus: 'Under Maintenance',
            address: '101 Greenfield Ave, Suburbs',
            description: 'Community basketball court with excellent facilities and convenient suburban location. Perfect for casual games and local tournaments.'
          }
        ];

        setVenues(dummyData);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
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
    const venue = venues.find(v => v.id === venueId);
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

      <View style={styles.venueSection}>
        <Text style={styles.sectionTitle}>Venues Near You</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.venueList}
        >
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onBooking={handleBooking}
            />
          ))}
        </ScrollView>
      </View>

      <BookingsList />

      <Notification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onHide={() => setNotification(prev => ({ ...prev, visible: false }))}
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