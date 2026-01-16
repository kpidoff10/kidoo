/**
 * Action pour gérer la luminosité des LEDs du modèle Basic
 */

import { KidooActionResult } from '@/types/type';
import { CommonKidooActions } from '../../common/command';
import { BrightnessOptions } from './type';

/**
 * Actions pour la luminosité
 */
export class BasicBrightnessAction extends CommonKidooActions {
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
}
