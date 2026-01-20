/**
 * PasswordInput Component
 * Input password avec toggle show/hide (oeil)
 */

import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

export interface PasswordInputProps extends Omit<RNTextInputProps, 'secureTextEntry'> {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const PasswordInput = forwardRef<RNTextInput, PasswordInputProps>(
  ({ label, error, hint, containerStyle, required, style, ...props }, ref) => {
    const { colors, fonts, borderRadius, spacing } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    const hasError = !!error;

    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };

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

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surface,
              borderColor: hasError ? colors.error : colors.border,
              borderRadius: borderRadius.lg,
            },
          ]}
        >
          <RNTextInput
            ref={ref}
            placeholderTextColor={colors.textTertiary}
            secureTextEntry={!isVisible}
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.input,
              {
                color: colors.text,
                fontSize: fonts.size.base,
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
              },
              style,
            ]}
            {...props}
          />

          <TouchableOpacity
            onPress={toggleVisibility}
            style={[styles.eyeButton, { paddingRight: spacing[4] }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

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

PasswordInput.displayName = 'PasswordInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
  },
  eyeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {},
});
