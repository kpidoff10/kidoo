/**
 * Empty State Component
 * Composant pour afficher l'état vide (scanning ou aucun device trouvé)
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from '@/components/ui';
import { useTheme } from '@/theme';

interface EmptyStateProps {
  isScanning: boolean;
  onRefresh: () => void;
}

export function EmptyState({ isScanning, onRefresh }: EmptyStateProps) {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  
  // Le ScanIndicator en haut gère déjà l'affichage du scan
  if (isScanning) {
    return (
      <View style={styles.emptyContainer}>
        <Text color="secondary" center style={{ marginTop: spacing[4] }}>
          {t('bluetooth.scanningDescription', { 
            defaultValue: 'Assurez-vous que votre Kidoo est allumé et à proximité' 
          })}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={colors.textTertiary} />
      <Text color="secondary" center style={{ marginTop: spacing[4] }}>
        {t('bluetooth.noDevicesFound', { defaultValue: 'Aucun Kidoo trouvé' })}
      </Text>
      <Text variant="caption" color="tertiary" center style={{ marginTop: spacing[2] }}>
        {t('bluetooth.noDevicesDescription', { 
          defaultValue: 'Appuyez sur "Rechercher" pour scanner à nouveau' 
        })}
      </Text>
      <Button
        title={t('bluetooth.scan', { defaultValue: 'Rechercher' })}
        variant="primary"
        onPress={onRefresh}
        style={{ marginTop: spacing[4] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
});
