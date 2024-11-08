import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router'; // Use Expo Router's Stack
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const RootLayout = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setInitializing(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
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
      <Stack.Screen name="signup" options={{ title: 'Signup' }} />
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