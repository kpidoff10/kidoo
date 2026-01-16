/**
 * Composant pour afficher l'état vide de la liste des fichiers multimédias
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

export function MultimediaListEmpty() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View
      style={{
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          gap: theme.spacing.md,
          maxWidth: 300,
        }}
      >
        {/* Titre */}
        <ThemedText
          type="title"
          style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: theme.spacing.xs,
          }}
        >
          {t('kidoos.multimedia.empty.title', 'Aucun fichier multimédia')}
        </ThemedText>

        {/* Description */}
        <ThemedText
          style={{
            fontSize: theme.typography.fontSize.md,
            textAlign: 'center',
            opacity: 0.7,
            lineHeight: theme.typography.fontSize.md * 1.5,
          }}
        >
          {t(
            'kidoos.multimedia.empty.description',
            'Ajoutez votre premier fichier audio, histoire ou vocal en appuyant sur le bouton + ci-dessous.'
          )}
        </ThemedText>
      </View>
    </View>
  );
}
