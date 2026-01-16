/**
 * Skeleton loader pour MultimediaInfoCard
 */

import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export function MultimediaInfoCardSkeleton() {
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
    <View
      style={{
        backgroundColor: theme.colors.surfaceSecondary,
        padding: theme.spacing.xl,
        alignItems: 'center',
        gap: theme.spacing.md,
      }}
    >
      {/* Icône skeleton */}
      <Animated.View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: theme.colors.border,
          opacity,
        }}
      />

      <View style={{ gap: theme.spacing.xs, alignItems: 'center', width: '100%' }}>
        {/* Titre skeleton */}
        <Animated.View
          style={{
            height: theme.typography.fontSize.lg * 1.2,
            width: 200,
            backgroundColor: theme.colors.border,
            borderRadius: theme.borderRadius.sm,
            opacity,
          }}
        />

        {/* Description skeleton - 2 lignes */}
        <View style={{ gap: theme.spacing.xs, width: '100%', alignItems: 'center' }}>
          <Animated.View
            style={{
              height: theme.typography.fontSize.md * 1.5,
              width: '90%',
              backgroundColor: theme.colors.border,
              borderRadius: theme.borderRadius.sm,
              opacity,
            }}
          />
          <Animated.View
            style={{
              height: theme.typography.fontSize.md * 1.5,
              width: '75%',
              backgroundColor: theme.colors.border,
              borderRadius: theme.borderRadius.sm,
              opacity,
            }}
          />
        </View>
      </View>
    </View>
  );
}
