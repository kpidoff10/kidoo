/**
 * Composant pour afficher les informations de stockage d'un Kidoo
 */

import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { AlertMessage } from '@/components/ui/alert-message';
import { useKidoo } from '@/services/models/common/contexts/KidooContext';
import { useBasicGetStorage } from '@/services/models/basic/hooks/use-basic-get-storage';
import { StorageInfoSkeleton } from './storage-info-skeleton';

export function StorageInfo() {

  const { t } = useTranslation();
  const theme = useTheme();
  const { kidooModel, kidoo } = useKidoo();
  
  // Utiliser le hook qui gère automatiquement BLE ou DB
  const { data: storage, isLoading, error } = useBasicGetStorage();

  const isBasicModel = kidooModel?.toLowerCase() === 'basic' || kidoo.model?.toLowerCase() === 'basic';

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getStorageValues = () => {
    if (!storage) return null;
    
    const total = storage.totalBytes || 0;
    const free = storage.freeBytes || 0;
    const used = storage.usedBytes || (total - free);
    const usedPercent = storage.usedPercent !== undefined 
      ? storage.usedPercent 
      : total > 0 ? Math.round((used / total) * 100) : 0;
    const freePercent = storage.freePercent !== undefined 
      ? storage.freePercent 
      : total > 0 ? Math.round((free / total) * 100) : 0;

    return { total, free, used, usedPercent, freePercent };
  };

  const storageValues = getStorageValues();

  // Convertir l'erreur en string pour l'affichage
  const errorMessage = error ? (error instanceof Error ? error.message : String(error)) : null;

  const getBarColor = (freePercent: number): string => {
    if (freePercent < 20) {
      // Moins de 20% libre = Rouge
      return theme.colors.error;
    } else if (freePercent < 50) {
      // Entre 20% et 50% libre = Bleu
      return theme.colors.tint;
    } else {
      // Plus de 50% libre = Vert
      return theme.colors.success;
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceSecondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
      }}
    >
      {isLoading || !isBasicModel ? (
        <StorageInfoSkeleton />
      ) : (
        <>
          <ThemedText
            type="defaultSemiBold"
            style={{
              marginBottom: theme.spacing.md,
              fontSize: theme.typography.fontSize.md,
            }}
          >
            {t('kidoos.detail.storage.title', 'Stockage')}
          </ThemedText>

          {errorMessage ? (
            <AlertMessage
              type="error"
              message={errorMessage}
              style={{ marginTop: 0 }}
            />
          ) : storageValues ? (
        <View>
          {/* Barre de progression avec informations */}
          <View
            style={{
              height: 48,
              backgroundColor: theme.colors.border,
              borderRadius: theme.borderRadius.md,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Partie remplie de la barre */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${storageValues.usedPercent}%`,
                backgroundColor: getBarColor(storageValues.freePercent),
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: theme.spacing.sm,
              }}
            >
              {storageValues.usedPercent > 15 && (
                <ThemedText
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: '#FFFFFF',
                  }}
                >
                  {formatBytes(storageValues.used)} / {formatBytes(storageValues.total)}
                </ThemedText>
              )}
            </View>

            {/* Partie libre de la barre avec texte */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: '100%',
                width: `${storageValues.freePercent}%`,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: theme.spacing.sm,
              }}
            >
              {storageValues.freePercent > 15 && (
                <ThemedText
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text,
                  }}
                >
                  {formatBytes(storageValues.free)} ({storageValues.freePercent}%)
                </ThemedText>
              )}
            </View>

            {/* Texte centré si la barre est trop petite pour afficher les deux */}
            {storageValues.usedPercent <= 15 && storageValues.freePercent <= 15 && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: theme.spacing.sm,
                }}
              >
                <ThemedText
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text,
                  }}
                >
                  {formatBytes(storageValues.free)} libre / {formatBytes(storageValues.total)} total
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      ) : null}
        </>
      )}
    </View>
  );
}
