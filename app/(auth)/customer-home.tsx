import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';

const Home = () => {
  type Venue = {
    id: string;
    name: string;
    location: string;
    imageUrl: string;
    capacity: number;  // Max capacity of the venue
    venueType: string; // Type of venue (e.g., field, stadium, court)
    facilities: string[]; // List of facilities available (e.g., lights, lockers, etc.)
    availableTimeslots: string[]; // Available time slots for booking
    pricing: string; // Price for booking (e.g., per hour)
    ratings: number; // Average rating (1 to 5 stars)
    bookingStatus: string; // Booking status (e.g., "Available", "Booked", "Under Maintenance")
    address: string; // Full address
  };

  const [venues, setVenues] = useState<Venue[]>([]);
  const [error, setError] = useState(null);

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
        setVenues(data.venues); // Assuming the API response contains a 'venues' field
        */

        // Dummy data to simulate API response
        const dummyData = [
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
            bookingStatus: 'Booked', // Example of a venue that is already booked
            address: '789 Mountain Road, Uptown',
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
            bookingStatus: 'Under Maintenance', // Example of a venue under maintenance
            address: '101 Greenfield Ave, Suburbs',
          },
        ];

        setVenues(dummyData);
      } catch (err : any) {
        setError(err.message);
      }
    };

    fetchVenues();
  }, []);

  const renderVenueCard = ({ item }: { item: Venue }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.venueName}>{item.name}</Text>
      <Text style={styles.venueLocation}>{item.location}</Text>
      <Text style={styles.venueType}>{item.venueType}</Text>
      <Text style={styles.venueDetails}>Capacity: {item.capacity}</Text>
      <Text style={styles.venueDetails}>Price: {item.pricing}</Text>
      <Text style={styles.venueDetails}>Rating: {item.ratings} ★</Text>
      <Text style={styles.venueDetails}>Status: {item.bookingStatus}</Text>
      <Text style={styles.venueDetails}>Address: {item.address}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Home Screen</Text>
        <TouchableOpacity onPress={() => auth().signOut()} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      {/* Horizontal Venues List */}
      <View style={styles.venueSection}>
        <Text style={styles.sectionTitle}>Venues Near You</Text>
        <FlatList
          data={venues}
          renderItem={renderVenueCard}
          keyExtractor={(item) => item.id}
          horizontal={true} // Enable horizontal scrolling
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardContainer}
        />
      </View>

      {/* Additional Content */}
      <View style={styles.bookingsSection}>
        <Text style={styles.sectionTitle}>My Bookings</Text>
        {/* Add booking items or content here */}
        <Text style={styles.placeholderText}>You don't have any bookings yet.</Text>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F8',  // Light background color for a clean look
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4E73DF', // A cool blue color for the header
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  text: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff', // White text for good contrast
  },
  logoutButton: {
    padding: 12,
    backgroundColor: '#FF5F5F', // Red color for logout for contrast
    borderRadius: 25,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF5F5F', // Red for error message
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  venueSection: {
    paddingLeft: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardContainer: {
    paddingBottom: 20,
  },
  card: {
    width: 250,
    backgroundColor: '#fff',
    padding: 15,
    marginRight: 10,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  venueLocation: {
    fontSize: 14,
    color: '#555',
  },
  venueType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  venueDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  bookingsSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
});
