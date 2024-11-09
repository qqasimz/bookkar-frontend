import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('customer'); // Default to 'customer'
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Create the payload
      const payload = {
        full_name: fullName,
        email: email,
        password: password,
        user_type: userType,
      };

      // Log the payload for debugging
      console.log("Payload sent to backend:", payload);

      const response = await fetch("https://bookar-d951ecf6cefd.herokuapp.com/api/v1/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawResponse = await response.text();
      console.log("Raw response:", rawResponse);

      if (rawResponse) {
        const data = JSON.parse(rawResponse);
        if (response.ok && data.status_code === 200) {
          console.log("User created successfully on backend:", data.message);
          router.push('./'); // Navigate to login page
        } else {
          setError(data.message || "Signup failed");
        }
      } else {
        console.log("No content received in response");
      }
    } catch (err: any) {
      setError(err.message); // Set Firebase error or API error message
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
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={userType}
          onValueChange={(itemValue) => setUserType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Customer" value="customer" />
          <Picker.Item label="Owner" value="owner" />
        </Picker>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Sign Up" onPress={handleSignup} color="#4CAF50" />

      <Text style={styles.switchText} onPress={() => router.push('./')}>
        Already have an account? Login here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7', // Soft background color
    padding: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333', // Darker text for better readability
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    backgroundColor: '#fff', // White background for inputs
    fontSize: 16,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  switchText: {
    color: '#007BFF', // Blue color for login link
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Signup;
