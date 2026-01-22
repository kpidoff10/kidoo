/**
 * StepContent Component
 * Wrapper pour le contenu de chaque étape
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface StepContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function StepContent({ children, style }: StepContentProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
