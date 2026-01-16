/**
 * Hooks pour gérer le timeout de sommeil d'un Kidoo Basic
 * 
 * Usage:
 * ```tsx
 * // Récupérer le timeout de sommeil
 * const { data: sleepTimeout, isLoading, error, refetch } = useBasicGetSleepTimeout();
 * 
 * // Modifier le timeout de sommeil
 * const { mutate: setSleepTimeout, isPending } = useBasicSetSleepTimeout();
 * setSleepTimeout({ timeout: 60000 });
 * ```
 */

import { useKidoo } from '@/services/models/common/contexts/KidooContext';
import { useAuth } from '@/contexts/AuthContext';
import { getKidooSleepTimeout, updateKidooConfigBasic } from '@/services/models/basic/api';
import { BasicSleepModeAction } from '@/services/models/basic/command/basic-command-sleep-mode';
import { useBleFirstQuery } from '@/hooks/use-ble-first-query';
import { useBleMutation } from '@/hooks/use-ble-mutation';
import type { SleepTimeoutGetResponse, SleepTimeoutSetResponse } from '@/types/bluetooth';
import type { SleepTimeoutData } from '@/services/models/basic/api';
import type { SleepTimeoutOptions } from '@/services/models/basic/command/type';
import type { ApiResponse } from '@/services/api';
import type { KidooConfigBasic } from '@/types/shared';

export interface SleepTimeoutDataResponse {
  sleepTimeout: number;
}

/**
 * Hook pour récupérer le timeout de sommeil
 * Utilise le pattern "BLE First" pour charger rapidement depuis BLE, puis mettre à jour avec DB
 */
export function useBasicGetSleepTimeout() {
  const { isConnected, kidoo } = useKidoo();
  const { user } = useAuth();

  return useBleFirstQuery<
    SleepTimeoutGetResponse,
    SleepTimeoutData,
    SleepTimeoutDataResponse
  >({
    queryKey: ['kidoo', kidoo.id, 'sleepTimeout'],
    bleQueryFn: () => BasicSleepModeAction.getSleepTimeout(),
    dbQueryFn: () => getKidooSleepTimeout(kidoo.id, user?.id),
    isConnected,
    enabled: !!kidoo && !!user?.id,
    transformBleData: (bleData) => ({
      sleepTimeout: bleData.timeout,
    }),
    transformDbData: (dbData) => ({
      sleepTimeout: dbData.sleepTimeout,
    }),
  });
}

/**
 * Hook pour modifier le timeout de sommeil
 * Envoie la commande BLE, synchronise avec le serveur, et invalide les queries
 */
export function useBasicSetSleepTimeout() {
  const { kidoo } = useKidoo();
  const { user } = useAuth();

  return useBleMutation<
    SleepTimeoutSetResponse,
    ApiResponse<KidooConfigBasic>,
    SleepTimeoutOptions,
    SleepTimeoutDataResponse
  >({
    queryKey: ['kidoo', kidoo.id, 'sleepTimeout'],
    bleCommandFn: (variables) => BasicSleepModeAction.setSleepTimeout(variables),
    syncFn: async (variables, bleResponse) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      // Utiliser la réponse BLE si disponible, sinon utiliser les variables
      const sleepTimeout = bleResponse?.timeout ?? variables.timeout;
      return updateKidooConfigBasic(kidoo.id, { sleepTimeout }, user.id);
    },
    optimisticUpdate: (_variables, bleResponse, _previousData) => {
      // Utiliser la réponse BLE si disponible, sinon utiliser les variables
      const sleepTimeout = bleResponse?.timeout ?? _variables.timeout;
      return {
        sleepTimeout,
      };
    },
  });
}
