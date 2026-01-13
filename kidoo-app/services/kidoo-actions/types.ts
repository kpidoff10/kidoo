/**
 * Types partagés pour les actions Kidoo
 */

/**
 * Résultat d'une action sur un Kidoo
 */
export interface KidooActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Options pour définir la luminosité
 */
export interface BrightnessOptions {
  /** Luminosité en pourcentage (0-100) */
  percent: number;
}

/**
 * Options pour définir un effet LED
 */
export interface EffectOptions {
  /** Nom de l'effet (rainbow, pulse, glossy, etc.) */
  effect: 'rainbow' | 'pulse' | 'glossy' | 'manual';
}

/**
 * Options pour le mode sommeil
 */
export interface SleepModeOptions {
  /** Timeout en millisecondes avant activation du mode sommeil */
  timeoutMs: number;
  /** Timeout en millisecondes avant la transition vers le sommeil */
  transitionMs: number;
}

/**
 * Options pour définir le timeout de sommeil
 */
export interface SleepTimeoutOptions {
  /** Timeout en millisecondes (5000-300000) */
  timeout: number;
}

/**
 * Options pour définir une couleur
 */
export interface ColorOptions {
  /** Composante rouge (0-255) */
  r: number;
  /** Composante verte (0-255) */
  g: number;
  /** Composante bleue (0-255) */
  b: number;
}
