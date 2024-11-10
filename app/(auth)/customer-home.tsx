import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Alert } from 'react-native';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';

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

const CustomerHome = () => {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch('http://bookar-d951ecf6cefd.herokuapp.com/api/v1/get-all-venues');
        if (!response.ok) throw new Error('Failed to fetch venues');

        const data = await response.json();
        const venueList = data?.data?.venues || [];
        const mappedVenues = venueList.map((venue: any) => ({
          id: venue.venue_id,
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
        setVenues(mappedVenues);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleShowModal = (venue: Venue) => {
    setSelectedVenue(venue);
    setAvailableSlots(venue.available_time_slots);
    setModalVisible(true);
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      console.log('Error', 'Please select a time slot to book.');
      return;
    }

    const bookingPayload = {
      user_id: auth.currentUser?.uid || 'test-user-id', // Replace with actual user ID
      venue_id: selectedVenue?.id,
      time_slot: selectedSlot,
    };

    console.log('Booking Payload:', JSON.stringify(bookingPayload, null, 2));

    try {
      const response = await fetch('http://bookar-d951ecf6cefd.herokuapp.com/api/v1/book-venue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      console.log('Booking Response:', response);

      const responseData = await response.json();
      console.log('Booking Response JSON:', responseData);
  
      if (response.ok) {
        console.log('Success', 'Your booking was successful!');
        Alert.alert('Success', 'Your booking was successful!');
        setModalVisible(false); // Close the modal after successful booking
      } else {
        console.log('Error', responseData.message || 'Booking failed.');
        Alert.alert('Error', responseData.message || 'Booking failed.');
      } 
    } catch (error) {
      console.log('Booking error:', error);
      console.log('Error', 'Something went wrong. Please try again later.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (err) {
      console.error('Error signing out: ', err);
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
        <FlatList
          data={venues}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.venueCard}>
              <Text style={styles.venueName}>{item.name}</Text>
              <Text>Location: {item.location}</Text>
              <Text>Type: {item.venue_type}</Text>
              <Text>Price: {item.price}</Text>
              <TouchableOpacity style={styles.bookButton} onPress={() => handleShowModal(item)}>
                <Text style={styles.bookButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.venueList}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.header}>{selectedVenue?.name}</Text>
          <Text style={styles.details}>Location: {selectedVenue?.location}</Text>
          <Text style={styles.details}>Capacity: {selectedVenue?.capacity}</Text>
          <Text style={styles.details}>Type: {selectedVenue?.venue_type}</Text>
          <Text style={styles.details}>Price: {selectedVenue?.price}</Text>
          <Text style={styles.details}>Address: {selectedVenue?.address}</Text>
          <Text style={styles.details}>{selectedVenue?.description}</Text>

          <Text style={styles.subHeader}>Select a Date:</Text>
          <Calendar
            onDayPress={(day : any) => setSelectedDate(day.dateString)}
            markedDates={{ [selectedDate]: { selected: true, selectedColor: 'blue' } }}
            style={styles.calendar}
          />

          {selectedDate && (
            <>
              <Text style={styles.subHeader}>Available Slots:</Text>
              {availableSlots.length === 0 ? (
                <Text style={styles.errorText}>No available slots for this date.</Text>
              ) : (
                availableSlots
                  .filter((slot) => slot.start.startsWith(selectedDate))
                  .map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.slot,
                        selectedSlot?.start === slot.start ? styles.selectedSlot : null,
                      ]}
                      onPress={() => setSelectedSlot(slot)}
                    >
                      <Text style={styles.slotText}>
                        {slot.start.split('T')[1].slice(0, 5)} - {slot.end.split('T')[1].slice(0, 5)}
                      </Text>
                    </TouchableOpacity>
                  ))
              )}
            </>
          )}

          {selectedSlot && (
            <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
              <Text style={styles.bookButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
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
  venueList: {
    paddingLeft: 20,
  },
  venueCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    elevation: 2,
    width: 250,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: '#4E73DF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1F5F8',
  },
  details: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  calendar: {
    marginBottom: 20,
  },
  slot: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#4E73DF',
  },
  slotText: {
    color: '#333',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF5F5F',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default CustomerHome;
