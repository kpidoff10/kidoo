/**
 * Schéma pour la commande brightness
 * Luminosité en pourcentage (10-100)
 */

import { z } from 'zod';

export const BRIGHTNESS_LIMITS = {
  min: 1,
  max: 100,
} as const;

export const brightnessCommandSchema = z.object({
  value: z.number().int().min(BRIGHTNESS_LIMITS.min, `Minimum ${BRIGHTNESS_LIMITS.min}%`).max(BRIGHTNESS_LIMITS.max, `Maximum ${BRIGHTNESS_LIMITS.max}%`),
});

export type BrightnessCommandInput = z.infer<typeof brightnessCommandSchema>;


