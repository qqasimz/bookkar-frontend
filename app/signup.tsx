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
        // mode: "no-cors"
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
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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

      <Button title="Sign Up" onPress={handleSignup} />

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
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  pickerContainer: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center', // Centers the dropdown text vertically
  },
  picker: {
    width: '100%',
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

export default Signup;

