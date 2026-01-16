/**
 * Composant pour afficher le contenu de la liste des fichiers multimédias avec drag and drop
 */

import { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useTheme } from '@/hooks/use-theme';
import type { MultimediaFile } from '@/services/multimediaService';
import { MultimediaListItem } from './multimedia-list-item';

interface MultimediaListContentProps {
  files: MultimediaFile[];
  onDragEnd: ({ data }: { data: MultimediaFile[] }) => void;
  onRefresh: () => void;
  isRefetching: boolean;
  onDelete?: (item: MultimediaFile) => void;
  onDisable?: (item: MultimediaFile) => Promise<void>;
  isUpdatingStatus?: boolean;
  fileIdBeingUpdated?: string;
}

export function MultimediaListContent({
  files,
  onDragEnd,
  onRefresh,
  isRefetching,
  onDelete,
  onDisable,
  isUpdatingStatus,
  fileIdBeingUpdated,
}: MultimediaListContentProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Fonction pour rendre un item avec divider
  const renderItem = useCallback(
    (props: RenderItemParams<MultimediaFile>) => {
      const index = files.findIndex(f => f.id === props.item.id);
      return (
        <View>
          <MultimediaListItem 
            {...props} 
            onDelete={onDelete} 
            onDisable={onDisable}
            isLoading={isUpdatingStatus && fileIdBeingUpdated === props.item.id}
          />
          {index < files.length - 1 && (
            <View style={theme.components.dividerThin} />
          )}
        </View>
      );
    },
    [files, theme.components.dividerThin, onDelete, onDisable, isUpdatingStatus, fileIdBeingUpdated]
  );

  return (
    <DraggableFlatList<MultimediaFile>
      data={files}
      onDragEnd={onDragEnd}
      keyExtractor={(item: MultimediaFile) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingTop: theme.spacing.md,
        paddingBottom: insets.bottom + 200, // Espace pour le bouton flottant
      }}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      activationDistance={20} // Distance minimale avant d'activer le drag (permet le pull-to-refresh)
    />
  );
}
