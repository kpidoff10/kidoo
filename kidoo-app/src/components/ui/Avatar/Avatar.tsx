/**
 * Avatar Component
 * Affiche une image ou des initiales
 */

import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  source?: { uri: string } | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

export function Avatar({ source, name, size = 'md', style }: AvatarProps) {
  const { colors, fonts, borderRadius } = useTheme();

  const getSize = (): number => {
    switch (size) {
      case 'sm':
        return 32;
      case 'lg':
        return 56;
      case 'xl':
        return 80;
      default:
        return 40;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return fonts.size.xs;
      case 'lg':
        return fonts.size.xl;
      case 'xl':
        return fonts.size['2xl'];
      default:
        return fonts.size.base;
    }
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const dimension = getSize();

  if (source?.uri) {
    return (
      <Image
        source={source}
        style={[
          styles.image,
          {
            width: dimension,
            height: dimension,
            borderRadius: borderRadius.full,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: dimension,
          height: dimension,
          borderRadius: borderRadius.full,
          backgroundColor: colors.primary,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            color: colors.textInverse,
            fontSize: getFontSize(),
            fontWeight: fonts.weight.semibold,
          },
        ]}
      >
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {},
});
