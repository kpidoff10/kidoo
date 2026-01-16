/**
 * Action pour gérer le stockage du modèle Basic
 */

import { KidooActionResult } from '@/types/type';
import { CommonKidooActions } from '../../common/command';

/**
 * Actions pour le stockage
 */
export class BasicStorageAction extends CommonKidooActions {
  /**
   * Récupérer les informations de stockage de la carte SD
   */
  static async getStorage(): Promise<KidooActionResult> {
    return this.sendCommandAndWaitForResponse(
      {
        command: 'GET_STORAGE',
      },
      'STORAGE_GET'
    );
  }
}
