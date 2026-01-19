/**
 * Types de réponse get-info communs à tous les modèles Kidoo
 */

/**
 * Structure de base de la réponse - champs communs à tous les modèles
 */
export interface KidooInfoResponseBase {
  type: 'info';
  device: string;
  mac: string;
  ip: string;
  firmware?: string;
  model: string;
  uptime: number; // en secondes
  freeHeap: number; // en bytes
  wifi: {
    ssid: string;
    rssi: number; // force du signal
  };
}

/**
 * Type générique pour la réponse info
 * T permet d'étendre avec les champs spécifiques au modèle
 * 
 * @example
 * // Pour un Kidoo Basic
 * type BasicInfoResponse = KidooInfoResponse<{
 *   brightness: number;
 *   sleepTimeout: number;
 * }>;
 */
export type KidooInfoResponse<T = object> = KidooInfoResponseBase & T;
