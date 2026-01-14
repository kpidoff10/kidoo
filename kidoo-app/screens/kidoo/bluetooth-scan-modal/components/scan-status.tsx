/**
 * Composant ScanStatus
 * Affiche le statut du scan (en cours ou en attente)
 */

import { View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ScanStatusProps {
  isScanning: boolean;
}

export function ScanStatus({ isScanning }: ScanStatusProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={theme.components.bluetoothScanStatus}>
      {isScanning ? (
        <>
          <ActivityIndicator size="small" color={theme.colors.tint} />
          <ThemedText style={theme.components.bluetoothScanStatusText}>
            {t('kidoos.scan.scanning', 'Recherche en cours...')}
          </ThemedText>
        </>
      ) : (
        <>
          <IconSymbol name="cube.fill" size={theme.iconSize.sm} color={theme.colors.icon} />
          <ThemedText style={theme.components.bluetoothScanStatusText}>
            {t('kidoos.scan.notScanning', 'Appuyez sur Scanner pour commencer')}
          </ThemedText>
        </>
      )}
    </View>
  );
}
