/**
 * Composant pour afficher l'état de chargement de la liste des fichiers multimédias
 */

import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export function MultimediaListLoading() {
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

  // Générer 3 items skeleton
  const skeletonItems = Array.from({ length: 3 }, (_, index) => (
    <View key={index}>
      <View
        style={{
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            {/* Nom de fichier skeleton */}
            <Animated.View
              style={{
                height: theme.typography.fontSize.md * 1.2,
                width: '70%',
                backgroundColor: theme.colors.border,
                borderRadius: theme.borderRadius.sm,
                opacity,
              }}
            />
            {/* Taille skeleton */}
            <Animated.View
              style={{
                height: theme.typography.fontSize.sm * 1.2,
                width: '40%',
                backgroundColor: theme.colors.border,
                borderRadius: theme.borderRadius.sm,
                opacity,
              }}
            />
          </View>

          {/* Handle drag skeleton */}
          <Animated.View
            style={{
              width: 18,
              height: 18,
              backgroundColor: theme.colors.border,
              borderRadius: theme.borderRadius.sm,
              opacity,
              marginLeft: theme.spacing.sm,
            }}
          />
        </View>
      </View>
      {index < 2 && <View style={theme.components.dividerThin} />}
    </View>
  ));

  return (
    <View style={{ paddingTop: theme.spacing.md }}>
      {skeletonItems}
    </View>
  );
}
