/**
 * Service pour gérer les actions sur les Kidoos
 * Actions spécifiques à chaque modèle (Basic, Classic, etc.)
 * Utilise le BLE Manager pour envoyer les commandes Bluetooth
 */

import { Kidoo } from "@/shared";
import { BasicKidooActions } from "./models/basic/command";

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
