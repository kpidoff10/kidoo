/**
 * En-tête de la modale de configuration du sommeil
 * Affiche le titre et la valeur actuelle du timeout
 */

import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

interface SleepHeaderProps {
  sleepTimeout?: number;
  isLoading?: boolean;
}

// Fonction pour formater le timeout en texte lisible
const formatTimeout = (timeout: number): string => {
  if (timeout < 1000) {
    return `${timeout}ms`;
  }
  const seconds = Math.floor(timeout / 1000);
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

export function SleepHeader({
  sleepTimeout,
  isLoading = false,
}: SleepHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      {/* Titre */}
      <ThemedText type="title" style={[styles.title, { marginBottom: theme.spacing.xl }]}>
        {t('kidoo.edit.basic.sleep.title', 'Temps avant sommeil')}
      </ThemedText>

      {/* Valeur actuelle */}
      <View style={styles.valueContainer}>
        {isLoading ? (
          <ThemedText style={[styles.value, { fontSize: theme.typography.fontSize.xxxl, opacity: 0.5 }]}>
            ...
          </ThemedText>
        ) : sleepTimeout !== undefined ? (
          <ThemedText style={[styles.value, { fontSize: theme.typography.fontSize.xxxl }]}>
            {formatTimeout(sleepTimeout)}
          </ThemedText>
        ) : null}
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
