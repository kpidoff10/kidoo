/**
 * TextInput Component
 * Input texte standard avec label et gestion d'erreur
 */

import React, { forwardRef } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, error, hint, containerStyle, required, style, ...props }, ref) => {
    const { colors, fonts, borderRadius, spacing } = useTheme();

    const hasError = !!error;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: colors.text,
                fontSize: fonts.size.sm,
                fontWeight: fonts.weight.medium,
                marginBottom: spacing[1],
              },
            ]}
          >
            {label}
            {required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        )}

        <RNTextInput
          ref={ref}
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: hasError ? colors.error : colors.border,
              borderRadius: borderRadius.lg,
              color: colors.text,
              fontSize: fonts.size.base,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
            },
            style,
          ]}
          {...props}
        />

        {(error || hint) && (
          <Text
            style={[
              styles.helperText,
              {
                color: hasError ? colors.error : colors.textSecondary,
                fontSize: fonts.size.xs,
                marginTop: spacing[1],
              },
            ]}
          >
            {error || hint}
          </Text>
        )}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {},
  input: {
    borderWidth: 1,
  },
  helperText: {},
});
