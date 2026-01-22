/**
 * ActionsContainer Component
 * Wrapper pour les actions (boutons) en bas du sheet
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface ActionsContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function ActionsContainer({ children, style }: ActionsContainerProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});
