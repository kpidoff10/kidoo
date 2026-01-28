/**
 * Types pour la configuration du sleep mode
 */

export interface SleepModeConfig {
  type: 'color' | 'effect';
  color?: {
    r: number;
    g: number;
    b: number;
  };
  effect?: number; // LEDEffect enum value (0-7)
}
