/**
 * Actions pour les commandes système communes à tous les modèles
 */

import { CommonBaseActions } from './common-command';
import { KidooActionResult } from '@/types/type';
import type { SystemInfoResponse } from '@/types/bluetooth';

/**
 * Actions pour les commandes système
 */
export class CommonSystemAction extends CommonBaseActions {
  /**
   * Obtenir les informations système du Kidoo
   * @param timeout Timeout en millisecondes (défaut: 30000)
   */
  static async getSystemInfo(timeout: number = 30000): Promise<KidooActionResult<SystemInfoResponse>> {
    return this.sendCommandAndWaitForResponse(
      {
        command: 'VERSION',
      },
      'VERSION',
      timeout
    );
  }
}
