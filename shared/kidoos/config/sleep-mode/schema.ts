/**
 * Schéma pour la configuration du sleep mode
 * Permet de configurer soit une couleur unie, soit un effet LED pour le sleep mode
 */

import { z } from 'zod';

// Enum des effets LED disponibles (doit correspondre à LEDEffect dans led_manager.h)
export const LED_EFFECT_NONE = 0;
export const LED_EFFECT_RAINBOW = 1;
export const LED_EFFECT_PULSE = 2;
export const LED_EFFECT_GLOSSY = 3;
export const LED_EFFECT_ROTATE = 4;
export const LED_EFFECT_NIGHTLIGHT = 5;
export const LED_EFFECT_BREATHE = 6;
export const LED_EFFECT_RAINBOW_SOFT = 7;

export const LED_EFFECT_VALUES = [
  LED_EFFECT_NONE,
  LED_EFFECT_RAINBOW,
  LED_EFFECT_PULSE,
  LED_EFFECT_GLOSSY,
  LED_EFFECT_ROTATE,
  LED_EFFECT_NIGHTLIGHT,
  LED_EFFECT_BREATHE,
  LED_EFFECT_RAINBOW_SOFT,
] as const;

export const LED_EFFECT_NAMES = {
  [LED_EFFECT_NONE]: 'none',
  [LED_EFFECT_RAINBOW]: 'rainbow',
  [LED_EFFECT_PULSE]: 'pulse',
  [LED_EFFECT_GLOSSY]: 'glossy',
  [LED_EFFECT_ROTATE]: 'rotate',
  [LED_EFFECT_NIGHTLIGHT]: 'nightlight',
  [LED_EFFECT_BREATHE]: 'breathe',
  [LED_EFFECT_RAINBOW_SOFT]: 'rainbow_soft',
} as const;

// Schéma pour une couleur RGB
const rgbSchema = z.object({
  r: z.number().int().min(0).max(255),
  g: z.number().int().min(0).max(255),
  b: z.number().int().min(0).max(255),
});

// Schéma pour la configuration du sleep mode
// Soit une couleur unie (effect = 0 ou null), soit un effet (effect > 0)
export const sleepModeConfigSchema = z.object({
  // Type: 'color' pour couleur unie, 'effect' pour effet animé
  type: z.enum(['color', 'effect']),
  // Si type = 'color', color est requis
  color: rgbSchema.optional(),
  // Si type = 'effect', effect est requis (0-7)
  effect: z.number().int().min(0).max(7).optional(),
}).refine(
  (data) => {
    if (data.type === 'color') {
      return data.color !== undefined;
    } else {
      return data.effect !== undefined && data.effect > 0;
    }
  },
  {
    message: 'Si type=color, color est requis. Si type=effect, effect doit être > 0',
  }
);

// Type inféré
export type SleepModeConfigInput = z.infer<typeof sleepModeConfigSchema>;
