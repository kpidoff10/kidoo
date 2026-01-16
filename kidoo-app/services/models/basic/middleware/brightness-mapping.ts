/**
 * Mapping de synchronisation pour la luminosité (brightness)
 * Synchronise la réponse BRIGHTNESS_SET avec le champ brightness de KidooConfigBasic
 */

import { BasicBluetoothMessage } from '@/types/bluetooth';
import type { SyncMappingSingle } from '../../types';

/**
 * Mapping pour la commande BRIGHTNESS_SET
 */
export const brightnessMapping: Record<string, SyncMappingSingle> = {
  [BasicBluetoothMessage.BRIGHTNESS_SET]: {
    field: 'brightness',
    configField: 'brightness',
  },
};
