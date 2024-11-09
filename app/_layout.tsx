import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router'; // Use Expo Router's Stack
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const RootLayout = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log('onAuthStateChanged:', user);
    setUser(user);
    if (initializing) setInitializing(false);

  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


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
      <Stack.Screen name="index" options={ {headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: 'Signup' }} />
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