import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

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

const OwnerHome = () => {
  const [venues, setVenues] = useState<Venue[]>([
    // Dummy data for demo
    { id: '1', name: 'Soccer Field', location: 'Downtown', imageUrl: '', capacity: 50, venueType: 'Outdoor', facilities: ['Lights', 'Restrooms'], availableTimeslots: ['8 AM - 10 PM'], pricing: '$100/hr', ratings: 4.5, bookingStatus: 'Available', address: '123 Main St', description: 'Best soccer field in town.' },
    // Add more dummy venues if needed
  ]);

  const router = useRouter();

  const goToCreateVenue = () => {
    router.push('./create-venue');
  };

  const handleEditVenue = (venueId: string) => {
    console.log(`Edit venue with ID: ${venueId}`);
  };

  const handleLogout = () => {
    // Add logout logic here (e.g., clear auth tokens, navigate to login screen)
    console.log('User logged out');
    router.replace('/'); // Assuming there's a login page
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Owner Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Venues</Text>
        <Button title="Create New Venue" onPress={goToCreateVenue} color="#4E73DF" />
      </View>

      {venues.length === 0 ? (
        <Text style={styles.placeholderText}>You haven't created any venues yet.</Text>
      ) : (
        venues.map((venue) => (
          <View key={venue.id} style={styles.venueCard}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <Text>Location: {venue.location}</Text>
            <Text>Capacity: {venue.capacity}</Text>
            <Text>Type: {venue.venueType}</Text>
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => handleEditVenue(venue.id)}
            >
              <Text style={styles.manageButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F8',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E73DF',
  },
  logoutButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholderText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
  venueCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  manageButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4E73DF',
    borderRadius: 5,
  },
  manageButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
});

export default OwnerHome;
