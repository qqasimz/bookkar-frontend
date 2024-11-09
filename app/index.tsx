// app/login.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth'; // Firebase Auth module
import { useRouter } from 'expo-router'; // Import useRouter from Expo Router

const Login = () => {
  const router = useRouter(); // Use Expo Router for navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Make the API call to fetch user details
      const response = await fetch('http://bookar-d951ecf6cefd.herokuapp.com/api/v1/get-user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.uid }),
      });

      if (response.ok) {
        // Convert the response body to JSON
        const data = await response.json();

        if (data && data.user_type) {
          const userType = data.user_type; // Extract user type (e.g., 'customer' or 'owner')

          if (userType === 'customer') {
            console.log('Navigating to customer home page...');
            router.push('./customer-home');
          } else if (userType === 'owner') {
            console.log('Navigating to owner home page...');
            router.push('./owner-home');
          } else {
            setError('Invalid user type received.');
          }
        } else {
          setError('Failed to retrieve user details or user type is missing.');
        }
      } else {
        console.error('Error fetching user details:', response.statusText);
        setError(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => router.push('./signup')} style={styles.switchText}>
        Don't have an account? Sign up here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  switchText: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Login;

