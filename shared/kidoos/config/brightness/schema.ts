/**
 * Schéma pour la commande brightness
 * Luminosité des LEDs (1-100%)
 */

import { z } from 'zod';

// Constantes exportées pour réutilisation (UI, validation côté client)
export const BRIGHTNESS_LIMITS = {
  min: 1,
  max: 100,
} as const;

// Schéma Zod
export const brightnessCommandSchema = z.object({
  value: z.number()
    .int()
    .min(BRIGHTNESS_LIMITS.min, `Minimum ${BRIGHTNESS_LIMITS.min}%`)
    .max(BRIGHTNESS_LIMITS.max, `Maximum ${BRIGHTNESS_LIMITS.max}%`),
});

// Type inféré
export type BrightnessCommandInput = z.infer<typeof brightnessCommandSchema>;
