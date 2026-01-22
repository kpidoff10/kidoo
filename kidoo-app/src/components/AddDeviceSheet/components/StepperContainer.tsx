/**
 * StepperContainer Component
 * Wrapper pour le conteneur du stepper
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface StepperContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function StepperContainer({ children, style }: StepperContainerProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
});
