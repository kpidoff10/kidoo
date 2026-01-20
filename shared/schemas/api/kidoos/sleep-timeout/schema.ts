/**
 * Schéma pour la commande sleep-timeout
 * Délai en millisecondes (0 = désactivé, sinon 5000-300000)
 */

import { z } from 'zod';

export const SLEEP_TIMEOUT_LIMITS = {
  min: 5000,
  max: 300000,
} as const;

export const sleepTimeoutCommandSchema = z.object({
  value: z
    .number()
    .int()
    .refine(
      (val) => val === 0 || (val >= SLEEP_TIMEOUT_LIMITS.min && val <= SLEEP_TIMEOUT_LIMITS.max),
      `Le délai doit être 0 (désactivé) ou entre ${SLEEP_TIMEOUT_LIMITS.min} et ${SLEEP_TIMEOUT_LIMITS.max} ms`
    ),
});

export type SleepTimeoutCommandInput = z.infer<typeof sleepTimeoutCommandSchema>;
