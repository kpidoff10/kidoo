/**
 * Composant pour afficher un item de tag NFC dans la liste
 */

import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedText } from '@/components/themed-text';
import type { Tag } from '@/shared';

export interface TagListItemProps {
  tag: Tag;
  onPress?: (tag: Tag) => void;
}

export function TagListItem({ tag, onPress }: TagListItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isDeveloperMode } = useAuth();

  const displayName = tag.name || t('kidoos.tags.unnamed', 'Tag sans nom');
  const hasUID = tag.uid !== null && tag.uid !== undefined;

  return (
    <TouchableOpacity
      style={[
        {
          paddingVertical: theme.spacing.md,
        
        },
        onPress && { opacity: 1 },
      ]}
      onPress={() => onPress?.(tag)}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Contenu */}
        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          <ThemedText style={{ fontSize: theme.typography.fontSize.md, fontWeight: '500' }}>
            {displayName}
          </ThemedText>
          {isDeveloperMode && hasUID && (
            <ThemedText
              style={{
                fontSize: theme.typography.fontSize.sm,
                opacity: 0.6,
                fontFamily: 'monospace',
              }}
            >
              UID: {tag.uid}
            </ThemedText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
