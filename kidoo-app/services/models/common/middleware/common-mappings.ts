/**
 * Mappings de synchronisation pour les données communes à tous les modèles
 * Ces mappings mettent à jour directement la table Kidoo (pas KidooConfigBasic)
 */

import type { SyncMapping } from '../../types';

/**
 * Mappings pour les commandes communes (VERSION, etc.)
 * Ces données sont synchronisées dans la table Kidoo principale
 * 
 * Note: VERSION n'est pas dans l'enum BluetoothMessage, c'est un message string
 */
export const commonMappings: Record<string, SyncMapping> = {
  VERSION: {
    extract: (response: Record<string, unknown>) => {
      const firmwareVersion = typeof response.firmwareVersion === 'string' ? response.firmwareVersion : null;
      const model = typeof response.model === 'string' ? response.model : null;
      
      // Si aucune donnée valide, ne pas synchroniser
      if (!firmwareVersion && !model) {
        return null;
      }
      
      // Retourner les données à synchroniser
      // Note: Ces champs seront synchronisés via updateKidoo, pas updateKidooConfigBasic
      return {
        firmwareVersion: firmwareVersion || undefined,
        model: model || undefined,
      };
    },
  },
};
