/**
 * Action pour gérer le stockage du modèle Basic
 */

import { CommonKidooActions } from '../../common/command';
import type { StorageGetResponse } from '@/types/bluetooth';

/**
 * Actions pour le stockage
 */
export class BasicStorageAction extends CommonKidooActions {
  /**
   * Récupérer les informations de stockage de la carte SD
   * @returns Les données de stockage (lance une erreur en cas d'échec)
   */
  static async getStorage(): Promise<StorageGetResponse> {
    const result = await this.sendCommandAndWaitForResponse(
      {
        command: 'GET_STORAGE',
      },
      'STORAGE_GET'
    );

    // Si la commande a échoué, lancer une erreur
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors de la récupération du stockage via BLE');
    }

    // Vérifier que les données sont présentes
    if (!result.data) {
      throw new Error('Données de stockage non disponibles');
    }

    const response = result.data as StorageGetResponse;

    // Vérifier que le statut est success
    if (response.status !== 'success') {
      throw new Error(response.error || 'Erreur lors de la récupération du stockage via BLE');
    }

    return response;
  }
}
