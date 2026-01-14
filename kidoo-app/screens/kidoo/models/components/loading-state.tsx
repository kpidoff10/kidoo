/**
 * Composant pour afficher un état de chargement
 */

import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { useTranslation } from 'react-i18next';

export function LoadingState() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={theme.components.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.tint} />
      <ThemedText style={{ marginTop: theme.spacing.md, opacity: 0.7 }}>
        {t('common.loading', 'Chargement...')}
      </ThemedText>
    </View>
  );
}
