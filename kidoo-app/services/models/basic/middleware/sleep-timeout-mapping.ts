/**
 * Mapping de synchronisation pour le timeout de sommeil (sleepTimeout)
 * Synchronise la réponse SLEEP_TIMEOUT_SET avec le champ sleepTimeout de KidooConfigBasic
 */

import { BasicBluetoothMessage } from '@/types/bluetooth';
import type { SyncMappingSingle } from '../../types';

/**
 * Mapping pour la commande SLEEP_TIMEOUT_SET
 */
export const sleepTimeoutMapping: Record<string, SyncMappingSingle> = {
  [BasicBluetoothMessage.SLEEP_TIMEOUT_SET]: {
    field: 'timeout',
    configField: 'sleepTimeout',
  },
};
