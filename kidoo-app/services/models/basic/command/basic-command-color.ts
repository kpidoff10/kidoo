/**
 * Action pour gérer la couleur des LEDs du modèle Basic
 */

import { KidooActionResult } from '@/types/type';
import { CommonKidooActions } from '../../common/command';
import { ColorOptions } from './type';

/**
 * Actions pour la couleur
 */
export class BasicColorAction extends CommonKidooActions {
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
}
