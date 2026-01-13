/**
 * Schémas de validation pour les Tags NFC
 */

import { z } from 'zod';

/**
 * Schéma de validation pour créer un nouveau tag
 * Note: L'UID n'est pas requis à la création car il sera lu depuis le tag NFC
 */
export const createTagInputSchema = z.object({
  kidooId: z.string().uuid('Le kidooId doit être un UUID valide'),
  name: z.string().max(100, 'Le nom est trop long').optional(),
});

/**
 * Type TypeScript dérivé du schéma de création de tag
 */
export type CreateTagInput = z.infer<typeof createTagInputSchema>;

/**
 * Schéma de validation pour mettre à jour un tag
 */
export const updateTagInputSchema = z.object({
  uid: z.string().min(1, 'L\'UID est requis').max(50, 'L\'UID est trop long').optional(),
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long').optional(),
});

/**
 * Type TypeScript dérivé du schéma de mise à jour de tag
 */
export type UpdateTagInput = z.infer<typeof updateTagInputSchema>;
