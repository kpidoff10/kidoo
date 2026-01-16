/**
 * API pour gérer la configuration des Kidoos Basic
 * PATCH /api/kidoos/[id]/config-basic - Met à jour la configuration Basic
 */

import { apiPatch, ApiException, type ApiResponse } from '@/services/api';
import { API_CONFIG } from '@/config/api';
import { queryClient } from '@/providers/QueryProvider';
import { kidooKeys } from '@/services/models/common/api';
import type { KidooConfigBasic } from '@/types/shared';

/**
 * Met à jour la configuration Basic d'un Kidoo
 * @param kidooId - ID du Kidoo
 * @param data - Données de configuration Basic à mettre à jour
 * @param userId - ID de l'utilisateur connecté
 * @returns Succès ou erreur
 */
export async function updateKidooConfigBasic(
  kidooId: string,
  data: {
    brightness?: number;
    sleepTimeout?: number;
    storageTotalBytes?: number | null;
    storageFreeBytes?: number | null;
    storageUsedBytes?: number | null;
    storageFreePercent?: number | null;
    storageUsedPercent?: number | null;
  },
  userId: string
): Promise<ApiResponse<KidooConfigBasic>> {
  try {
    console.log('[BasicApiConfig] Tentative de mise à jour de la config Basic:', kidooId);
    
    const result = await apiPatch<ApiResponse<KidooConfigBasic>>(
      `${API_CONFIG.endpoints.kidoos}/${kidooId}/config-basic`,
      data,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    console.log('[BasicApiConfig] Mise à jour config Basic réussie:', result);
    
    // Invalider le cache React Query après mise à jour
    if (result.success) {
      queryClient.invalidateQueries({
        queryKey: kidooKeys.detail(kidooId),
      });
    }
    
    return result;
  } catch (error) {
    console.error('[BasicApiConfig] Exception lors de la mise à jour de la config Basic:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la mise à jour de la configuration Basic',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la mise à jour de la configuration Basic',
    };
  }
}
