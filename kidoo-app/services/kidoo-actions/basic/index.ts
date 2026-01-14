/**
 * Actions spécifiques au modèle Basic
 */

import { CommonKidooActions } from '../common';
import type {
  KidooActionResult,
  BrightnessOptions,
  EffectOptions,
  SleepModeOptions,
  SleepTimeoutOptions,
  ColorOptions,
} from '../types';

/**
 * Actions spécifiques au modèle Basic
 * Hérite des méthodes communes de CommonKidooActions
 */
export class BasicKidooActions extends CommonKidooActions {

  /**
   * Définir la luminosité des LEDs
   * @param brightness Luminosité en pourcentage (10-100)
   */
  static async setBrightness(brightness: BrightnessOptions): Promise<KidooActionResult> {
    return this.sendCommandWithValidation(
      {
        command: 'BRIGHTNESS',
        percent: brightness.percent,
      },
      () => {
        if (brightness.percent < 10 || brightness.percent > 100) {
          return {
            success: false,
            error: 'La luminosité doit être entre 10 et 100',
          };
        }
        return null;
      }
    );
  }

  /**
   * Définir un effet LED
   * @param effect Options de l'effet
   */
  static async setEffect(effect: EffectOptions): Promise<KidooActionResult> {
    return this.sendCommand({
      command: 'EFFECT',
      effect: effect.effect,
    });
  }

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

  /**
   * Définir une couleur personnalisée
   * @param color Options de couleur RGB
   */
  static async setColor(color: ColorOptions): Promise<KidooActionResult> {
    return this.sendCommandWithValidation(
      {
        command: 'COLOR',
        r: color.r,
        g: color.g,
        b: color.b,
      },
      () => {
        if (
          color.r < 0 || color.r > 255 ||
          color.g < 0 || color.g > 255 ||
          color.b < 0 || color.b > 255
        ) {
          return {
            success: false,
            error: 'Les valeurs RGB doivent être entre 0 et 255',
          };
        }
        return null;
      }
    );
  }

  /**
   * Envoyer la commande TAG_ADD_SUCCESS pour afficher l'effet de succès
   * Hérite de CommonKidooActions
   */
  static async tagAddSuccess(): Promise<KidooActionResult> {
    return super.tagAddSuccess();
  }

}
