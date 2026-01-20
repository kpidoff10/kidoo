/**
 * Schéma pour la commande sleep-timeout
 * Délai de mise en veille (0 = désactivé, sinon en ms)
 */

import { z } from 'zod';

// Constantes exportées pour réutilisation (UI, validation côté client)
export const SLEEP_TIMEOUT_LIMITS = {
  min: 5000,    // 5 secondes minimum
  max: 3600000, // 1 heure maximum
} as const;

// Schéma Zod - 0 pour désactiver, ou entre min et max
export const sleepTimeoutCommandSchema = z.object({
  value: z.number()
    .int()
    .refine(
      (val) => val === 0 || (val >= SLEEP_TIMEOUT_LIMITS.min && val <= SLEEP_TIMEOUT_LIMITS.max),
      `Le délai doit être 0 (désactivé) ou entre ${SLEEP_TIMEOUT_LIMITS.min}ms et ${SLEEP_TIMEOUT_LIMITS.max}ms`
    ),
});

// Type inféré
export type SleepTimeoutCommandInput = z.infer<typeof sleepTimeoutCommandSchema>;
