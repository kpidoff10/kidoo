/**
 * Schéma pour la commande reboot
 * Délai optionnel avant redémarrage (en ms)
 */

import { z } from 'zod';

export const REBOOT_LIMITS = {
  minDelay: 0,
  maxDelay: 60000, // 1 minute max
} as const;

export const rebootCommandSchema = z.object({
  delay: z.number()
    .int()
    .min(REBOOT_LIMITS.minDelay)
    .max(REBOOT_LIMITS.maxDelay, `Maximum ${REBOOT_LIMITS.maxDelay}ms`)
    .optional(),
});

export type RebootCommandInput = z.infer<typeof rebootCommandSchema>;
