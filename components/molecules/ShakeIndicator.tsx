// components/molecules/ShakeIndicator.tsx

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const ShakeIndicator: React.FC = () => {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Animación de vibración
    translateX.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 100, easing: Easing.ease }),
        withTiming(10, { duration: 100, easing: Easing.ease }),
        withTiming(-10, { duration: 100, easing: Easing.ease }),
        withTiming(10, { duration: 100, easing: Easing.ease }),
        withTiming(0, { duration: 100, easing: Easing.ease })
      ),
      -1,
      false
    );

    // Animación de pulso
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500, easing: Easing.ease }),
        withTiming(1, { duration: 500, easing: Easing.ease })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.phone, animatedStyle]}>
        <View style={styles.phoneScreen} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  phone: {
    width: 60,
    height: 100,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  phoneScreen: {
    width: 45,
    height: 75,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
  },
});