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
          { id: '1', name: 'City Sports Arena', location: 'Downtown', imageUrl: 'https://via.placeholder.com/150' },
          { id: '2', name: 'Beachside Courts', location: 'Coastline', imageUrl: 'https://via.placeholder.com/150' },
          { id: '3', name: 'Mountain View Stadium', location: 'Uptown', imageUrl: 'https://via.placeholder.com/150' },
          { id: '4', name: 'Greenfield Park', location: 'Suburbs', imageUrl: 'https://via.placeholder.com/150' },
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
  bookingsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#777',
  },
});

export default Home;
