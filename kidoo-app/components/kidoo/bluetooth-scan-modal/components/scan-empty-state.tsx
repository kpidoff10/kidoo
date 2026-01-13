/**
 * Composant ScanEmptyState
 * Affiche l'état vide de la liste de scan (aucun appareil trouvé ou en attente)
 */

import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ScanEmptyStateProps {
  isScanning: boolean;
}

export function ScanEmptyState({ isScanning }: ScanEmptyStateProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={theme.components.bluetoothScanEmptyState}>
      <IconSymbol name="cube.fill" size={theme.iconSize.lg} color={theme.colors.icon} />
      <ThemedText style={theme.components.bluetoothScanEmptyStateText}>
        {isScanning
          ? t('kidoos.scan.noDevicesFound', 'Aucun appareil Kidoo trouvé')
          : t('kidoos.scan.waiting', 'En attente du scan...')}
      </ThemedText>
    </View>
  );
}
