import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

type TimeSlot = {
  start: string;
  end: string;
};

type Venue = {
  id: string;
  venue_id: string; // In case the API uses `venue_id`
  name: string;
  location: string;
  image_url: string;
  capacity: number;
  venue_type: string;
  available_time_slots: TimeSlot[];
  price: string;
  booking_status: string;
  address: string;
  description: string;
};

const OwnerHome = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('http://bookar-d951ecf6cefd.herokuapp.com/api/v1/get-all-venues');
        if (!response.ok) throw new Error('Failed to fetch venues');

        const data = await response.json();
        setVenues(data?.data?.venues || []);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const goToCreateVenue = () => {
    router.push('./create-venue');
  };

  const handleEditVenue = (venueId: string) => {
    console.log(`Edit venue with ID: ${venueId}`);
    // Implement navigation to edit venue screen here
  };

  const handleLogout = () => {
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

      {loading ? (
        <ActivityIndicator size="large" color="#4E73DF" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : venues.length === 0 ? (
        <Text style={styles.placeholderText}>You haven't created any venues yet.</Text>
      ) : (
        venues.map((venue) => (
          <View key={venue.id || venue.venue_id} style={styles.venueCard}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <Text>Location: {venue.location}</Text>
            <Text>Capacity: {venue.capacity}</Text>
            <Text>Type: {venue.venue_type}</Text>
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => handleEditVenue(venue.id || venue.venue_id)}
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
  errorText: {
    color: '#FF5F5F',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
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
