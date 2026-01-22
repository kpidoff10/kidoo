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
 */
export function getKidooModelDisplayName(model: KidooModel): string {
  const displayNames: Record<KidooModel, string> = {
    'Kidoo-Basic': 'Kidoo Basic',
    'Kidoo-Dream': 'Kidoo Dream',
  };
  return displayNames[model] || model;
}
