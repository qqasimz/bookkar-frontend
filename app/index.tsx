// app/login.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import auth from '@react-native-firebase/auth'; // Firebase Auth module
import { auth } from '@/firebase';
import { useRouter } from 'expo-router'; // Import useRouter from Expo Router
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const router = useRouter(); // Use Expo Router for navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Make the API call to fetch user details
      const response = await fetch('http://bookar-d951ecf6cefd.herokuapp.com/api/v1/get-user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.uid }),
      });
      console.log('Raw response:', response);  // Log the response object itself


      if (response.ok) {
        // Convert the response body to JSON
        const data = await response.json();
        console.log("Response data:", data);

        if (data && data.data?.user_type) {
          const userType = data.data?.user_type; 
          console.log("User type received:", userType);

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
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.switchText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('./signup')}>
          <Text style={styles.switchLink}>Sign up here.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchLink: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
