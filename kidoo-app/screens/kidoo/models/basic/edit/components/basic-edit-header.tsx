/**
 * Composant pour le header de la modale d'édition Basic
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

export function BasicEditHeader() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <ThemedText type="title" style={{ marginBottom: theme.spacing.lg }}>
        {t('kidoos.edit.basic.title', 'Modifier le Kidoo Basic')}
      </ThemedText>

      <ThemedText style={{ marginBottom: theme.spacing.xl, opacity: 0.8 }}>
        {t('kidoos.edit.basic.description', 'Paramètres spécifiques au modèle Basic')}
      </ThemedText>
    </>
  );
}
