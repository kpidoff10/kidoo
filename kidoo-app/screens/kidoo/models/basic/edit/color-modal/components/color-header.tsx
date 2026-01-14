/**
 * En-tête de la modale de couleur
 * Affiche le titre
 */

import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

export function ColorHeader() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ThemedText type="title" style={[styles.title, { marginBottom: theme.spacing.xl }]}>
      {t('kidoos.edit.basic.menu.colors.title', 'Couleurs')}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});
