/**
 * Hooks pour gérer la luminosité d'un Kidoo Basic
 * 
 * Usage:
 * ```tsx
 * // Récupérer la luminosité
 * const { data: brightness, isLoading, error, refetch } = useBasicGetBrightness();
 * 
 * // Modifier la luminosité
 * const { mutate: setBrightness, isPending } = useBasicSetBrightness();
 * setBrightness({ percent: 50 });
 * ```
 */

import { useKidoo } from '@/services/models/common/contexts/KidooContext';
import { useAuth } from '@/contexts/AuthContext';
import { getKidooBrightness, updateKidooConfigBasic } from '@/services/models/basic/api';
import { BasicBrightnessAction } from '@/services/models/basic/command/basic-command-brightness';
import { useBleFirstQuery } from '@/hooks/use-ble-first-query';
import { useBleMutation } from '@/hooks/use-ble-mutation';
import type { BrightnessGetResponse, BrightnessSetResponse } from '@/types/bluetooth';
import type { BrightnessData } from '@/services/models/basic/api';
import type { BrightnessOptions } from '@/services/models/basic/command/type';
import type { ApiResponse } from '@/services/api';
import type { KidooConfigBasic } from '@/types/shared';

export interface BrightnessDataResponse {
  brightness: number;
}

/**
 * Hook pour récupérer la luminosité
 * Utilise le pattern "BLE First" pour charger rapidement depuis BLE, puis mettre à jour avec DB
 */
export function useBasicGetBrightness() {
  const { isConnected, kidoo } = useKidoo();
  const { user } = useAuth();

  return useBleFirstQuery<
    BrightnessGetResponse,
    BrightnessData,
    BrightnessDataResponse
  >({
    queryKey: ['kidoo', kidoo.id, 'brightness'],
    bleQueryFn: () => BasicBrightnessAction.getBrightness(),
    dbQueryFn: () => getKidooBrightness(kidoo.id, user?.id),
    isConnected,
    enabled: !!kidoo && !!user?.id,
    transformBleData: (bleData) => ({
      brightness: bleData.brightness,
    }),
    transformDbData: (dbData) => ({
      brightness: dbData.brightness,
    }),
  });
}

/**
 * Hook pour modifier la luminosité
 * Envoie la commande BLE, synchronise avec le serveur, et invalide les queries
 */
export function useBasicSetBrightness() {
  const { kidoo } = useKidoo();
  const { user } = useAuth();

  return useBleMutation<
    BrightnessSetResponse,
    ApiResponse<KidooConfigBasic>,
    BrightnessOptions,
    BrightnessDataResponse
  >({
    queryKey: ['kidoo', kidoo.id, 'brightness'],
    bleCommandFn: (variables) => BasicBrightnessAction.setBrightness(variables),
    syncFn: async (variables, bleResponse) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      // Utiliser la réponse BLE si disponible, sinon utiliser les variables
      const brightness = bleResponse?.brightness ?? variables.percent;
      return updateKidooConfigBasic(kidoo.id, { brightness }, user.id);
    },
    optimisticUpdate: (_variables, bleResponse, _previousData) => {
      // Utiliser la réponse BLE si disponible, sinon utiliser les variables
      const brightness = bleResponse?.brightness ?? _variables.percent;
      return {
        brightness,
      };
    },
  });
}
