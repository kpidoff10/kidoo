/**
 * En-tête de la modale de luminosité
 * Affiche le titre et la valeur actuelle de la luminosité
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

interface BrightnessHeaderProps {
  brightness: number;
  isLoading?: boolean;
}

export function BrightnessHeader({
  brightness,
  isLoading = false,
}: BrightnessHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      {/* Titre */}
      <ThemedText type="title" style={[styles.title, { marginBottom: theme.spacing.xl }]}>
        {t('kidoos.edit.basic.menu.brightness.title', 'Luminosité')}
      </ThemedText>

      {/* Valeur actuelle */}
      <View style={styles.valueContainer}>
        {isLoading ? (
          <ThemedText style={[styles.value, { fontSize: theme.typography.fontSize.xxxl, opacity: 0.5 }]}>
            ...
          </ThemedText>
        ) : (
          <ThemedText style={[styles.value, { fontSize: theme.typography.fontSize.xxxl }]}>
            {brightness}%
          </ThemedText>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  valueContainer: {
    marginBottom: 32,
  },
  value: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
