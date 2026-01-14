// components/atoms/DiceFace.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { DICE_COLORS } from '@/lib/core/constants';

type DiceFaceProps = {
  value: number;
  isRolling: boolean;
};

export const DiceFace: React.FC<DiceFaceProps> = ({ value, isRolling }) => {
  // Patrones de puntos para cada cara
  const dotPatterns: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
  };

  const dots = dotPatterns[value] || [];

  // Animación cuando está rodando
  const animatedStyle = useAnimatedStyle(() => {
    if (isRolling) {
      return {
        transform: [
          {
            rotate: withSequence(
              withSpring('360deg', { damping: 10 }),
              withSpring('0deg', { damping: 10 })
            ),
          },
          {
            scale: withSequence(
              withSpring(1.2, { damping: 8 }),
              withSpring(1, { damping: 8 })
            ),
          },
        ],
      };
    }
    return {
      transform: [{ rotate: '0deg' }, { scale: 1 }],
    };
  });

  return (
    <Animated.View style={[styles.dice, animatedStyle]}>
      <View style={styles.dotsContainer}>
        {dots.map((pos, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                top: `${(pos[0] / 2) * 100}%`,
                left: `${(pos[1] / 2) * 100}%`,
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dice: {
    width: 200,
    height: 200,
    backgroundColor: DICE_COLORS.background,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DICE_COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  dotsContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DICE_COLORS.dot,
    transform: [{ translateX: -14 }, { translateY: -14 }],
  },
});