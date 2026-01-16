/**
 * Point d'entrée pour toutes les actions communes à tous les modèles de Kidoo
 * 
 * Cette classe sert de wrapper autour de bleManager pour :
 * - Vérifier automatiquement la connexion avant chaque commande
 * - Standardiser le format de retour (KidooActionResult) pour toutes les actions
 * - Convertir les exceptions en format d'erreur standardisé
 */

import { CommonBaseActions } from './common-command';
import { CommonSystemAction } from './common-command-system';

/**
 * Classe de base pour les actions communes
 * Hérite des méthodes utilitaires de CommonBaseActions
 * et regroupe toutes les actions communes
 */
export class CommonKidooActions extends CommonBaseActions {
  /**
   * Envoyer la commande TAG_ADD_SUCCESS pour afficher l'effet de succès
   * Cette commande est commune à tous les modèles de Kidoo
   */
  static async tagAddSuccess() {
    return this.sendCommand({
      command: 'TAG_ADD_SUCCESS',
    });
  }

  // Actions système communes
  static getSystemInfo = CommonSystemAction.getSystemInfo;
}

// Réexporter les classes d'actions individuelles pour un accès direct si nécessaire
export { CommonBaseActions } from './common-command';
export { CommonSystemAction } from './common-command-system';
