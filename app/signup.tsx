import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { useRouter } from 'expo-router';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('customer');
  const [open, setOpen] = useState(false); // Control dropdown visibility
  const [items, setItems] = useState([
    { label: 'Customer', value: 'customer' },
    { label: 'Owner', value: 'owner' },
  ]);
  const [error, setError] = useState('');
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleSignup = async () => {
    setError(''); // Clear previous error

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

      console.log('Payload:', payload); // Debugging log

      const response = await fetch('https://bookar-d951ecf6cefd.herokuapp.com/api/v1/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (response.ok && data.status_code === 200) {
        Alert.alert('Success', 'Account created successfully!');
        router.push('./'); // Navigate to the login page
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholderTextColor="#C48A6A"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#C48A6A"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#C48A6A"
      />

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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

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
    marginBottom: 20, // Added padding between dropdown and button
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
    marginTop: 20, // Added margin to separate button from error message
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
