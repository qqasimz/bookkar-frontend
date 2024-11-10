import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router'; // Use Expo Router's Stack
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { auth } from '@/firebase'; // Import the auth instance from firebase.ts
import { onAuthStateChanged, User } from 'firebase/auth'; // Import relevant functions from firebase/auth

const RootLayout = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const handleAuthStateChanged = (user: User | null) => {
    console.log('onAuthStateChanged:', user);
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, handleAuthStateChanged);
    return () => subscriber(); // unsubscribe on unmount
  }, []); // The empty dependency array ensures this runs only once

  // Uncomment this if you want to handle routing based on authentication state
  // useEffect(() => { 
  //   if (initializing) return;

  //   const inAuthGroup = segments[0]?.startsWith('(auth)');

  //   if (user && !inAuthGroup) {
  //     router.replace('./(auth)/customer-home');
  //   } else if (!user && inAuthGroup) {
  //     router.replace('./');
  //   }
  // }, [user, initializing, segments]);

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootLayout;
