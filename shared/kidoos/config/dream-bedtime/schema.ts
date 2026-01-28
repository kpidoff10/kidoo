/**
 * Schéma pour la configuration de l'heure de coucher du modèle Dream
 */

import { z } from 'zod';
import { hexToRgb, saturateRgbToMax } from '../color-utils';

// Réexporter les fonctions utilitaires pour compatibilité
export { hexToRgb, saturateRgbToMax };

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

// Type pour les jours de la semaine (importé depuis types communs)
import type { Weekday } from '../../../types/common';
export type { Weekday };

// Schéma simplifié pour un horaire
const timeSchema = z.object({
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  activated: z.boolean(),
});

// Effets disponibles pour le mode bedtime
export const BEDTIME_EFFECTS = ['none', 'pulse', 'rainbow-soft', 'breathe', 'nightlight'] as const;
export type BedtimeEffect = typeof BEDTIME_EFFECTS[number];

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
  // Soit color (pour couleur fixe), soit effect (pour effet animé)
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'La couleur doit être au format hexadécimal (#RRGGBB)').optional(),
  effect: z.enum(BEDTIME_EFFECTS as unknown as [string, ...string[]]).optional(),
  brightness: z.number().int().min(0).max(100),
  nightlightAllNight: z.boolean(),
}).refine(
  (data) => {
    // Au moins color ou effect doit être présent
    return !!(data.color || data.effect);
  },
  { message: 'Vous devez spécifier soit une couleur (color) soit un effet (effect)' }
));

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
  effect: z.enum(BEDTIME_EFFECTS as unknown as [string, ...string[]]).nullable().optional(),
});

// Type inféré pour la réponse
export type DreamBedtimeConfigResponse = z.infer<typeof dreamBedtimeConfigResponseSchema>;
