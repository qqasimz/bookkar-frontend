import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { useRouter } from 'expo-router';

const Signup = () => {
  // State variables for managing input values and dropdown selection
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('customer'); // Default user type
  const [open, setOpen] = useState(false); // Controls dropdown visibility
  const [items, setItems] = useState([
    { label: 'Customer', value: 'customer' },
    { label: 'Owner', value: 'owner' },
  ]);
  const [error, setError] = useState(''); // Error message state
  const router = useRouter();

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />; // Show loading screen until fonts are ready
  }

  const handleSignup = async () => {
    setError(''); // Clear previous error messages

    // Validate required fields
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const payload = {
        full_name: fullName,
        email: email,
        password: password,
        user_type: userType,
      };

      console.log('Payload:', payload); // Log payload for debugging purposes

      // Send signup data to the backend
      const response = await fetch('https://bookar-d951ecf6cefd.herokuapp.com/api/v1/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse); // Parse response from the server

      if (response.ok && data.status_code === 200) {
        // If successful, display success alert and redirect to login page
        Alert.alert('Success', 'Account created successfully!');
        router.push('./'); // Navigate to login page
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err); // Log error details for debugging
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      {/* Input field for full name */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholderTextColor="#C48A6A"
      />

      {/* Input field for email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#C48A6A"
        keyboardType="email-address"
      />

      {/* Input field for password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#C48A6A"
      />

      {/* Dropdown picker for user type selection */}
      <DropDownPicker
        open={open}
        value={userType}
        items={items}
        setOpen={setOpen}
        setValue={setUserType}
        setItems={setItems}
        style={styles.picker}
        dropDownContainerStyle={styles.dropDownContainer}
        placeholderStyle={styles.pickerText}
        labelStyle={styles.pickerText}
      />

      {/* Display error messages */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Signup button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Link to navigate to the login page */}
      <Text style={styles.switchText} onPress={() => router.push('./')}>
        Already have an account? <Text style={styles.switchLink}>Login here.</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#0D1411',
  },
  heading: {
    fontSize: 32,
    fontWeight: '600',
    color: '#C48A6A',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  input: {
    height: 50,
    backgroundColor: '#5A3C2F',
    marginBottom: 15,
    borderRadius: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  picker: {
    backgroundColor: '#5A3C2F',
    borderRadius: 12,
    borderWidth: 0,
    height: 50,
  },
  dropDownContainer: {
    backgroundColor: '#5A3C2F',
    borderRadius: 12,
    borderWidth: 0,
    marginBottom: 20, // Space between dropdown and next elements
  },
  pickerText: {
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  signupButton: {
    backgroundColor: '#6E4B38',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20, // Separate button from error message
  },
  signupButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  switchText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  switchLink: {
    color: '#C48A6A',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default Signup;
