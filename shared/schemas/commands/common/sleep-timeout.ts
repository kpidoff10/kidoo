/**
 * Schéma pour la commande sleep-timeout
 * Délai en millisecondes (0 = désactivé, sinon 5000-300000)
 */

import { z } from 'zod';

export const sleepTimeoutCommandSchema = z.object({
  value: z
    .number()
    .int()
    .refine(
      (val) => val === 0 || (val >= 5000 && val <= 300000),
      'Le délai doit être 0 (désactivé) ou entre 5000 et 300000 ms'
    ),
});

export type SleepTimeoutCommandInput = z.infer<typeof sleepTimeoutCommandSchema>;

export const SLEEP_TIMEOUT_LIMITS = {
  min: 5000,
  max: 300000,
} as const;
