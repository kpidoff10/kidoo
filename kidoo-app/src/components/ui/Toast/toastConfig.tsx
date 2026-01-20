/**
 * Toast Configuration
 * Config custom pour react-native-toast-message
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { lightColors, darkColors } from '@/theme/colors';

const getColors = (isDark: boolean) => (isDark ? darkColors : lightColors);

export const createToastConfig = (isDark: boolean): ToastConfig => {
  const colors = getColors(isDark);

  return {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.success,
          backgroundColor: colors.surface,
          borderLeftWidth: 4,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
        }}
        text2Style={{
          fontSize: 13,
          color: colors.textSecondary,
        }}
        renderLeadingIcon={() => (
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          </View>
        )}
      />
    ),

    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: colors.error,
          backgroundColor: colors.surface,
          borderLeftWidth: 4,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
        }}
        text2Style={{
          fontSize: 13,
          color: colors.textSecondary,
        }}
        renderLeadingIcon={() => (
          <View style={styles.iconContainer}>
            <Ionicons name="close-circle" size={24} color={colors.error} />
          </View>
        )}
      />
    ),

    warning: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.warning,
          backgroundColor: colors.surface,
          borderLeftWidth: 4,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
        }}
        text2Style={{
          fontSize: 13,
          color: colors.textSecondary,
        }}
        renderLeadingIcon={() => (
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={24} color={colors.warning} />
          </View>
        )}
      />
    ),

    info: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: colors.info,
          backgroundColor: colors.surface,
          borderLeftWidth: 4,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
        }}
        text2Style={{
          fontSize: 13,
          color: colors.textSecondary,
        }}
        renderLeadingIcon={() => (
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={24} color={colors.info} />
          </View>
        )}
      />
    ),
  };
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
