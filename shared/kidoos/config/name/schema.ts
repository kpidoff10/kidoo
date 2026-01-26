/**
 * Schéma pour la modification du nom d'un Kidoo
 */

import { z } from 'zod';

// Constantes exportées pour réutilisation (UI, validation côté client)
export const KIDOO_NAME_LIMITS = {
  min: 1,
  max: 100,
} as const;

// Schéma Zod
export const updateKidooNameSchema = z.object({
  name: z.string()
    .min(KIDOO_NAME_LIMITS.min, 'Le nom est requis')
    .max(KIDOO_NAME_LIMITS.max, `Le nom ne peut pas dépasser ${KIDOO_NAME_LIMITS.max} caractères`),
});

// Type inféré
export type UpdateKidooNameInput = z.infer<typeof updateKidooNameSchema>;
