/**
 * Composant KidooList
 * Affiche la liste des appareils Kidoo
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { KidooCard } from './kidoo-card';
import { EmptyState } from '@/components/ui/screen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Kidoo } from '@/types/shared';

interface KidooListProps {
  kidoos: Kidoo[];
  onKidooPress?: (kidoo: Kidoo) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function KidooList({
  kidoos,
  onKidooPress,
  emptyTitle = 'Aucun Kidoo',
  emptyDescription = 'Vous n\'avez pas encore de Kidoo. Ajoutez votre premier appareil pour commencer.',
}: KidooListProps) {
  const theme = useTheme();

  if (kidoos.length === 0) {
    const emptyStateIcon = (
      <IconSymbol name="cube.fill" size={theme.iconSize.xxl} color={theme.colors.icon} />
    );

    return (
      <View style={theme.components.kidooListContainer}>
        <EmptyState
          icon={emptyStateIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      </View>
    );
  }

  return (
    <View style={theme.components.kidooList}>
      {kidoos.map((kidoo) => (
        <KidooCard
          key={kidoo.id}
          kidoo={kidoo}
          onPress={onKidooPress ? () => onKidooPress(kidoo) : undefined}
        />
      ))}
    </View>
  );
}
