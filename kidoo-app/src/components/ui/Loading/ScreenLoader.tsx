/**
 * ScreenLoader Component
 * Loader plein écran
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { Spinner } from './Spinner';
import { Text } from '../Typography';

export interface ScreenLoaderProps {
  message?: string;
}

export function ScreenLoader({ message }: ScreenLoaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Spinner size="large" />
      {message && (
        <Text color="secondary" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
  },
});
