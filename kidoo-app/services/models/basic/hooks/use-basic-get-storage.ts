/**
 * Hook pour récupérer les données de stockage d'un Kidoo
 * Gère automatiquement la récupération depuis BLE (si connecté) ou depuis la base de données
 * 
 * Usage:
 * ```tsx
 * const { data: storage, isLoading, error, refetch } = useBasicGetStorage();
 * ```
 */

import { useKidoo } from '@/services/models/common/contexts/KidooContext';
import { useAuth } from '@/contexts/AuthContext';
import { getKidooStorage } from '@/services/models/basic/api';
import { BasicStorageAction } from '@/services/models/basic/command/basic-command-storage';
import { useBleFirstQuery } from '@/hooks/use-ble-first-query';
import type { StorageGetResponse } from '@/types/bluetooth';
import type { StorageData } from '@/services/models/basic/api';

export interface StorageDataResponse {
  totalBytes?: number;
  freeBytes?: number;
  usedBytes?: number;
  freePercent?: number;
  usedPercent?: number;
}

/**
 * Hook pour récupérer les données de stockage
 * Utilise le pattern "Database First" pour charger rapidement depuis la DB, puis mettre à jour avec BLE
 */
export function useBasicGetStorage() {
  const { isConnected, kidoo } = useKidoo();
  const { user } = useAuth();

  return useBleFirstQuery<
    StorageGetResponse,
    StorageData,
    StorageDataResponse
  >({
    queryKey: ['kidoo', kidoo.id, 'storage'],
    bleQueryFn: () => BasicStorageAction.getStorage(),
    dbQueryFn: () => getKidooStorage(kidoo.id, user?.id),
    isConnected,
    enabled: !!kidoo && !!user?.id,
    transformBleData: (bleData) => ({
      totalBytes: bleData.totalBytes,
      freeBytes: bleData.freeBytes,
      usedBytes: bleData.usedBytes,
      freePercent: bleData.freePercent,
      usedPercent: bleData.usedPercent,
    }),
    transformDbData: (dbData) => ({
      totalBytes: dbData.totalBytes ?? undefined,
      freeBytes: dbData.freeBytes ?? undefined,
      usedBytes: dbData.usedBytes ?? undefined,
      freePercent: dbData.freePercent ?? undefined,
      usedPercent: dbData.usedPercent ?? undefined,
    }),
  });
}
