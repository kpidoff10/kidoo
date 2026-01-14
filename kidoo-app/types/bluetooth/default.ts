/**
 * Types par défaut pour les commandes et réponses Bluetooth en JSON
 * Types communs à tous les modèles de Kidoo
 */

export enum BluetoothMessage {
  /** WiFi configuré avec succès */
  WIFI_OK = 'WIFI_OK',
  /** Erreur lors de la configuration WiFi */
  WIFI_ERROR = 'WIFI_ERROR',
  /** Tag NFC écrit avec succès */
  NFC_TAG_WRITTEN = 'NFC_TAG_WRITTEN',
  /** Erreur lors de l'écriture du tag NFC */
  NFC_WRITE_ERROR = 'NFC_WRITE_ERROR',
  /** Tag NFC lu avec succès */
  NFC_TAG_READ = 'NFC_TAG_READ',
  /** Erreur lors de la lecture du tag NFC */
  NFC_READ_ERROR = 'NFC_READ_ERROR',
  /** Tag ajouté avec succès (effet visuel) */
  TAG_ADD_SUCCESS = 'TAG_ADD_SUCCESS',
  /** Informations de stockage récupérées avec succès */
  STORAGE_GET = 'STORAGE_GET',
}

export enum BluetoothCommandType {
  /** Configuration WiFi */
  SETUP = 'SETUP',
  /** Écrire sur un tag NFC */
  WRITE_NFC_TAG = 'WRITE_NFC_TAG',
  /** Lire un tag NFC */
  READ_NFC_TAG = 'READ_NFC_TAG',
  /** Confirmer l'ajout réussi d'un tag NFC (effet visuel) */
  TAG_ADD_SUCCESS = 'TAG_ADD_SUCCESS',
  /** Obtenir les informations de stockage */
  GET_STORAGE = 'GET_STORAGE',
}

/** Mapping entre commande et message attendu */
export const COMMAND_TO_MESSAGE: Record<BluetoothCommandType, BluetoothMessage> = {
  [BluetoothCommandType.SETUP]: BluetoothMessage.WIFI_OK,
  [BluetoothCommandType.WRITE_NFC_TAG]: BluetoothMessage.NFC_TAG_WRITTEN,
  [BluetoothCommandType.READ_NFC_TAG]: BluetoothMessage.NFC_TAG_READ,
  [BluetoothCommandType.TAG_ADD_SUCCESS]: BluetoothMessage.TAG_ADD_SUCCESS,
  [BluetoothCommandType.GET_STORAGE]: BluetoothMessage.STORAGE_GET,
};

/** Mapping entre message de succès et message d'erreur correspondant */
export const MESSAGE_TO_ERROR: Record<BluetoothMessage, BluetoothMessage> = {
  [BluetoothMessage.WIFI_OK]: BluetoothMessage.WIFI_ERROR,
  [BluetoothMessage.WIFI_ERROR]: BluetoothMessage.WIFI_ERROR, // Cas d'erreur déjà erreur
  [BluetoothMessage.NFC_TAG_WRITTEN]: BluetoothMessage.NFC_WRITE_ERROR,
  [BluetoothMessage.NFC_WRITE_ERROR]: BluetoothMessage.NFC_WRITE_ERROR, // Cas d'erreur déjà erreur
  [BluetoothMessage.NFC_TAG_READ]: BluetoothMessage.NFC_READ_ERROR,
  [BluetoothMessage.NFC_READ_ERROR]: BluetoothMessage.NFC_READ_ERROR, // Cas d'erreur déjà erreur
  [BluetoothMessage.TAG_ADD_SUCCESS]: BluetoothMessage.TAG_ADD_SUCCESS, // Pas de message d'erreur spécifique pour TAG_ADD_SUCCESS
  [BluetoothMessage.STORAGE_GET]: BluetoothMessage.STORAGE_GET, // Pas de message d'erreur spécifique pour STORAGE_GET
};

/**
 * Obtenir le message d'erreur correspondant à un message de succès
 */
export function getErrorMessageForSuccessMessage(successMessage: BluetoothMessage): BluetoothMessage {
  return MESSAGE_TO_ERROR[successMessage] || successMessage;
}

export interface BluetoothCommand {
  command: string;
  [key: string]: any;
}

export interface SetupCommand extends BluetoothCommand {
  command: BluetoothCommandType.SETUP;
  ssid: string;
  password?: string;
}

export interface WriteNFCTagCommand extends BluetoothCommand {
  command: BluetoothCommandType.WRITE_NFC_TAG;
  blockNumber: number;
  data: number[];
}

export interface ReadNFCTagCommand extends BluetoothCommand {
  command: BluetoothCommandType.READ_NFC_TAG;
  blockNumber: number;
}

export interface TagAddSuccessCommand extends BluetoothCommand {
  command: BluetoothCommandType.TAG_ADD_SUCCESS;
}

export interface GetStorageCommand extends BluetoothCommand {
  command: BluetoothCommandType.GET_STORAGE;
}

export type TypedBluetoothCommand = SetupCommand | WriteNFCTagCommand | ReadNFCTagCommand | TagAddSuccessCommand | GetStorageCommand;

/**
 * Mapping entre les types de commandes et leurs réponses correspondantes
 * Utilisé pour inférer automatiquement le type de retour selon la commande
 */
export type CommandToResponseMap = {
  [BluetoothCommandType.SETUP]: WifiSetupResponse;
  [BluetoothCommandType.WRITE_NFC_TAG]: NFCTagWriteResponse;
  [BluetoothCommandType.READ_NFC_TAG]: NFCTagReadResponse;
  [BluetoothCommandType.TAG_ADD_SUCCESS]: TagAddSuccessResponse;
  [BluetoothCommandType.GET_STORAGE]: StorageGetResponse;
};

/**
 * Type helper pour extraire le type de réponse selon le type de commande
 */
export type CommandResponse<T extends TypedBluetoothCommand> = 
  T extends SetupCommand ? WifiSetupResponse :
  T extends WriteNFCTagCommand ? NFCTagWriteResponse :
  T extends ReadNFCTagCommand ? NFCTagReadResponse :
  T extends TagAddSuccessCommand ? TagAddSuccessResponse :
  T extends GetStorageCommand ? StorageGetResponse :
  BluetoothResponse;

export interface BluetoothResponse {
  status: 'success' | 'error';
  message: string;
  error?: string;
  firmwareVersion?: string;
  model?: string; // Modèle du Kidoo (classic, mini, pro, etc.)
  [key: string]: any;
}

export interface WifiSetupResponse extends BluetoothResponse {
  status: 'success' | 'error';
  message: 'WIFI_OK' | 'WIFI_ERROR';
  error?: string;
}

/**
 * Réponse pour la commande VERSION (getSystemInfo)
 */
export interface SystemInfoResponse extends BluetoothResponse {
  status: 'success';
  message: 'VERSION';
  firmwareVersion: string;
  model: string;
}

/**
 * Réponse pour la commande READ_NFC_TAG (readNFCTag)
 */
export interface NFCTagReadResponse extends BluetoothResponse {
  status: 'success' | 'error';
  message: 'NFC_TAG_READ' | 'NFC_READ_ERROR';
  blockNumber?: number;
  data?: number[]; // Données du bloc lu (si disponibles)
  uid?: string; // UID physique du tag NFC (format hexadécimal)
  uidBytes?: number[]; // UID en tableau d'octets
  uidLength?: number; // Longueur de l'UID
  error?: string;
}

/**
 * Réponse pour la commande WRITE_NFC_TAG (writeNFCTag)
 */
export interface NFCTagWriteResponse extends BluetoothResponse {
  status: 'success' | 'error';
  message: 'NFC_TAG_WRITTEN' | 'NFC_WRITE_ERROR';
  blockNumber?: number;
  uid?: string; // UID physique du tag NFC (format hexadécimal)
  error?: string;
}

/**
 * Réponse pour la commande TAG_ADD_SUCCESS (tagAddSuccess)
 */
export interface TagAddSuccessResponse extends BluetoothResponse {
  status: 'success';
  message: 'TAG_ADD_SUCCESS';
}

/**
 * Réponse pour la commande GET_STORAGE (getStorage)
 */
export interface StorageGetResponse extends BluetoothResponse {
  status: 'success';
  message: 'STORAGE_GET';
  totalBytes?: number;
  usedBytes?: number;
  freeBytes?: number;
  [key: string]: any;
}
