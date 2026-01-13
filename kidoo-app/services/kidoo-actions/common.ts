/**
 * Actions communes à tous les modèles de Kidoo
 */

import { bleManager } from '@/services/bleManager';
import type { BluetoothResponse } from '@/types/bluetooth';
import type { KidooActionResult } from './types';

/**
 * Classe de base pour les actions communes
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

    return new Promise((resolve) => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      let unsubscribe: (() => void) | null = null;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
      };

      // Configurer le timeout
      timeoutId = setTimeout(() => {
        cleanup();
        resolve({
          success: false,
          error: `Timeout: aucune réponse reçue pour ${expectedMessage}`,
        });
      }, timeout);

      // Démarrer le monitoring pour recevoir la réponse
      bleManager.startMonitoring((response: BluetoothResponse) => {
        // Vérifier si c'est la réponse attendue
        if (response.message === expectedMessage) {
          cleanup();

          if (response.status === 'success') {
            resolve({
              success: true,
              data: response as any,
            } as KidooActionResult);
          } else {
            resolve({
              success: false,
              error: response.error || 'Erreur dans la réponse',
            });
          }
        }
      }).then((unsub) => {
        unsubscribe = unsub;
      }).catch((error) => {
        cleanup();
        resolve({
          success: false,
          error: `Erreur lors du démarrage du monitoring: ${error instanceof Error ? error.message : String(error)}`,
        });
      });

      // Envoyer la commande
      const commandJson = JSON.stringify(command);
      bleManager.sendCommand(commandJson).catch((error) => {
        cleanup();
        resolve({
          success: false,
          error: `Erreur lors de l'envoi de la commande: ${error instanceof Error ? error.message : String(error)}`,
        });
      });
    });
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

  /**
   * Obtenir la luminosité actuelle des LEDs
   * Commande commune à tous les modèles de Kidoo
   * @returns Résultat avec la luminosité en pourcentage (10-100) dans data.brightness
   */
  static async getBrightness(): Promise<KidooActionResult> {
    const result = await this.sendCommandAndWaitForResponse(
      {
        command: 'GET_BRIGHTNESS',
      },
      'BRIGHTNESS_GET',
      5000
    );

    if (result.success && (result as any).data && typeof (result as any).data.brightness === 'number') {
      return {
        success: true,
        data: {
          brightness: (result as any).data.brightness,
        },
      } as KidooActionResult;
    }

    return result;
  }

  /**
   * Obtenir les informations système
   * Commande commune à tous les modèles de Kidoo
   * @returns Résultat avec les informations système (version, modèle, etc.)
   */
  static async getSystemInfo(): Promise<KidooActionResult> {
    return this.sendCommand({
      command: 'VERSION',
    });
  }

  /**
   * Réinitialiser les paramètres par défaut
   * Commande commune à tous les modèles de Kidoo
   */
  static async reset(): Promise<KidooActionResult> {
    return this.sendCommand({
      command: 'RESET',
    });
  }
}
