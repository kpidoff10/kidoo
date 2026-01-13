/**
 * Composant ScanHeader
 * En-tête de la modale de scan avec titre
 */

import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

export function ScanHeader() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={theme.components.bluetoothScanHeader}>
      <ThemedText type="defaultSemiBold" style={theme.components.bluetoothScanTitle}>
        {t('kidoos.scan.title', 'Recherche de Kidoo')}
      </ThemedText>
    </View>
  );
}
