/**
 * Actions pour les commandes NFC communes à tous les modèles
 */

import { CommonBaseActions } from './common-command';
import { KidooActionResult } from '@/types/type';

/**
 * Actions pour les commandes NFC
 */
export class CommonNFCAction extends CommonBaseActions {
  /**
   * Lire un tag NFC
   * @param blockNumber Numéro du bloc NFC à lire
   * @param timeout Timeout en millisecondes (défaut: 15000)
   */
  static async readNFCTag(
    blockNumber: number,
    timeout: number = 15000
  ): Promise<KidooActionResult> {
    return this.sendCommandAndWaitForResponse(
      {
        command: 'READ_NFC_TAG',
        blockNumber,
      },
      'NFC_TAG_READ',
      timeout
    );
  }

  /**
   * Écrire un tag NFC
   * @param blockNumber Numéro du bloc NFC à écrire
   * @param data Données à écrire (tableau de bytes)
   * @param timeout Timeout en millisecondes (défaut: 15000)
   */
  static async writeNFCTag(
    blockNumber: number,
    data: number[],
    timeout: number = 15000
  ): Promise<KidooActionResult> {
    return this.sendCommandAndWaitForResponse(
      {
        command: 'WRITE_NFC_TAG',
        blockNumber,
        data,
      },
      'NFC_TAG_WRITTEN',
      timeout
    );
  }
}
