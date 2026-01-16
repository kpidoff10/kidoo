/**
 * Service pour gérer le stockage des Kidoos Basic
 * GET /api/kidoos/[id]/config-basic/storage - Récupère les données de stockage
 */

import { apiGet, ApiException, type ApiResponse } from '@/services/api';
import { API_CONFIG } from '@/config/api';

/**
 * Type pour les données de stockage
 */
export interface StorageData {
  totalBytes: number | null;
  freeBytes: number | null;
  usedBytes: number | null;
  freePercent: number | null;
  usedPercent: number | null;
  storageLastUpdated: string | null;
}

/**
 * Récupère les données de stockage d'un Kidoo Basic
 * @param kidooId - ID du Kidoo
 * @param userId - ID de l'utilisateur connecté
 * @returns Les données de stockage ou une erreur
 */
export async function getKidooStorage(
  kidooId: string,
  userId: string
): Promise<ApiResponse<StorageData>> {
  try {
    console.log('[KidooBasicStorage] Tentative de récupération du stockage:', kidooId);
    
    const result = await apiGet<ApiResponse<StorageData>>(
      `${API_CONFIG.endpoints.kidoos}/${kidooId}/config-basic/storage`,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    console.log('[KidooBasicStorage] Récupération du stockage réussie:', result);
    
    return result;
  } catch (error) {
    console.error('[KidooBasicStorage] Exception lors de la récupération du stockage:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la récupération du stockage',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la récupération du stockage',
    };
  }
}
