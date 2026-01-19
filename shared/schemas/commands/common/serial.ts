/**
 * Schéma pour la commande serial (commande brute)
 */

import { z } from 'zod';

export const serialCommandSchema = z.object({
  command: z.string().min(1, 'La commande est requise').max(256, 'Commande trop longue'),
});

export type SerialCommandInput = z.infer<typeof serialCommandSchema>;
