/**
 * Commande BLE "setup"
 * Configure le WiFi avec SSID et password
 */

import { Device } from 'react-native-ble-plx';
import { sendBLECommand } from '../bleUtils';

export interface SetupCommandParams {
  ssid: string;
  password?: string;
}

export interface SetupCommandOptions {
  params?: SetupCommandParams;
  timeoutMs?: number;
}

export interface SetupCommandResult {
  success: boolean;
  message?: string;
  wifiConnected?: boolean;
  deviceId?: string; // UUID renvoyé par l'ESP32
  macAddress?: string; // Adresse MAC WiFi renvoyée par l'ESP32 (utilisée pour PubNub)
  brightness?: number; // Brightness en pourcentage (0-100)
  sleepTimeout?: number; // Sleep timeout en millisecondes
  firmwareVersion?: string; // Version du firmware ESP32
}

/**
 * Envoie la commande "setup" au device BLE et attend la réponse
 * @param device Device BLE connecté
 * @param options Options de la commande (paramètres WiFi et timeout)
 * @returns Résultat de la commande avec le statut de connexion WiFi
 */
export async function sendSetupCommand(
  device: Device,
  options: SetupCommandOptions = {}
): Promise<SetupCommandResult> {
  const { params, timeoutMs = 30000 } = options;

  // Si pas de paramètres, envoyer juste la commande setup sans données
  if (!params) {
    const command = {
      command: 'setup',
    };

    // Envoyer la commande via l'utilitaire et attendre la réponse
    const result = await sendBLECommand(device, command, 'setup', timeoutMs);
    
    return {
      success: result.success,
      message: result.data?.message || result.message || 'Commande setup envoyée',
      wifiConnected: result.data?.wifiConnected,
      deviceId: result.data?.deviceId, // UUID renvoyé par l'ESP32
      macAddress: result.data?.macAddress, // Adresse MAC WiFi renvoyée par l'ESP32
      brightness: result.data?.brightness, // Brightness en pourcentage (0-100)
      sleepTimeout: result.data?.sleepTimeout, // Sleep timeout en millisecondes
      firmwareVersion: result.data?.firmwareVersion, // Version du firmware ESP32
    };
  }

  // Construire la commande avec les paramètres WiFi
  const command = {
    command: 'setup',
    ssid: params.ssid,
    ...(params.password && { password: params.password }),
  };

  // Envoyer la commande via l'utilitaire et attendre la réponse
  const result = await sendBLECommand(device, command, 'setup', timeoutMs);
  
  return {
    success: result.success,
    message: result.data?.message || result.message || 'Commande setup envoyée',
    wifiConnected: result.data?.wifiConnected,
    deviceId: result.data?.deviceId, // UUID renvoyé par l'ESP32
    macAddress: result.data?.macAddress, // Adresse MAC WiFi renvoyée par l'ESP32
    brightness: result.data?.brightness, // Brightness en pourcentage (0-100)
    sleepTimeout: result.data?.sleepTimeout, // Sleep timeout en millisecondes
    firmwareVersion: result.data?.firmwareVersion, // Version du firmware ESP32
  };
}
