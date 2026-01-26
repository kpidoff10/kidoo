/**
 * Configuration des modèles de Kidoo
 */

/**
 * Liste de tous les modèles de Kidoo disponibles
 */
export const KIDOO_MODELS = [
  'Kidoo-Basic',
  'Kidoo-Dream',
] as const;

/**
 * Type pour les modèles de Kidoo
 */
export type KidooModel = typeof KIDOO_MODELS[number];

/**
 * Vérifier si une chaîne est un modèle valide
 */
export function isValidKidooModel(model: string): model is KidooModel {
  return KIDOO_MODELS.includes(model as KidooModel);
}

/**
 * Obtenir le nom d'affichage d'un modèle
 * Accepte les formats API ('BASIC', 'DREAM') et BLE ('Kidoo-Basic', 'Kidoo-Dream')
 */
export function getKidooModelDisplayName(model: string): string {
  // Normaliser le modèle pour la comparaison
  const normalizedModel = model.toLowerCase();
  
  // Mapping des modèles vers leurs libellés d'affichage
  if (normalizedModel.includes('basic')) {
    return 'Kidoo Basic';
  } else if (normalizedModel.includes('dream')) {
    return 'Kidoo Dream';
  }
  
  // Si le modèle n'est pas reconnu, retourner le modèle original
  return model;
}

/**
 * Obtenir le nom de l'icône Ionicons pour un modèle
 * Accepte les formats API ('BASIC', 'DREAM') et BLE ('Kidoo-Basic', 'Kidoo-Dream')
 * @returns Nom de l'icône Ionicons (ex: "cube-outline", "sparkles-outline")
 */
export function getKidooModelIcon(model: string): string {
  // Normaliser le modèle pour la comparaison
  const normalizedModel = model.toLowerCase();
  
  // Mapping des modèles vers leurs icônes
  if (normalizedModel.includes('basic')) {
    return 'cube-outline';
  } else if (normalizedModel.includes('dream')) {
    return 'sparkles-outline';
  }
  
  // Icône par défaut si le modèle n'est pas reconnu
  return 'cube-outline';
}

/**
 * Type pour les modèles API (utilisés dans les requêtes vers le serveur)
 */
export type KidooApiModel = 'BASIC' | 'DREAM';

/**
 * Convertir un modèle BLE (détecté depuis le nom du device) vers le modèle API
 * @param bleModel Modèle détecté depuis le nom BLE (ex: "Kidoo-Basic", "Kidoo-Dream")
 * @returns Modèle API correspondant (ex: "BASIC", "DREAM")
 */
export function convertBleModelToApiModel(bleModel: string): KidooApiModel {
  // Normaliser le modèle pour la comparaison (insensible à la casse)
  const normalizedModel = bleModel.toLowerCase();
  
  if (normalizedModel.includes('basic')) {
    return 'BASIC';
  } else if (normalizedModel.includes('dream')) {
    return 'DREAM';
  }
  
  // Par défaut BASIC si modèle inconnu
  return 'BASIC';
}
