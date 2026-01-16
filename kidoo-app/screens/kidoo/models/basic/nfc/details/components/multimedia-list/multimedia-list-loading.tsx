/**
 * Composant pour afficher l'état de chargement de la liste des fichiers multimédias
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

export function MultimediaListLoading() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.md }}>
      <ThemedText style={{ opacity: 0.7, marginBottom: theme.spacing.lg }}>
        {t('common.loading', 'Chargement...')}
      </ThemedText>
    </View>
  );
}
