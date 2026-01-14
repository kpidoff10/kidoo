/**
 * Composant RssiIndicator
 * Composant générique pour afficher la valeur RSSI (force du signal Bluetooth) avec code couleur
 */

import { View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

interface RssiIndicatorProps {
  rssi: number | null;
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

/**
 * Composant pour afficher la valeur RSSI avec un code couleur
 * - Excellent (> -50 dBm): Vert
 * - Bon (> -70 dBm): Orange
 * - Faible (<= -70 dBm): Rouge
 */
export function RssiIndicator({ rssi, style, containerStyle }: RssiIndicatorProps) {
  const theme = useTheme();

  if (rssi === null || rssi === undefined) {
    return null;
  }

  const getRssiColor = (): string => {
    if (rssi > -50) return theme.staticColors.rssiExcellent;
    if (rssi > -70) return theme.staticColors.rssiGood;
    return theme.staticColors.rssiPoor;
  };

  const containerStyles = containerStyle
    ? [theme.components.bluetoothScanRssiContainer, containerStyle]
    : theme.components.bluetoothScanRssiContainer;

  const textStyles = style
    ? [theme.components.bluetoothScanRssi, { color: getRssiColor() }, style]
    : [theme.components.bluetoothScanRssi, { color: getRssiColor() }];

  return (
    <View style={containerStyles}>
      <ThemedText style={textStyles}>{rssi} dBm</ThemedText>
    </View>
  );
}
