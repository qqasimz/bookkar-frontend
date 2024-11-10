import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, ScrollView, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

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
  description?: string;
};

type VenueCardProps = {
  venue: Venue;
  onBooking: (venueId: string, date: string, timeSlot: string) => void;
};

const VenueCard: React.FC<VenueCardProps> = ({ venue, onBooking }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [flipAnimation] = useState(new Animated.Value(0));

  const flipCard = () => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const handleDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
    setSelectedTimeSlot('');
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTimeSlot) {
      onBooking(venue.id, selectedDate, selectedTimeSlot);
      setSelectedDate('');
      setSelectedTimeSlot('');
      flipCard();
    }
  };

  const renderFacilities = () => (
    <View style={styles.facilitiesContainer}>
      <Text style={styles.sectionTitle}>Facilities</Text>
      <View style={styles.facilitiesGrid}>
        {venue.facilities.map((facility) => (
          <View key={facility} style={styles.facilityTag}>
            <Text style={styles.facilityText}>{facility}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const frontCard = (
    <Animated.View style={[styles.card, frontAnimatedStyle]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Image 
          source={{ uri: venue.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.contentContainer}>
          <Text style={styles.venueName}>{venue.name}</Text>
          <Text style={styles.venueLocation}>{venue.location}</Text>
          <Text style={styles.venueType}>{venue.venueType}</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Capacity</Text>
              <Text style={styles.detailValue}>{venue.capacity}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>{venue.pricing}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rating</Text>
              <Text style={styles.detailValue}>{venue.ratings} ★</Text>
            </View>
          </View>

          <Text style={styles.statusText}>Status: {venue.bookingStatus}</Text>
          <Text style={styles.addressText}>Address: {venue.address}</Text>
          
          {renderFacilities()}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
        <Text style={styles.flipButtonText}>View Details & Book</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const backCard = (
    <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.descriptionTitle}>About this Venue</Text>
          <Text style={styles.description}>
            {venue.description || 'No description available.'}
          </Text>
          
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#4E73DF' }
            }}
            style={styles.calendar}
            theme={{
              todayTextColor: '#4E73DF',
              selectedDayBackgroundColor: '#4E73DF',
              dotColor: '#4E73DF',
            }}
          />

          {selectedDate && (
            <View style={styles.timeSlotContainer}>
              <Text style={styles.timeSlotTitle}>Available Time Slots:</Text>
              <View style={styles.timeSlotGrid}>
                {venue.availableTimeslots.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeSlot,
                      selectedTimeSlot === slot && styles.selectedTimeSlot,
                    ]}
                    onPress={() => handleTimeSlotSelect(slot)}
                  >
                    <Text 
                      style={[
                        styles.timeSlotText,
                        selectedTimeSlot === slot && styles.selectedTimeSlotText
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={flipCard}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          {selectedDate && selectedTimeSlot && (
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={handleBooking}
            >
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {frontCard}
      {backCard}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 550,
    marginRight: 15,
  },
  safeArea: {
    flex: 1,
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    backfaceVisibility: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  scrollContent: {
    paddingBottom: 60, // Space for buttons
  },
  contentContainer: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  venueName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  venueLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  venueType: {
    fontSize: 16,
    color: '#4E73DF',
    marginBottom: 15,
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  facilitiesContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  facilityTag: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    margin: 4,
  },
  facilityText: {
    fontSize: 12,
    color: '#4E73DF',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  calendar: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  timeSlotContainer: {
    marginTop: 15,
  },
  timeSlotTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    marginBottom: 8,
  },
  selectedTimeSlot: {
    backgroundColor: '#4E73DF',
  },
  timeSlotText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  flipButton: {
    backgroundColor: '#4E73DF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  bookButton: {
    backgroundColor: '#4E73DF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  flipButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VenueCard;