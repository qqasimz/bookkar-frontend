import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';

type VenueDetails = {
  name: string;
  location: string;
  imageUrl: string;
  capacity: number;
  venueType: string;
  facilities: string[];
  availableTimeslots: { [date: string]: string[] };
  pricing: string;
  ratings: number;
  bookingStatus: string;
  address: string;
  description: string;
};

const CreateVenue = () => {
  const [venueDetails, setVenueDetails] = useState<VenueDetails>({
    name: '',
    location: '',
    imageUrl: '',
    capacity: 0,
    venueType: '',
    facilities: [],
    availableTimeslots: {}, // Store timeslots here
    pricing: '',
    ratings: 0,
    bookingStatus: '',
    address: '',
    description: '',
  });

  const router = useRouter();

  // Generate available timeslots for the next 30 days
  const generateTimeslotsForNextMonth = () => {
    const timeslots: { [key: string]: string[] } = {};
    const now = new Date();
    const nextMonth = new Date(now.setMonth(now.getMonth() + 1));

    for (let i = 0; i < 30; i++) {
      const date = new Date(nextMonth);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

      // Generate time slots from 9 AM to 9 PM
      timeslots[dateString] = [];
      for (let hour = 9; hour <= 21; hour++) {
        const timeSlot = `${hour}:00`;
        timeslots[dateString].push(timeSlot);
      }
    }
    return timeslots;
  };

  const handleChange = (field: keyof VenueDetails, value: string | string[] | number) => {
    setVenueDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateVenue = async () => {
    try {
      const generatedTimeslots = generateTimeslotsForNextMonth();

      // Add generated timeslots to venueDetails
      const updatedVenueDetails = {
        ...venueDetails,
        availableTimeslots: generatedTimeslots,
      };

      // Log the generated venue details as the payload
      console.log('Venue JSON payload to be sent:', JSON.stringify(updatedVenueDetails, null, 2));

      // Uncomment below line once backend is ready
      // await sendVenueToBackend(updatedVenueDetails);

      Alert.alert('Success', 'Venue created successfully!');
      router.back();
    } catch (err) {
      console.error('Error creating venue:', err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('./owner-home')} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#4E73DF" />
      </TouchableOpacity>

      <Text style={styles.headerText}>Create New Venue</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={venueDetails.name}
        onChangeText={(value) => handleChange('name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={venueDetails.location}
        onChangeText={(value) => handleChange('location', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={venueDetails.imageUrl}
        onChangeText={(value) => handleChange('imageUrl', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Capacity"
        keyboardType="numeric"
        value={venueDetails.capacity.toString()}
        onChangeText={(value) => handleChange('capacity', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Venue Type (e.g., Outdoor, Indoor)"
        value={venueDetails.venueType}
        onChangeText={(value) => handleChange('venueType', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Facilities (comma-separated)"
        value={venueDetails.facilities.join(', ')}
        onChangeText={(value) => handleChange('facilities', value.split(',').map(f => f.trim()))}
      />

      {/* Add additional inputs like pricing, description, etc. */}

      <Button title="Create Venue" onPress={handleCreateVenue} color="#4E73DF" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 10, left: 10, zIndex: 1 },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#4E73DF' },
  input: { backgroundColor: '#FFF', borderRadius: 5, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#DDD' },
});

export default CreateVenue;
