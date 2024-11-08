import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {

    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Prepare the payload
    const payload = {
      full_name: fullName,
      email: email,
      password: password, // Don't send the password to Firebase, just to the backend
      user_type: "customer", // Adjust this as needed
    };

    // Log the payload to check what is being sent
    console.log("Payload being sent:", payload);


    try {
      const response = await fetch("https://bookar-backend.vercel.app/api/v1/create-user", {
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
        // Continue processing with 'data'
      } else {
        console.log("No content received in response");
      }


      console.log("YURRRR");

      if (response.ok && data.status_code === 200) {
        console.log("User created successfully on backend:", data.message);
        router.push('./login'); // Navigate to login page
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err: any) {
      setError(err.message); // Set error message if API call fails
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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Sign Up" onPress={handleSignup} />

      <Text style={styles.switchText} onPress={() => router.push('./login')}>
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
