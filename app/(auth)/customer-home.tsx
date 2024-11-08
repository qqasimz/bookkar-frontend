// customer-home.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { router } from 'expo-router';

const Home = () => {
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('User signed out!');
      router.replace('./'); // Optionally, you can navigate to the login screen or perform other actions
      // Optionally, you can navigate to the login screen or perform other actions
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Customer Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
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