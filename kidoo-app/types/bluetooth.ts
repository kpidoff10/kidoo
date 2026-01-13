/**
 * Types pour les commandes et réponses Bluetooth en JSON
 */

export interface BluetoothCommand {
  command: string;
  [key: string]: any;
}

export interface SetupCommand extends BluetoothCommand {
  command: 'SETUP';
  ssid: string;
  password?: string;
}

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
