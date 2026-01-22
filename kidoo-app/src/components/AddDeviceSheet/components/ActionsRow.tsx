/**
 * ActionsRow Component
 * Wrapper pour une ligne d'actions (boutons côte à côte)
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

interface ActionsRowProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function ActionsRow({ children, style }: ActionsRowProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
