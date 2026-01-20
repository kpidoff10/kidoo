/**
 * Text Component
 * Composant texte avec variants
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

export type TextVariant = 'body' | 'bodySmall' | 'caption' | 'label';
export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  bold?: boolean;
  center?: boolean;
}

export function Text({
  variant = 'body',
  color = 'primary',
  bold = false,
  center = false,
  style,
  children,
  ...props
}: TextProps) {
  const { colors, fonts } = useTheme();

  const getFontSize = (): number => {
    switch (variant) {
      case 'bodySmall':
        return fonts.size.sm;
      case 'caption':
        return fonts.size.xs;
      case 'label':
        return fonts.size.sm;
      default:
        return fonts.size.base;
    }
  };

  const getColor = (): string => {
    switch (color) {
      case 'secondary':
        return colors.textSecondary;
      case 'tertiary':
        return colors.textTertiary;
      case 'error':
        return colors.error;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      default:
        return colors.text;
    }
  };

  return (
    <RNText
      style={[
        {
          fontSize: getFontSize(),
          color: getColor(),
          fontWeight: bold ? fonts.weight.semibold : fonts.weight.regular,
          textAlign: center ? 'center' : 'left',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
