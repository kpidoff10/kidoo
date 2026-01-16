/**
 * Action pour gérer le mode sommeil du modèle Basic
 */

import { KidooActionResult } from '@/types/type';
import { SleepModeOptions, SleepTimeoutOptions } from './type';
import { CommonKidooActions } from '../../common/command';

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
   */
  static async setSleepTimeout(timeout: SleepTimeoutOptions): Promise<KidooActionResult> {
    return this.sendCommandWithValidation(
      {
        command: 'SLEEP_TIMEOUT',
        timeout: timeout.timeout,
      },
      () => {
        if (timeout.timeout < 5000 || timeout.timeout > 300000) {
          return {
            success: false,
            error: 'Le timeout doit être entre 5000 et 300000 ms (5 secondes à 5 minutes)',
          };
        }
        return null;
      }
    );
  }

  /**
   * Récupérer le timeout de sommeil actuel
   */
  static async getSleepTimeout(): Promise<KidooActionResult> {
    return this.sendCommandAndWaitForResponse(
      {
        command: 'GET_SLEEP_TIMEOUT',
      },
      'SLEEP_TIMEOUT_GET'
    );
  }
}
