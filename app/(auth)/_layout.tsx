import React from 'react';
import { Stack } from 'expo-router'; // Use Expo Router's Stack

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="customer-home" options={{ headerShown: false }} />
      <Stack.Screen name="owner-home" options={{ headerShown: false }} />
      <Stack.Screen name="create-venue" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;