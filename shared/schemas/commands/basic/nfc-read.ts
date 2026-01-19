/**
 * Schéma pour la commande nfc-read (Basic)
 */

import { z } from 'zod';

export const nfcReadCommandSchema = z.object({
  block: z.number().int().min(0).max(63).optional(),
});

export type NfcReadCommandInput = z.infer<typeof nfcReadCommandSchema>;

export const NFC_BLOCK_LIMITS = {
  min: 0,
  max: 63,
} as const;
