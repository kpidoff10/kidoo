/**
 * Composant pour afficher le nombre total de tags dans une carte stylisée
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export interface TagsCountCardProps {
  count: number;
}

export function TagsCountCard({ count }: TagsCountCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceSecondary,
        paddingVertical: theme.spacing.xl,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
        {/* Icône à gauche - prend toute la hauteur */}
        <View style={{ justifyContent: 'center' }}>
          <IconSymbol name="tag.fill" size={32} color={theme.colors.tint} />
        </View>

        {/* Contenu à droite */}
        <View style={{ flex: 1 }}>
          <ThemedText
            style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: '700',
            }}
          >
            {count} {count === 1 ? t('kidoos.tags.tag', 'tag') : t('kidoos.tags.tags', 'tags')}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
