/**
 * Commande pour gérer les tags NFC du modèle Basic
 */

import { KidooActionResult } from '@/types/type';
import { CommonKidooActions } from '../../common/command';

/**
 * Commandes pour les tags NFC du modèle Basic
 */
export class BasicTagCommand extends CommonKidooActions {
  /**
   * Envoyer la commande TAG_ADD_SUCCESS pour afficher l'effet de succès
   * Cette commande est commune à tous les modèles mais peut être personnalisée par modèle
   */
  static async tagAddSuccess(): Promise<KidooActionResult> {
    return this.sendCommand({
      command: 'TAG_ADD_SUCCESS',
    });
  }
}
