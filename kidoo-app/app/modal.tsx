import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ThemedView style={[
      theme.components.loadingContainer,
      { padding: theme.spacing.xl }
    ]}>
      <ThemedText type="title">{t('modal.title')}</ThemedText>
      <Link href="/" dismissTo style={{ marginTop: theme.spacing.lg, paddingVertical: theme.spacing.lg }}>
        <ThemedText type="link">{t('modal.goHome')}</ThemedText>
      </Link>
    </ThemedView>
  );
}
