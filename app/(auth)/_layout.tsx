import React from 'react';
import { Stack } from 'expo-router'; // Use Expo Router's Stack

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="customer-home" options={{ title: 'Customer Home' }} />
      {/* <Stack.Screen name="owner-home" options={{ title: 'Owner Home' }} /> */}
    </Stack>
  );
};

export default AuthLayout;