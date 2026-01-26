/**
 * Animation de respiration bleue
 * Pour indiquer que le Kidoo doit être en mode appairage
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/theme';

export function BreathingAnimation() {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation de respiration continue
    const breathingAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    breathingAnimation.start();

    return () => {
      breathingAnimation.stop();
    };
  }, [opacity, scale]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: colors.primary,
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
