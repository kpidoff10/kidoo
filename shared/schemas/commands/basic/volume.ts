/**
 * Schéma pour la commande volume (Basic)
 * Volume de 0 (mute) à 21 (max)
 */

import { z } from 'zod';

export const volumeCommandSchema = z.object({
  value: z.number().int().min(0, 'Minimum 0').max(21, 'Maximum 21'),
});

export type VolumeCommandInput = z.infer<typeof volumeCommandSchema>;

export const VOLUME_LIMITS = {
  min: 0,
  max: 21,
} as const;
