/**
 * Utilitaires pour la manipulation des couleurs
 * Fonctions communes utilisées par bedtime et wakeup configs
 */

/**
 * Fonction helper pour convertir hex en RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Fonction pour saturer une couleur RGB à 100% (rendre la couleur "profonde")
 * Multiplie chaque composante pour que la composante maximale devienne 255
 */
export function saturateRgbToMax(rgb: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  
  // Si toutes les composantes sont à 0, retourner noir
  if (max === 0) {
    return { r: 0, g: 0, b: 0 };
  }
  
  // Multiplier chaque composante par 255/max pour saturer à 100%
  const factor = 255 / max;
  return {
    r: Math.round(rgb.r * factor),
    g: Math.round(rgb.g * factor),
    b: Math.round(rgb.b * factor),
  };
}
