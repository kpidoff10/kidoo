/**
 * Composant pour afficher un fichier multimédia individuel dans la liste
 */

import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useCallback, useRef } from 'react';
import ReanimatedSwipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { MultimediaFile } from '@/services/multimediaService';
import { decodeFileName, formatFileSize } from './utils';

export interface MultimediaListItemProps extends RenderItemParams<MultimediaFile> {
  onDelete?: (item: MultimediaFile) => void;
  onDisable?: (item: MultimediaFile) => Promise<void>;
  isLoading?: boolean;
}

export function MultimediaListItem({ item, drag, isActive, onDelete, onDisable, isLoading = false }: MultimediaListItemProps) {
  const theme = useTheme();
  const swipeableRef = useRef<SwipeableMethods>(null);

  // Action de swipe vers la gauche (désactivation et suppression) - mémorisée pour éviter les re-renders
  const renderRightActions = useCallback(() => {
    if (!onDelete && !onDisable) return null;

    const warningColor = (theme.colors as any).warning || theme.colors.tint;

    return (
      <View style={{ flexDirection: 'row', width: onDisable ? 160 : 80 }}>
        {onDisable && (
          <TouchableOpacity
            onPress={async () => {
              if (isLoading) return; // Empêcher les clics multiples
              try {
                await onDisable(item);
                // Fermer seulement après que la requête soit terminée
                swipeableRef.current?.close();
              } catch  {
                // En cas d'erreur, on ferme quand même
                swipeableRef.current?.close();
              }
            }}
            disabled={isLoading}
            style={{
              backgroundColor: warningColor,
              justifyContent: 'center',
              alignItems: 'center',
              width: 80,
              paddingHorizontal: theme.spacing.md,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.background} />
            ) : (
              <IconSymbol 
                name={item.disabled ? "play.circle.fill" : "pause.circle.fill"} 
                size={24} 
                color={theme.colors.background} 
              />
            )}
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            onPress={() => {
              swipeableRef.current?.close();
              onDelete(item);
            }}
            style={{
              backgroundColor: theme.colors.error,
              justifyContent: 'center',
              alignItems: 'center',
              width: 80,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            <IconSymbol name="trash.fill" size={24} color={theme.colors.background} />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [onDelete, onDisable, item, theme.colors, theme.spacing.md, isLoading]);

  return (
    <ScaleDecorator>
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        overshootRight={false}
        overshootFriction={8}
      >
        <View
          style={{
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.xl,
            backgroundColor: theme.colors.background,
          }}
        >
          <View 
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              opacity: isActive ? 0.7 : item.disabled ? 0.5 : 1,
            }}
          >
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <ThemedText style={{ 
                fontSize: theme.typography.fontSize.md, 
                fontWeight: '500',
                opacity: item.disabled ? 0.5 : 1,
              }}>
                {decodeFileName(item.originalName || item.fileName)}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  opacity: item.disabled ? 0.4 : 0.6,
                }}
              >
                {formatFileSize(item.size)}
              </ThemedText>
            </View>
            <View
              onTouchStart={drag}
              style={{ padding: theme.spacing.xs, marginLeft: theme.spacing.sm }}
            >
              <IconSymbol
                name="line.horizontal.3"
                size={18}
                color={theme.colors.text}
                style={{ opacity: 0.4 }}
              />
            </View>
          </View>
        </View>
      </ReanimatedSwipeable>
    </ScaleDecorator>
  );
}
