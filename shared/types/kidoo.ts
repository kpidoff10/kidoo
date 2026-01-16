/**
 * Types pour les Kidoos partagés entre le client et le serveur
 */

/**
 * Type pour la configuration Basic d'un Kidoo
 */
export interface KidooConfigBasic {
  id: string;
  kidooId: string;
  brightness: number;
  sleepTimeout: number;
  storageTotalBytes: number | null;
  storageFreeBytes: number | null;
  storageUsedBytes: number | null;
  storageFreePercent: number | null;
  storageUsedPercent: number | null;
  storageLastUpdated: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Kidoo {
  id: string;
  name: string;
  model: string; // Modèle du Kidoo (classic, mini, pro, etc.)
  macAddress?: string | null;
  deviceId: string; // UUID du device BLE
  firmwareVersion?: string | null;
  lastConnected?: string | null; // ISO date string
  isConnected: boolean;
  wifiSSID?: string | null;
  userId?: string | null;
  isSynced: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  configBasic?: KidooConfigBasic | null;
}

// Les types CreateKidooInput et UpdateKidooInput sont maintenant dans schemas/kidoo.ts
// On garde cette interface pour compatibilité mais elle sera remplacée par le type du schéma Zod

export interface LEDColor {
  r: number;
  g: number;
  b: number;
}

export interface LEDSettings {
  color: LEDColor;
  brightness: number; // 0-100
  effect: 'solid' | 'glossy' | 'rainbow' | 'pulse';
}
