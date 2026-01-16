/**
 * Composant pour afficher l'état d'erreur de la liste des fichiers multimédias
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import type { ApiResponse } from '@/services/api';

interface MultimediaListErrorProps {
  error?: Error | null;
  data?: ApiResponse<unknown>;
}

export function MultimediaListError({ error, data }: MultimediaListErrorProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const errorMessage =
    (data && !data.success && 'error' in data)
      ? data.error
      : error?.message || t('kidoos.multimedia.error', 'Erreur lors du chargement des fichiers');

  return (
    <View style={{ paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.md }}>
      <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.lg }}>
        {t('common.error', 'Erreur')}: {errorMessage}
      </ThemedText>
    </View>
  );
}
