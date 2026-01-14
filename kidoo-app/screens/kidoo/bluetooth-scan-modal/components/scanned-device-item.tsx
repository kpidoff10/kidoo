/**
 * Composant ScannedDeviceItem
 * Affiche un appareil Kidoo scanné dans la liste
 */
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RssiIndicator } from '@/components/ui/rssi-indicator';

interface ScannedDeviceItemProps {
  device: {
    id: string;
    name: string | null;
    rssi: number | null;
    isConnectable: boolean | null;
  };
  onPress: () => void;
  isDeveloperMode: boolean;
}

export function ScannedDeviceItem({ device, onPress, isDeveloperMode }: ScannedDeviceItemProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity style={theme.components.bluetoothScanItem} onPress={onPress} activeOpacity={0.7}>
      <View style={theme.components.iconContainer}>
        <IconSymbol name="cube.fill" size={theme.iconSize.md} color={theme.colors.tint} />
      </View>
      <View style={theme.components.bluetoothScanItemInfo}>
        <ThemedText type="defaultSemiBold" style={theme.components.bluetoothScanItemName}>
          {device.name || 'Kidoo'}
        </ThemedText>
        <ThemedText style={theme.components.bluetoothScanItemDetails}>
          {device.isConnectable !== false ? 'Disponible' : 'Non disponible'}
        </ThemedText>
      </View>
      {isDeveloperMode && <RssiIndicator rssi={device.rssi} />}
    </TouchableOpacity>
  );
}
