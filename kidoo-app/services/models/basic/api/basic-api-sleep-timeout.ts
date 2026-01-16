/**
 * Service pour gérer le timeout de sommeil des Kidoos Basic
 * GET /api/kidoos/[id] - Récupère les données de sleepTimeout depuis configBasic
 */

import { apiGet, type ApiResponse } from '@/services/api';
import { API_CONFIG } from '@/config/api';
import type { Kidoo } from '@/types/shared';

/**
 * Type pour les données de timeout de sommeil
 */
export interface SleepTimeoutData {
  sleepTimeout: number;
}

/**
 * Récupère le timeout de sommeil d'un Kidoo Basic
 * @param kidooId - ID du Kidoo
 * @param userId - ID de l'utilisateur connecté
 * @returns Le timeout de sommeil (lance une erreur en cas d'échec)
 */
export async function getKidooSleepTimeout(
  kidooId: string,
  userId: string | undefined
): Promise<SleepTimeoutData> {
  if (!userId) {
    throw new Error('Utilisateur non connecté');
  }

  console.log('[KidooBasicSleepTimeout] Tentative de récupération du timeout de sommeil:', kidooId);
  
  const result = await apiGet<ApiResponse<Kidoo>>(
    `${API_CONFIG.endpoints.kidoos}/${kidooId}`,
    {
      headers: {
        'X-User-Id': userId,
      },
    }
  );

  // Si la réponse indique un échec, lancer une erreur
  if (!result.success) {
    throw new Error(result.error || 'Erreur lors de la récupération du timeout de sommeil depuis la base de données');
  }

  // Vérifier que les données sont présentes
  if (!result.data) {
    throw new Error('Données du Kidoo non disponibles');
  }

  // Vérifier que configBasic existe
  if (!result.data.configBasic) {
    throw new Error('Configuration Basic non disponible');
  }

  const sleepTimeout = result.data.configBasic.sleepTimeout;

  // Vérifier que sleepTimeout est défini
  if (sleepTimeout === undefined || sleepTimeout === null) {
    throw new Error('Timeout de sommeil non disponible');
  }

  console.log('[KidooBasicSleepTimeout] Récupération du timeout de sommeil réussie:', sleepTimeout);
  
  return { sleepTimeout };
}
