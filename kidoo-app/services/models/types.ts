/**
 * Types pour les mappings de synchronisation
 */

/**
 * Type pour un mapping de synchronisation simple (un seul champ)
 */
export interface SyncMappingSingle {
  /** Nom du champ dans la réponse BLE */
  field: string;
  /** Nom du champ dans la configuration du serveur */
  configField: string;
}

/**
 * Type pour un mapping de synchronisation multiple (plusieurs champs)
 */
export interface SyncMappingMultiple {
  /** Fonction pour extraire et transformer les données depuis la réponse BLE */
  extract: (response: Record<string, unknown>) => Record<string, unknown> | null;
}

/**
 * Type pour un mapping de synchronisation (simple ou multiple)
 */
export type SyncMapping = SyncMappingSingle | SyncMappingMultiple;
