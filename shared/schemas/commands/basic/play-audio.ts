/**
 * Schéma pour la commande play-audio (Basic)
 */

import { z } from 'zod';

export const playAudioCommandSchema = z.object({
  file: z.string().min(1, 'Le chemin du fichier est requis').max(256, 'Chemin trop long'),
});

export type PlayAudioCommandInput = z.infer<typeof playAudioCommandSchema>;
