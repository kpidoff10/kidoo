/**
 * Service pour gérer le stockage des Kidoos Basic
 * GET /api/kidoos/[id]/config-basic/storage - Récupère les données de stockage
 */

import { apiGet, type ApiResponse } from '@/services/api';
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
 * @returns Les données de stockage (lance une erreur en cas d'échec)
 */
export async function getKidooStorage(
  kidooId: string,
  userId: string | undefined
): Promise<StorageData> {
  if (!userId) {
    throw new Error('Utilisateur non connecté');
  }

  console.log('[KidooBasicStorage] Tentative de récupération du stockage:', kidooId);
  
  const result = await apiGet<ApiResponse<StorageData>>(
    `${API_CONFIG.endpoints.kidoos}/${kidooId}/config-basic/storage`,
    {
      headers: {
        'X-User-Id': userId,
      },
    }
  );

  // Si la réponse indique un échec, lancer une erreur
  if (!result.success) {
    throw new Error(result.error || 'Erreur lors de la récupération du stockage depuis la base de données');
  }

  // Vérifier que les données sont présentes
  if (!result.data) {
    throw new Error('Données de stockage non disponibles');
  }

  console.log('[KidooBasicStorage] Récupération du stockage réussie:', result.data);
  
  return result.data;
}
