/**
 * Mappings de synchronisation pour les données de stockage
 */

import { BluetoothMessage } from '@/types/bluetooth';
import type { SyncMapping } from '../../types';

/**
 * Mapping pour la commande STORAGE_GET
 * Extrait et calcule tous les champs de stockage depuis la réponse BLE
 */
export const storageMappings: Record<string, SyncMapping> = {
  [BluetoothMessage.STORAGE_GET]: {
    extract: (response: Record<string, unknown>) => {
      const total = typeof response.totalBytes === 'number' ? response.totalBytes : null;
      const free = typeof response.freeBytes === 'number' ? response.freeBytes : null;
      const used = typeof response.usedBytes === 'number' ? response.usedBytes : null;
      
      // Si aucune donnée valide, ne pas synchroniser
      if (total === null && free === null && used === null) {
        return null;
      }
      
      // Calculer les pourcentages si on a les données nécessaires
      let freePercent: number | null = null;
      let usedPercent: number | null = null;
      
      if (total !== null && total > 0) {
        if (free !== null) {
          freePercent = Math.round((free / total) * 100);
        }
        if (used !== null) {
          usedPercent = Math.round((used / total) * 100);
        } else if (free !== null) {
          // Calculer used à partir de total et free si used n'est pas fourni
          const calculatedUsed = total - free;
          usedPercent = Math.round((calculatedUsed / total) * 100);
        }
      }
      
      return {
        storageTotalBytes: total,
        storageFreeBytes: free,
        storageUsedBytes: used,
        storageFreePercent: freePercent,
        storageUsedPercent: usedPercent,
        storageLastUpdated: new Date().toISOString(),
      };
    },
  },
};
