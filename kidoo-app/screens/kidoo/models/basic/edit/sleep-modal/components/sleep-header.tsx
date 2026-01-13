/**
 * En-tête de la modale de configuration du sommeil
 * Affiche le titre et la valeur actuelle du timeout
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface SleepHeaderProps {
  timeout: number; // Timeout en millisecondes
  isLoading: boolean;
}

// Convertir les millisecondes en secondes pour l'affichage
const formatTimeout = (timeoutMs: number): string => {
  const seconds = Math.round(timeoutMs / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes}min`;
  }
  return `${minutes}min ${remainingSeconds}s`;
};

export function SleepHeader({ timeout, isLoading }: SleepHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.title, { color: theme.colors.text }]}>
        {t('kidoo.edit.basic.sleep.title', 'Temps avant sommeil')}
      </ThemedText>
      <ThemedText style={[styles.value, { color: theme.colors.tint }]}>
        {isLoading ? '...' : formatTimeout(timeout)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
  },
});
