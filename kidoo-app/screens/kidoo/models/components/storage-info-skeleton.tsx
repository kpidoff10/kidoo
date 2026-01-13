/**
 * Skeleton loader pour le composant StorageInfo
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export function StorageInfoSkeleton() {
  const theme = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <>
      {/* Titre skeleton */}
      <Animated.View
        style={{
          height: theme.typography.fontSize.md,
          width: 100,
          backgroundColor: theme.colors.border,
          borderRadius: theme.borderRadius.sm,
          marginBottom: theme.spacing.md,
          opacity,
        }}
      />

      {/* Barre skeleton */}
      <View
        style={{
          height: 48,
          backgroundColor: theme.colors.border,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Partie gauche animée */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '60%',
            backgroundColor: theme.colors.tint,
            opacity,
          }}
        />

        {/* Partie droite */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: '40%',
            backgroundColor: theme.colors.border,
          }}
        />
      </View>
    </>
  );
}
