/**
 * Action pour gérer les effets LED du modèle Basic
 */

import { KidooActionResult } from '@/types/type';
import { CommonKidooActions } from '../../common/command';
import { EffectOptions } from './type';

/**
 * Actions pour les effets LED
 */
export class BasicEffectAction extends CommonKidooActions {
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
}
