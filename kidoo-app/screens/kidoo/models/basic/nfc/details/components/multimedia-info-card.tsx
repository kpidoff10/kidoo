/**
 * Carte d'information sur le contenu multimédia d'un tag
 */

import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export function MultimediaInfoCard() {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceSecondary,
        borderRadius: theme.spacing.md,
        padding: theme.spacing.xl,
        alignItems: 'center',
        gap: theme.spacing.md,
      }}
    >
      <IconSymbol
        name="music.note"
        size={32}
        color={theme.colors.tint}
      />
      <View style={{ gap: theme.spacing.xs, alignItems: 'center' }}>
        <ThemedText
          style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          Contenu multimédia
        </ThemedText>
        <ThemedText
          style={{
            fontSize: theme.typography.fontSize.md,
            opacity: 0.7,
            textAlign: 'center',
            lineHeight: theme.typography.fontSize.md * 1.5,
          }}
        >
          Ici vous pourrez lier des pistes audio, histoires, vocaux et autres contenus multimédias à ce tag NFC.
        </ThemedText>
      </View>
    </View>
  );
}
