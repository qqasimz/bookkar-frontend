import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading'; // For font loading
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase'; // Assuming your Firebase is set up
import { useRouter } from 'expo-router';

const Login = () => {
  // State variables to manage email, password, and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />; // Show loading screen until fonts are loaded
  }

  const handleLogin = async () => {
    setError(''); // Clear any existing error messages

    // Check if email and password fields are filled
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      // Sign in the user with Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch additional user details from backend
      const response = await fetch('http://bookar-d951ecf6cefd.herokuapp.com/api/v1/get-user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.uid }),
      });

      if (response.ok) {
        const data = await response.json();
        const userType = data?.data?.user_type;

        // Navigate to appropriate home screen based on user type
        if (userType === 'customer') {
          router.push('./customer-home');
        } else if (userType === 'owner') {
          router.push('./owner-home');
        } else {
          setError('Invalid user type received.');
        }
      } else {
        setError('Error fetching user details.');
      }
    } catch (err) {
      // Display error message if login fails
      setError('Failed to login. Please check your credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to BookKar</Text>

      {/* Input for email */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#C48A6A" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#C48A6A"
        />
      </View>

      {/* Input for password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#C48A6A" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          placeholderTextColor="#C48A6A"
        />
      </View>

      {/* Display error messages */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.rememberMe}>
        <Text style={styles.rememberText}>Remember me</Text>
      </TouchableOpacity>

      {/* Login button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or continue with</Text>

      {/* Google login button (dummy implementation) */}
      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleButtonText}>G</Text>
      </TouchableOpacity>

      {/* Navigation link to the sign-up page */}
      <View style={styles.signupContainer}>
        <Text style={styles.switchText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('./signup')}>
          <Text style={styles.switchLink}>Sign up</Text>
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
    backgroundColor: '#0D1411',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#C48A6A',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A3C2F',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  rememberMe: {
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  rememberText: {
    color: '#C48A6A',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  loginButton: {
    backgroundColor: '#6E4B38',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  orText: {
    color: '#C48A6A',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  googleButton: {
    backgroundColor: '#5A3C2F',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
  switchLink: {
    color: '#C48A6A',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default Login;
