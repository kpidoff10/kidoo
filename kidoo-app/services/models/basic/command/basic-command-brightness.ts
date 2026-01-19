/**
 * Action pour gérer la luminosité des LEDs du modèle Basic
 */

import { CommonKidooActions } from '../../common/command';
import { BrightnessOptions } from './type';
import type { BrightnessGetResponse, BrightnessSetResponse } from '@/types/bluetooth';

/**
 * Actions pour la luminosité
 */
export class BasicBrightnessAction extends CommonKidooActions {
  /**
   * Définir la luminosité des LEDs
   * @param brightness Luminosité en pourcentage (10-100)
   * @returns La réponse BLE (lance une erreur en cas d'échec)
   */
  static async setBrightness(brightness: BrightnessOptions): Promise<BrightnessSetResponse> {
    // Validation
    if (brightness.percent < 10 || brightness.percent > 100) {
      throw new Error('La luminosité doit être entre 10 et 100');
    }

    const result = await this.sendCommandAndWaitForResponse(
      {
        command: 'BRIGHTNESS_SET',
        percent: brightness.percent,
      },
      'BRIGHTNESS_SET'
    );

    // Si la commande a échoué, lancer une erreur
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors de la définition de la luminosité via BLE');
    }

    // Vérifier que les données sont présentes
    if (!result.data) {
      throw new Error('Données de luminosité non disponibles');
    }

    const response = result.data as BrightnessSetResponse;

    // Vérifier que le statut est success
    if (response.status !== 'success') {
      throw new Error(response.error || 'Erreur lors de la définition de la luminosité via BLE');
      }

    return response;
  }

  /**
   * Obtenir la luminosité actuelle des LEDs
   * @param timeout Timeout en millisecondes (défaut: 10000)
   * @returns La luminosité (lance une erreur en cas d'échec)
   */
  static async getBrightness(timeout: number = 10000): Promise<BrightnessGetResponse> {
    const result = await this.sendCommandAndWaitForResponse(
      {
        command: 'BRIGHTNESS_GET',
      },
      'BRIGHTNESS_GET',
      timeout
    );

    // Si la commande a échoué, lancer une erreur
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors de la récupération de la luminosité via BLE');
    }

    // Vérifier que les données sont présentes
    if (!result.data) {
      throw new Error('Données de luminosité non disponibles');
    }

    const response = result.data as BrightnessGetResponse;

    // Vérifier que le statut est success
    if (response.status !== 'success') {
      throw new Error(response.error || 'Erreur lors de la récupération de la luminosité via BLE');
    }

    return response;
  }
}
