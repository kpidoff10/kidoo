/**
 * Schémas de validation pour les Kidoos
 */

import { z } from 'zod';

/**
 * Schéma pour créer un Kidoo
 */
export const createKidooInputSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Nom trop long'),
  model: z.string().min(1, 'Le modèle est requis'),
  macAddress: z.string().optional(),
});

export type CreateKidooInput = z.infer<typeof createKidooInputSchema>;

/**
 * Schéma pour mettre à jour un Kidoo
 */
export const updateKidooInputSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Nom trop long').optional(),
  model: z.string().optional(),
  macAddress: z.string().optional(),
});

export type UpdateKidooInput = z.infer<typeof updateKidooInputSchema>;
