import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';

type TimeSlot = {
  start: string;
  end: string;
};

type VenueDetails = {
  name: string;
  location: string;
  image_url: string; // Updated field name
  capacity: number;
  venue_type: string;
  available_time_slots: TimeSlot[];
  price: string;
  booking_status: string;
  address: string;
  description: string;
};

const CreateVenue = () => {
  const [venueDetails, setVenueDetails] = useState<VenueDetails>({
    name: '',
    location: '',
    image_url: '', // Updated field name
    capacity: 0,
    venue_type: '',
    available_time_slots: [],
    price: '',
    booking_status: 'Available',
    address: '',
    description: '',
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generateTimeslots = (start: string, end: string): TimeSlot[] => {
    const timeslots: TimeSlot[] = [];
    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
      const dateString = currentDate.toISOString().split('T')[0];

      for (let hour = 6; hour < 22; hour++) {
        const startTime = new Date(`${dateString}T${hour.toString().padStart(2, '0')}:00:00`);
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 1);

        timeslots.push({
          start: startTime.toISOString(),
          end: endTime.toISOString(),
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timeslots;
  };

  const handleChange = (field: keyof VenueDetails, value: string | number) => {
    setVenueDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateVenue = async () => {
    if (!startDate || !endDate) {
      console.log('Error', 'Please select start and end dates.');
      return;
    }

    const generatedTimeslots = generateTimeslots(startDate, endDate);
    const updatedVenueDetails = { ...venueDetails, available_time_slots: generatedTimeslots };

    console.log('Updated Venue Details:', updatedVenueDetails);

    try {
      setLoading(true);
      const response = await fetch('http://bookar-d951ecf6cefd.herokuapp.com/api/v1/add-venue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVenueDetails),
      });

      console.log("payload sent");

      setLoading(false);

      if (response.ok) {
        const responseData = await response.json(); // Parse the JSON response
        console.log('Status Code:', response.status);
        console.log('Response Data:', responseData); // Log the complete response
      
        if (response.status === 200){
          Alert.alert('Success', 'Venue created successfully!');
          router.push('./owner-home');
        } else {
          console.log('Warning: No Venue ID returned.');
        }
      } else {
        const errorData = await response.json();
        console.log('Error', errorData.message || 'Failed to create venue.');
      }
      
    } catch (error) {
      setLoading(false);
      console.log('Error', 'Something went wrong. Please try again later.');
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
        value={venueDetails.image_url} // Updated field name
        onChangeText={(value) => handleChange('image_url', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Capacity"
        keyboardType="numeric"
        value={venueDetails.capacity.toString()}
        onChangeText={(value) => handleChange('capacity', Number(value))}
      />
      <TextInput
        style={styles.input}
        placeholder="Venue Type"
        value={venueDetails.venue_type}
        onChangeText={(value) => handleChange('venue_type', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={venueDetails.price}
        onChangeText={(value) => handleChange('price', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={venueDetails.address}
        onChangeText={(value) => handleChange('address', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={venueDetails.description}
        onChangeText={(value) => handleChange('description', value)}
      />

      <Text style={styles.label}>Select Start Date:</Text>
      <Calendar
        onDayPress={(day: any) => setStartDate(day.dateString)}
        markedDates={{ [startDate]: { selected: true, selectedColor: 'blue' } }}
        style={styles.calendar}
      />
      <Text style={styles.label}>Selected Start Date: {startDate || 'None'}</Text>

      <Text style={styles.label}>Select End Date:</Text>
      <Calendar
        onDayPress={(day: any) => setEndDate(day.dateString)}
        markedDates={{ [endDate]: { selected: true, selectedColor: 'green' } }}
        style={styles.calendar}
      />
      <Text style={styles.label}>Selected End Date: {endDate || 'None'}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4E73DF" />
      ) : (
        <Button title="Create Venue" onPress={handleCreateVenue} color="#4E73DF" />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 10, left: 10, zIndex: 1 },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#4E73DF' },
  input: { backgroundColor: '#FFF', borderRadius: 5, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#DDD' },
  label: { fontSize: 16, marginVertical: 10, color: '#4E73DF' },
  calendar: { marginBottom: 10 },
});

export default CreateVenue;
