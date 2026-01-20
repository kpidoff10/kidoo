/**
 * Badge Component
 * Pour afficher des statuts (Online/Offline, etc.)
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  style?: ViewStyle;
}

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  dot = false,
  style,
}: BadgeProps) {
  const { colors, fonts, borderRadius, spacing } = useTheme();

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'success':
        return colors.successLight;
      case 'warning':
        return colors.warningLight;
      case 'error':
        return colors.errorLight;
      case 'info':
        return colors.infoLight;
      default:
        return colors.backgroundTertiary;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getDotColor = (): string => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: borderRadius.full,
          paddingHorizontal: size === 'sm' ? spacing[2] : spacing[3],
          paddingVertical: size === 'sm' ? spacing[1] / 2 : spacing[1],
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: getDotColor(),
              marginRight: spacing[1],
            },
          ]}
        />
      )}
      <Text
        style={[
          styles.label,
          {
            color: getTextColor(),
            fontSize: size === 'sm' ? fonts.size.xs : fonts.size.sm,
            fontWeight: fonts.weight.medium,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {},
});
