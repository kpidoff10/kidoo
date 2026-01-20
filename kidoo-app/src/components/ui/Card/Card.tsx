/**
 * Card Component
 * Container avec shadow et padding
 */

import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...props
}: CardProps) {
  const { colors, borderRadius, shadow, spacing } = useTheme();

  const getPadding = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return spacing[2];
      case 'lg':
        return spacing[6];
      default:
        return spacing[4];
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.xl,
          padding: getPadding(),
          borderColor: colors.border,
          borderWidth: variant === 'default' ? 1 : 0,
        },
        variant === 'elevated' && shadow.md,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
