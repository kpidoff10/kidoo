/**
 * Point d'entrée pour tous les mappings de synchronisation
 * 
 * Ce fichier regroupe tous les mappings de synchronisation des réponses BLE
 * avec le serveur, organisés par modèle (Basic, etc.) et par domaine commun
 */

import { basicModelMappings } from './basic/middleware';
import { commonMappings } from './common/middleware/common-mappings';
import type { SyncMapping } from './types';

/**
 * Tous les mappings de synchronisation regroupés
 * 
 * Structure:
 * - Clé: Message BLE (ex: BasicBluetoothMessage.BRIGHTNESS_SET, BluetoothMessage.STORAGE_GET)
 * - Valeur: Mapping entre le champ de la réponse BLE et le champ de la config serveur
 */
export const SYNC_MAPPINGS: Record<string, SyncMapping> = {
  // Modèle Basic (inclut basic-mappings et storage-mappings)
  ...basicModelMappings,
  
  // Données communes (Kidoo principal, pas configBasic)
  ...commonMappings,
  
  // Ajouter d'autres mappings ici pour d'autres modèles de Kidoo
  // Exemple pour un futur modèle:
  // ...otherModelMappings,
};

// Réexporter les types
export type { SyncMapping, SyncMappingSingle, SyncMappingMultiple } from './types';
