/**
 * Composant ScanHeader
 * En-tête de la modale de scan avec titre et bouton de scan
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ScanHeaderProps {
  isScanning: boolean;
  isAvailable: boolean;
  onStartScan: () => void;
}

export function ScanHeader({ isScanning, isAvailable, onStartScan }: ScanHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={theme.components.bluetoothScanHeader}>
      <ThemedText type="defaultSemiBold" style={theme.components.bluetoothScanTitle}>
        {t('kidoos.scan.title', 'Recherche de Kidoo')}
      </ThemedText>
      {!isScanning && isAvailable && (
        <TouchableOpacity style={theme.components.scanButton} onPress={onStartScan} activeOpacity={0.8}>
          <IconSymbol name="cube.fill" size={theme.iconSize.sm} color={theme.staticColors.white} />
          <ThemedText style={theme.components.scanButtonText}>
            {t('kidoos.scan.start', 'Scanner')}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}
