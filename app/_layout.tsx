import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router'; // Use Expo Router's Stack
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import  auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'; // Import the auth instance from firebase.ts

const RootLayout = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log('User state changed', user);
    setUser(user);
    if (initializing) setInitializing(false); // Set initializing to false once user is fetched
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []); // The empty dependency array ensures this runs only once

  useEffect(() => { 
    if (initializing) return;

    const inAuthGroup = segments[0]?.startsWith('(auth)');

    if (user && !inAuthGroup) {
      router.replace('./(auth)/customer-home');
    } else if (!user && inAuthGroup) {
      router.replace('./');
    }
  }, [user, initializing, segments]);

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
