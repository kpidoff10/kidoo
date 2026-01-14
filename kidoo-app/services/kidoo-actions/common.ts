/**
 * Actions communes à tous les modèles de Kidoo
 * 
 * Cette classe sert de wrapper autour de bleManager pour :
 * - Vérifier automatiquement la connexion avant chaque commande
 * - Standardiser le format de retour (KidooActionResult) pour toutes les actions
 * - Convertir les exceptions en format d'erreur standardisé
 * 
 * Note: Les commandes globales (getSystemInfo, getBrightness, reset) sont disponibles
 * directement via bleManager et ne nécessitent pas cette couche d'abstraction.
 */

import { bleManager } from '@/services/bte';
import type { KidooActionResult } from './types';

/**
 * Classe de base pour les actions communes
 * Wrapper autour de bleManager avec format de retour standardisé
 */
export class CommonKidooActions {
  /**
   * Vérifier si le Kidoo est connecté
   */
  protected static checkConnection(): boolean {
    if (!bleManager.isConnected()) {
      console.error('[CommonKidooActions] Kidoo non connecté');
      return false;
    }
    return true;
  }

  /**
   * Envoyer une commande JSON au Kidoo
   * Méthode commune utilisable par tous les modèles
   */
  protected static async sendCommand(command: Record<string, any>): Promise<KidooActionResult> {
    if (!this.checkConnection()) {
      return {
        success: false,
        error: 'Le Kidoo n\'est pas connecté',
      };
    }

    try {
      const commandJson = JSON.stringify(command);
      const success = await bleManager.sendCommand(commandJson);

      if (success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Erreur lors de l\'envoi de la commande',
        };
      }
    } catch (error) {
      console.error('[CommonKidooActions] Erreur:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Envoyer une commande et attendre une réponse spécifique
   * @param command Commande à envoyer
   * @param expectedMessage Message attendu dans la réponse (ex: "BRIGHTNESS_GET")
   * @param timeout Timeout en millisecondes (défaut: 5000ms)
   */
  protected static async sendCommandAndWaitForResponse(
    command: Record<string, any>,
    expectedMessage: string,
    timeout: number = 5000
  ): Promise<KidooActionResult> {
    if (!this.checkConnection()) {
      return {
        success: false,
        error: 'Le Kidoo n\'est pas connecté',
      };
    }

    try {
      // Envoyer la commande
      const commandJson = JSON.stringify(command);
      const success = await bleManager.sendCommand(commandJson);
      
      if (!success) {
        return {
          success: false,
          error: 'Erreur lors de l\'envoi de la commande',
        };
      }

      // Attendre la réponse en utilisant waitForResponse
      const response = await bleManager.waitForResponse({
        expectedMessage, // String accepté maintenant
        timeout,
        timeoutErrorMessage: `Timeout: aucune réponse reçue pour ${expectedMessage}`,
      });

      // Vérifier si c'est une réponse de succès
      if (response.status === 'success' && response.message === expectedMessage) {
        return {
          success: true,
          data: response as any,
        } as KidooActionResult;
      } else {
        return {
          success: false,
          error: response.error || 'Erreur dans la réponse',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Envoyer une commande avec validation personnalisée
   * @param command Commande à envoyer
   * @param validator Fonction de validation optionnelle
   */
  protected static async sendCommandWithValidation(
    command: Record<string, any>,
    validator?: () => KidooActionResult | null
  ): Promise<KidooActionResult> {
    // Exécuter la validation si fournie
    if (validator) {
      const validationResult = validator();
      if (validationResult && !validationResult.success) {
        return validationResult;
      }
    }

    return this.sendCommand(command);
  }
}
