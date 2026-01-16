/**
 * Service pour gérer la luminosité des Kidoos Basic
 * GET /api/kidoos/[id] - Récupère les données de luminosité depuis configBasic
 */

import { apiGet, type ApiResponse } from '@/services/api';
import { API_CONFIG } from '@/config/api';
import type { Kidoo } from '@/types/shared';

/**
 * Type pour les données de luminosité
 */
export interface BrightnessData {
  brightness: number;
}

/**
 * Récupère la luminosité d'un Kidoo Basic
 * @param kidooId - ID du Kidoo
 * @param userId - ID de l'utilisateur connecté
 * @returns La luminosité (lance une erreur en cas d'échec)
 */
export async function getKidooBrightness(
  kidooId: string,
  userId: string | undefined
): Promise<BrightnessData> {
  if (!userId) {
    throw new Error('Utilisateur non connecté');
  }

  console.log('[KidooBasicBrightness] Tentative de récupération de la luminosité:', kidooId);
  
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
    throw new Error(result.error || 'Erreur lors de la récupération de la luminosité depuis la base de données');
  }

  // Vérifier que les données sont présentes
  if (!result.data) {
    throw new Error('Données du Kidoo non disponibles');
  }

  // Vérifier que configBasic existe
  if (!result.data.configBasic) {
    throw new Error('Configuration Basic non disponible');
  }

  const brightness = result.data.configBasic.brightness;

  // Vérifier que brightness est défini
  if (brightness === undefined || brightness === null) {
    throw new Error('Luminosité non disponible');
  }

  console.log('[KidooBasicBrightness] Récupération de la luminosité réussie:', brightness);
  
  return { brightness };
}
