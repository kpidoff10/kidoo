/**
 * Schémas de validation pour les Tags NFC
 */

import { z } from 'zod';

/**
 * Schéma pour créer un Tag
 */
export const createTagInputSchema = z.object({
  uid: z.string().min(1, 'L\'UID est requis'),
  kidooId: z.string().uuid('ID Kidoo invalide'),
  name: z.string().min(1, 'Le nom est requis').max(100, 'Nom trop long').optional(),
  type: z.string().optional(),
  audioFile: z.string().optional(),
});

export type CreateTagInput = z.infer<typeof createTagInputSchema>;

/**
 * Schéma pour mettre à jour un Tag
 */
export const updateTagInputSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Nom trop long').optional(),
  type: z.string().optional(),
  audioFile: z.string().optional(),
});

export type UpdateTagInput = z.infer<typeof updateTagInputSchema>;
