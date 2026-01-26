/**
 * Scan Indicator Component
 * Indicateur visuel du scan en cours
 */

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme';

interface ScanIndicatorProps {
  isScanning: boolean;
}

export function ScanIndicator({ isScanning }: ScanIndicatorProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();

  // Toujours rendre le container pour éviter les sauts visuels
  // Mais ne montrer le contenu que si le scan est en cours
  return (
    <View style={[styles.scanIndicator, { backgroundColor: isScanning ? colors.primary + '15' : 'transparent' }]}>
      {isScanning && (
        <>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text variant="caption" color="primary" style={{ marginLeft: spacing[2] }}>
            {t('bluetooth.scanning', { defaultValue: 'Recherche en cours...' })}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scanIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});
