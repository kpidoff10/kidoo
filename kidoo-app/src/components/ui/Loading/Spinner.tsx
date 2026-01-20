/**
 * Spinner Component
 * Indicateur de chargement
 */

import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { useTheme } from '@/theme';

export interface SpinnerProps extends Omit<ActivityIndicatorProps, 'color'> {
  color?: 'primary' | 'secondary' | 'white';
}

export function Spinner({ color = 'primary', size = 'small', ...props }: SpinnerProps) {
  const { colors } = useTheme();

  const getColor = (): string => {
    switch (color) {
      case 'secondary':
        return colors.textSecondary;
      case 'white':
        return '#FFFFFF';
      default:
        return colors.primary;
    }
  };

  return <ActivityIndicator color={getColor()} size={size} {...props} />;
}
