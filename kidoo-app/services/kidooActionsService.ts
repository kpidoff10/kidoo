/**
 * Service pour gérer les actions sur les Kidoos
 * Actions spécifiques à chaque modèle (Basic, Classic, etc.)
 * Utilise le BLE Manager pour envoyer les commandes Bluetooth
 */

import type { Kidoo } from './kidooService';
import { BasicKidooActions } from './kidoo-actions';

// Ré-exporter les types pour compatibilité
export type {
  KidooActionResult,
  BrightnessOptions,
  EffectOptions,
  SleepModeOptions,
  SleepTimeoutOptions,
  ColorOptions,
} from './kidoo-actions';

// Ré-exporter BasicKidooActions pour compatibilité
export { BasicKidooActions } from './kidoo-actions';

/**
 * Factory pour obtenir les actions appropriées selon le modèle
 */
export function getKidooActions(kidoo: Kidoo) {
  switch (kidoo.model.toLowerCase()) {
    case 'basic':
      return BasicKidooActions;
    // Ajouter d'autres modèles ici
    // case 'classic':
    //   return ClassicKidooActions;
    default:
      // Par défaut, utiliser Basic si le modèle n'est pas reconnu
      console.warn(`[KidooActionsService] Modèle "${kidoo.model}" non reconnu, utilisation de Basic`);
      return BasicKidooActions;
  }
}

/**
 * Helper pour utiliser les actions d'un Kidoo
 */
export const kidooActionsService = {
  /**
   * Obtenir les actions pour un Kidoo spécifique
   */
  forKidoo: (kidoo: Kidoo) => getKidooActions(kidoo),
};
