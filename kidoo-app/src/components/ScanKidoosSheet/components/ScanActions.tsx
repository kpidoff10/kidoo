/**
 * Scan Actions Component
 * Boutons d'action pour contrôler le scan
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';

interface ScanActionsProps {
  isScanning: boolean;
  onStartScan: () => void;
}

export function ScanActions({ isScanning, onStartScan }: ScanActionsProps) {
  const { t } = useTranslation();

  // Ne rien afficher si le scan est en cours (on ne veut pas pouvoir l'arrêter)
  if (isScanning) {
    return null;
  }

  return (
    <View style={styles.actions}>
      <Button
        title={t('bluetooth.scan', { defaultValue: 'Rechercher' })}
        variant="primary"
        onPress={onStartScan}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: 16,
  },
});
