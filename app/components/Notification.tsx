import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type NotificationProps = {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
  onHide: () => void;
};

const Notification: React.FC<NotificationProps> = ({ message, type, visible, onHide }) => {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        styles[type],
        { transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    zIndex: 999,
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#F44336',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Notification;