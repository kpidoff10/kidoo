/**
 * Schéma pour la configuration de l'heure de coucher du modèle Dream
 */

import { z } from 'zod';

// Constantes exportées pour réutilisation (UI, validation côté client)
export const BEDTIME_LIMITS = {
  hour: {
    min: 0,
    max: 23,
  },
  minute: {
    min: 0,
    max: 59,
  },
  colorRGB: {
    min: 0,
    max: 255,
  },
  brightness: {
    min: 0,
    max: 100,
  },
} as const;

// Fonction helper pour convertir hex en RGB
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

// Schéma Zod pour la mise à jour de la configuration
export const updateDreamBedtimeConfigSchema = z.object({
  hour: z
    .number()
    .int()
    .min(BEDTIME_LIMITS.hour.min, `L'heure doit être entre ${BEDTIME_LIMITS.hour.min} et ${BEDTIME_LIMITS.hour.max}`)
    .max(BEDTIME_LIMITS.hour.max, `L'heure doit être entre ${BEDTIME_LIMITS.hour.min} et ${BEDTIME_LIMITS.hour.max}`),
  minute: z
    .number()
    .int()
    .min(BEDTIME_LIMITS.minute.min, `Les minutes doivent être entre ${BEDTIME_LIMITS.minute.min} et ${BEDTIME_LIMITS.minute.max}`)
    .max(BEDTIME_LIMITS.minute.max, `Les minutes doivent être entre ${BEDTIME_LIMITS.minute.min} et ${BEDTIME_LIMITS.minute.max}`),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'La couleur doit être au format hexadécimal (#RRGGBB)'),
  brightness: z
    .number()
    .int()
    .min(BEDTIME_LIMITS.brightness.min, `La luminosité doit être entre ${BEDTIME_LIMITS.brightness.min} et ${BEDTIME_LIMITS.brightness.max}%`)
    .max(BEDTIME_LIMITS.brightness.max, `La luminosité doit être entre ${BEDTIME_LIMITS.brightness.min} et ${BEDTIME_LIMITS.brightness.max}%`),
  nightlightAllNight: z.boolean(),
});

// Type inféré pour la mise à jour
export type UpdateDreamBedtimeConfigInput = z.infer<typeof updateDreamBedtimeConfigSchema>;

// Schéma pour la réponse (avec RGB séparé)
export const dreamBedtimeConfigResponseSchema = z.object({
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  colorR: z.number().int().min(0).max(255),
  colorG: z.number().int().min(0).max(255),
  colorB: z.number().int().min(0).max(255),
  brightness: z.number().int().min(0).max(100),
  nightlightAllNight: z.boolean(),
});

// Type inféré pour la réponse
export type DreamBedtimeConfigResponse = z.infer<typeof dreamBedtimeConfigResponseSchema>;
