// customer-home.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Customer Home Screen!</Text>
      <Button title="Logout" onPress={() => auth().signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default Home;