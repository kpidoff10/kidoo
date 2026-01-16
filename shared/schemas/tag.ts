/**
 * Schémas de validation pour les Tags NFC
 */

import { z } from 'zod';
import { TagType } from '../types/tag-type';

/**
 * Schéma de validation pour créer un nouveau tag
 * Note: L'UID n'est pas requis à la création car il sera lu depuis le tag NFC
 * Le tagId (UUID) doit être fourni par l'app (généré avant écriture sur le tag NFC)
 */
export const createTagInputSchema = z.object({
  tagId: z.string().uuid('Le tagId doit être un UUID valide'), // UUID généré par l'app et écrit sur le tag NFC
  kidooId: z.string().uuid('Le kidooId doit être un UUID valide'),
  name: z.string().max(100, 'Le nom est trop long').optional(),
  type: z.nativeEnum(TagType, {
    errorMap: () => ({ message: 'Le type doit être MUSIC, STORY ou SOUND' }),
  }).optional(), // Type du tag (enum: MUSIC, STORY, SOUND)
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
  type: z.nativeEnum(TagType, {
    errorMap: () => ({ message: 'Le type doit être MUSIC, STORY ou SOUND' }),
  }).optional(), // Type du tag (enum: MUSIC, STORY, SOUND)
});

/**
 * Type TypeScript dérivé du schéma de mise à jour de tag
 */
export type UpdateTagInput = z.infer<typeof updateTagInputSchema>;
