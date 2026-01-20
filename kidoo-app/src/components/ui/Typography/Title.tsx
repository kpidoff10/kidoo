/**
 * Title Component
 * Composant titre avec variants
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@/theme';

export type TitleLevel = 'h1' | 'h2' | 'h3' | 'h4';

export interface TitleProps extends RNTextProps {
  level?: TitleLevel;
  center?: boolean;
}

export function Title({
  level = 'h2',
  center = false,
  style,
  children,
  ...props
}: TitleProps) {
  const { colors, fonts } = useTheme();

  const getFontSize = (): number => {
    switch (level) {
      case 'h1':
        return fonts.size['3xl'];
      case 'h2':
        return fonts.size['2xl'];
      case 'h3':
        return fonts.size.xl;
      case 'h4':
        return fonts.size.lg;
      default:
        return fonts.size['2xl'];
    }
  };

  return (
    <RNText
      style={[
        {
          fontSize: getFontSize(),
          color: colors.text,
          fontWeight: fonts.weight.bold,
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
