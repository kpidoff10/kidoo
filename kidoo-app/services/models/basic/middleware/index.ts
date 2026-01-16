/**
 * Point d'entrée pour tous les mappings de synchronisation du modèle Basic
 * 
 * Ce fichier regroupe tous les mappings spécifiques au modèle Basic :
 * - brightness-mapping: Mapping pour la luminosité
 * - sleep-timeout-mapping: Mapping pour le timeout de sommeil
 * - storage-mappings: Mappings pour les données de stockage
 */

import { brightnessMapping } from './brightness-mapping';
import { sleepTimeoutMapping } from './sleep-timeout-mapping';
import { storageMappings } from './storage-mappings';
import type { SyncMapping } from '../../types';

/**
 * Tous les mappings de synchronisation pour le modèle Basic
 * 
 * Structure:
 * - Clé: Message BLE (ex: BasicBluetoothMessage.BRIGHTNESS_SET, BluetoothMessage.STORAGE_GET)
 * - Valeur: Mapping entre le champ de la réponse BLE et le champ de la config serveur
 */
export const basicModelMappings: Record<string, SyncMapping> = {
  // Mappings spécifiques au modèle Basic
  ...brightnessMapping,
  ...sleepTimeoutMapping,
  
  // Mappings pour le stockage (utilisé par le modèle Basic)
  ...storageMappings,
};

// Réexporter les mappings individuels pour un accès direct si nécessaire
export { brightnessMapping } from './brightness-mapping';
export { sleepTimeoutMapping } from './sleep-timeout-mapping';
export { storageMappings } from './storage-mappings';
