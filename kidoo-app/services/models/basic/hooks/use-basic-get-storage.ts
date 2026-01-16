/**
 * Hook pour récupérer les données de stockage d'un Kidoo
 * Gère automatiquement la récupération depuis BLE (si connecté) ou depuis la base de données
 * 
 * Usage:
 * ```tsx
 * const { data: storage, isLoading, error, refetch } = useBasicGetStorage();
 * ```
 */

import { useQuery } from '@tanstack/react-query';
import { useKidoo } from '@/services/models/common/contexts/KidooContext';
import { useAuth } from '@/contexts/AuthContext';
import { getKidooStorage } from '@/services/models/basic/api';
import type { StorageGetResponse } from '@/types/bluetooth';

export interface StorageDataResponse {
  totalBytes?: number;
  freeBytes?: number;
  usedBytes?: number;
  freePercent?: number;
  usedPercent?: number;
}

/**
 * Hook pour récupérer les données de stockage
 * - Si BLE est connecté : récupère via BLE (données en temps réel)
 * - Si BLE n'est pas connecté : récupère depuis la DB via l'API (dernières valeurs connues)
 */
export function useBasicGetStorage() {
  const { isConnected, getStorage, kidoo } = useKidoo();
  const { user } = useAuth();

  return useQuery<StorageDataResponse | null, Error>({
    queryKey: ['kidoo', kidoo.id, 'storage', isConnected],
    queryFn: async () => {
      // Si BLE est connecté, récupérer via BLE
      if (isConnected) {
        try {
          const response: StorageGetResponse = await getStorage({
            timeout: 5000,
            timeoutErrorMessage: 'Erreur lors de la récupération du stockage',
          });

          if (response.status === 'success') {
            return {
              totalBytes: response.totalBytes,
              freeBytes: response.freeBytes,
              usedBytes: response.usedBytes,
              freePercent: response.freePercent,
              usedPercent: response.usedPercent,
            };
          }

          throw new Error(response.error || 'Erreur lors de la récupération du stockage');
        } catch (error) {
          // En cas d'erreur BLE, fallback sur l'API
          console.warn('[useBasicGetStorage] Erreur BLE, utilisation de l\'API:', error);
          if (user?.id) {
            const apiResult = await getKidooStorage(kidoo.id, user.id);
            if (apiResult.success && apiResult.data) {
              return {
                totalBytes: apiResult.data.totalBytes ?? undefined,
                freeBytes: apiResult.data.freeBytes ?? undefined,
                usedBytes: apiResult.data.usedBytes ?? undefined,
                freePercent: apiResult.data.freePercent ?? undefined,
                usedPercent: apiResult.data.usedPercent ?? undefined,
              };
            }
          }
          return null;
        }
      }

      // Si BLE n'est pas connecté, récupérer depuis l'API
      if (user?.id) {
        const apiResult = await getKidooStorage(kidoo.id, user.id);
        if (apiResult.success && apiResult.data) {
          return {
            totalBytes: apiResult.data.totalBytes ?? undefined,
            freeBytes: apiResult.data.freeBytes ?? undefined,
            usedBytes: apiResult.data.usedBytes ?? undefined,
            freePercent: apiResult.data.freePercent ?? undefined,
            usedPercent: apiResult.data.usedPercent ?? undefined,
          };
        }
      }

      return null;
    },
    enabled: !!kidoo && !!user?.id,
    staleTime: isConnected ? 10000 : 60000, // 10s si connecté, 60s si déconnecté
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
