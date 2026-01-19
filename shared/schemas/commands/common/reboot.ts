/**
 * Schéma pour la commande reboot
 * Délai optionnel avant redémarrage
 */

import { z } from 'zod';

export const rebootCommandSchema = z.object({
  delay: z.number().int().min(0).optional(),
});

export type RebootCommandInput = z.infer<typeof rebootCommandSchema>;
