/**
 * Action pour gérer le mode sommeil du modèle Basic
 */

import { KidooActionResult } from '@/types/type';
import { SleepModeOptions, SleepTimeoutOptions } from './type';
import { CommonKidooActions } from '../../common/command';
import type { SleepTimeoutGetResponse, SleepTimeoutSetResponse } from '@/types/bluetooth';

/**
 * Actions pour le mode sommeil
 */
export class BasicSleepModeAction extends CommonKidooActions {
  /**
   * Configurer le mode sommeil
   * @param options Options du mode sommeil
   */
  static async configureSleepMode(options: SleepModeOptions): Promise<KidooActionResult> {
    return this.sendCommandWithValidation(
      {
        command: 'SLEEP_CONFIG',
        timeoutMs: options.timeoutMs,
        transitionMs: options.transitionMs,
      },
      () => {
        if (options.timeoutMs < 0 || options.transitionMs < 0) {
          return {
            success: false,
            error: 'Les valeurs de timeout doivent être positives',
          };
        }

        if (options.transitionMs >= options.timeoutMs) {
          return {
            success: false,
            error: 'Le timeout de transition doit être inférieur au timeout de sommeil',
          };
        }

        return null;
      }
    );
  }

  /**
   * Définir le timeout de sommeil
   * @param timeout Timeout en millisecondes (5000-300000)
   * @returns La réponse BLE (lance une erreur en cas d'échec)
   */
  static async setSleepTimeout(timeout: SleepTimeoutOptions): Promise<SleepTimeoutSetResponse> {
    // Validation
    if (timeout.timeout < 5000 || timeout.timeout > 300000) {
      throw new Error('Le timeout doit être entre 5000 et 300000 ms (5 secondes à 5 minutes)');
    }

    const result = await this.sendCommandAndWaitForResponse(
      {
        command: 'SLEEP_TIMEOUT',
        timeout: timeout.timeout,
      },
      'SLEEP_TIMEOUT_SET'
    );

    // Si la commande a échoué, lancer une erreur
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors de la définition du timeout de sommeil via BLE');
    }

    // Vérifier que les données sont présentes
    if (!result.data) {
      throw new Error('Données de timeout de sommeil non disponibles');
    }

    const response = result.data as SleepTimeoutSetResponse;

    // Vérifier que le statut est success
    if (response.status !== 'success') {
      throw new Error(response.error || 'Erreur lors de la définition du timeout de sommeil via BLE');
    }

    return response;
  }

  /**
   * Récupérer le timeout de sommeil actuel
   * @returns Le timeout de sommeil (lance une erreur en cas d'échec)
   */
  static async getSleepTimeout(): Promise<SleepTimeoutGetResponse> {
    const result = await this.sendCommandAndWaitForResponse(
      {
        command: 'GET_SLEEP_TIMEOUT',
      },
      'SLEEP_TIMEOUT_GET'
    );

    // Si la commande a échoué, lancer une erreur
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors de la récupération du timeout de sommeil via BLE');
    }

    // Vérifier que les données sont présentes
    if (!result.data) {
      throw new Error('Données de timeout de sommeil non disponibles');
    }

    const response = result.data as SleepTimeoutGetResponse;

    // Vérifier que le statut est success
    if (response.status !== 'success') {
      throw new Error(response.error || 'Erreur lors de la récupération du timeout de sommeil via BLE');
    }

    return response;
  }
}
