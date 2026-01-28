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

// Fonction pour saturer une couleur RGB à 100% (rendre la couleur "profonde")
// Multiplie chaque composante pour que la composante maximale devienne 255
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

// Type pour les jours de la semaine
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Schéma simplifié pour un horaire
const timeSchema = z.object({
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  activated: z.boolean(),
});

// Schéma simplifié pour la mise à jour de la configuration
export const updateDreamBedtimeConfigSchema = z.preprocess((data: any) => {
  // Nettoyer weekdaySchedule en filtrant les valeurs undefined
  if (data && typeof data === 'object' && data.weekdaySchedule && typeof data.weekdaySchedule === 'object') {
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const cleanedSchedule: Record<string, any> = {};
    Object.entries(data.weekdaySchedule).forEach(([day, time]) => {
      if (validDays.includes(day) && time && typeof time === 'object' && time !== null && 'hour' in time && 'minute' in time) {
        cleanedSchedule[day] = time;
      }
    });
    return {
      ...data,
      weekdaySchedule: Object.keys(cleanedSchedule).length > 0 ? cleanedSchedule : undefined,
    };
  }
  return data;
}, z.object({
  weekdaySchedule: z
    .record(z.string(), timeSchema)
    .refine(
      (schedule) => {
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        return Object.keys(schedule).every(day => validDays.includes(day));
      },
      { message: 'Les jours de la semaine doivent être valides' }
    )
    .optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'La couleur doit être au format hexadécimal (#RRGGBB)'),
  brightness: z.number().int().min(0).max(100),
  nightlightAllNight: z.boolean(),
}));

// Type inféré pour la mise à jour
export type UpdateDreamBedtimeConfigInput = z.infer<typeof updateDreamBedtimeConfigSchema>;

// Schéma pour la réponse
export const dreamBedtimeConfigResponseSchema = z.object({
  weekdaySchedule: z
    .record(z.string(), timeSchema)
    .optional(),
  colorR: z.number().int().min(0).max(255),
  colorG: z.number().int().min(0).max(255),
  colorB: z.number().int().min(0).max(255),
  brightness: z.number().int().min(0).max(100),
  nightlightAllNight: z.boolean(),
});

// Type inféré pour la réponse
export type DreamBedtimeConfigResponse = z.infer<typeof dreamBedtimeConfigResponseSchema>;
