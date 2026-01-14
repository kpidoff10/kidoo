/**
 * Modale d'édition pour le modèle Classic
 * Utilise le contexte Bluetooth pour gérer la connexion automatique
 */

import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

export function ClassicEditModal() {
  const { t } = useTranslation();
  const theme = useTheme();


  return (
    <ScrollView
      style={theme.components.setupStepContent}
      contentContainerStyle={theme.components.setupStepContentScroll}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="title" style={{ marginBottom: theme.spacing.lg }}>
        {t('kidoos.edit.classic.title', 'Modifier le Kidoo Classic')}
      </ThemedText>

      <ThemedText style={{ marginBottom: theme.spacing.xl, opacity: 0.8 }}>
        {t('kidoos.edit.classic.description', 'Paramètres spécifiques au modèle Classic')}
      </ThemedText>
    </ScrollView>
  );
}
