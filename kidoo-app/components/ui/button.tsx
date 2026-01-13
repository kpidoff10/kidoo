/**
 * Composant Button générique et réutilisable
 * Utilise les styles du thème centralisé
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, ViewStyle, TextStyle, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  ...touchableProps
}: ButtonProps) {
  const theme = useTheme();

  const isDisabled = disabled || loading;

  // Styles de base du bouton
  const buttonStyle: ViewStyle = {
    ...theme.components.button[variant],
    ...theme.components.buttonSize[size],
    opacity: isDisabled ? 0.6 : 1,
    width: fullWidth ? '100%' : undefined,
  };

  // Styles du texte
  const buttonTextStyle: TextStyle = {
    ...theme.components.buttonText[variant],
    ...theme.components.buttonTextSize[size],
  };

  return (
    <TouchableOpacity
      {...touchableProps}
      disabled={isDisabled}
      style={[buttonStyle, style]}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 20 }}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={theme.components.buttonText[variant].color}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[buttonTextStyle, textStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}
