// app/login.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth } from '@/firebase'; // Import the auth object
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth method
import { useRouter } from 'expo-router'; // Import useRouter from Expo Router

const Login = () => {
  const router = useRouter(); // Use Expo Router for navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Commented-out the real API call for now
      // const response = await fetch('<your-api-url>/get-user-details', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ user_id: user.uid }),
      // });

      // Dummy response to simulate the API response
      const response = {
        status_code: 200,
        message: 'User has been fetched successfully',
        data: {
          user_type: 'customer', // Simulating as 'customer'
        },
      };

      if (response.status_code === 200 && response.data) {
        const userType = response.data.user_type; // Get user type from the dummy response

        // Navigate based on the user type (customer or owner)
        if (userType === 'customer') {
          router.push('./customer-home'); // Navigate to customer home page
        } else if (userType === 'owner') {
          router.push('./owner-home'); // Navigate to owner home page
        }
      } else {
        setError('Failed to retrieve user details or invalid user type.');
      }

    } catch (err: any) {
      setError(err.message);
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

