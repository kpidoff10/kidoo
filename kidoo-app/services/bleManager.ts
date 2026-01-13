/**
 * BLE Manager
 * Gestion centralisée de toutes les opérations Bluetooth Low Energy
 * - Connexion/Déconnexion
 * - Envoi de commandes
 * - Monitoring de caractéristiques
 * - Gestion des subscriptions
 */

import { fromByteArray, toByteArray } from 'base64-js';
import type { BluetoothResponse } from '@/types/bluetooth';

// Import conditionnel de react-native-ble-plx
let BleManager: any = null;
let State: any = null;
let bluetoothModuleAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bleModule = require('react-native-ble-plx');
  if (bleModule && typeof bleModule.BleManager !== 'undefined') {
    BleManager = bleModule.BleManager;
    State = bleModule.State;
    bluetoothModuleAvailable = true;
    console.log('[BLEManager] Bluetooth disponible - BleManager initialisé');
  }
} catch (error: unknown) {
  console.debug('[BLEManager] Bluetooth non disponible:', error instanceof Error ? error.message : String(error));
}

export interface BluetoothConnectionResult {
  success: boolean;
  error?: string;
  device?: any;
}

export interface BLEDevice {
  id: string;
  name: string | null;
  deviceId: string;
}

export interface BLEManagerCallbacks {
  onConnected?: (device: BLEDevice) => void;
  onDisconnected?: () => void;
  onError?: (error: string) => void;
  onNotification?: (response: BluetoothResponse) => void;
}

class BLEManagerClass {
  private device: any | null = null;
  private deviceInfo: BLEDevice | null = null;
  private manager: any | null = null; // Référence au BleManager pour la déconnexion
  private isConnecting = false;
  private callbacks: BLEManagerCallbacks = {};
  private monitoringSubscription: any | null = null;
  private isMonitoring = false;
  private monitoringUnsubscribed = false;
  private isDisconnecting = false; // Flag pour ignorer les callbacks pendant la déconnexion

  // UUIDs par défaut
  private readonly DEFAULT_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  private readonly CHARACTERISTIC_UUID_RX = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // Pour écrire (sendCommand)
  private readonly CHARACTERISTIC_UUID_TX = 'beb5483e-36e1-4688-b7f5-ea07361b26a9'; // Pour lire/monitorer (startMonitoring)

  /**
   * Définir les callbacks
   */
  setCallbacks(callbacks: BLEManagerCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Vérifier si le Bluetooth est disponible
   */
  isAvailable(): boolean {
    return bluetoothModuleAvailable && BleManager !== null;
  }

  /**
   * Vérifier si un device est connecté
   */
  isConnected(): boolean {
    return this.device !== null && this.deviceInfo !== null;
  }

  /**
   * Obtenir le device connecté
   */
  getConnectedDevice(): BLEDevice | null {
    return this.deviceInfo;
  }

  /**
   * Se connecter à un device
   */
  async connect(device: BLEDevice): Promise<BluetoothConnectionResult> {
    if (this.isConnecting) {
      return { success: false, error: 'Connexion déjà en cours' };
    }

    if (this.isConnected() && this.deviceInfo?.deviceId === device.deviceId) {
      return { success: true, device: this.device };
    }

    // Déconnecter l'ancien device si différent
    if (this.isConnected() && this.deviceInfo?.deviceId !== device.deviceId) {
      await this.disconnect();
    }

    this.isConnecting = true;

    try {
      if (!this.isAvailable()) {
        throw new Error('Bluetooth non disponible');
      }

      const manager = new BleManager();

      // Vérifier l'état du Bluetooth
      const state = await manager.state();
      if (state !== State.PoweredOn) {
        manager.destroy();
        throw new Error('Bluetooth non activé');
      }

      // Se connecter au device
      const bleDevice = await manager.connectToDevice(device.deviceId, {
        autoConnect: false,
        timeout: 10000,
      });

      // Attendre que la connexion soit établie
      await bleDevice.connect();

      // Vérifier si la connexion est établie
      const isConnected = bleDevice.isConnected;
      if (!isConnected) {
        manager.destroy();
        throw new Error('Échec de la connexion');
      }

      // Demander un MTU plus grand (512 bytes)
      try {
        await bleDevice.requestMTU(512);
        console.log('[BLEManager] MTU négocié: 512 bytes');
      } catch (mtuError) {
        console.debug('[BLEManager] Erreur MTU (non critique):', mtuError);
      }

      // Stocker le manager et le device
      this.manager = manager;
      this.device = bleDevice;
      this.deviceInfo = device;
      this.isConnecting = false;

      if (!this.isDisconnecting) {
        this.callbacks.onConnected?.(device);
      }
      return { success: true, device: bleDevice };
    } catch (error: any) {
      this.isConnecting = false;
      const errorMessage = error?.message || 'Erreur de connexion Bluetooth';
      this.callbacks.onError?.(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Se déconnecter du device
   */
  async disconnect(): Promise<void> {
    // Si déjà en train de se déconnecter, ne rien faire
    if (this.isDisconnecting) {
      console.log('[BLEManager] Déconnexion déjà en cours, ignorée');
      return;
    }
    
    // Si pas de device connecté, ne rien faire
    if (!this.device || !this.deviceInfo) {
      console.log('[BLEManager] Aucun device connecté, déconnexion ignorée');
      return;
    }
    
    // Marquer qu'on est en train de se déconnecter
    this.isDisconnecting = true;
    console.log('[BLEManager] Début de la déconnexion...');
    
    // Sauvegarder le callback et le device avant de nettoyer
    const onDisconnectedCallback = this.callbacks.onDisconnected;
    const deviceToDisconnect = this.device;
    
    // Arrêter le monitoring
    this.stopMonitoring();
    
    // Nettoyer les références immédiatement
    this.device = null;
    this.deviceInfo = null;
    this.manager = null;
    this.callbacks = {};
    
    // Déconnecter en utilisant le device directement de manière asynchrone
    // Utiliser setTimeout pour éviter que ça bloque ou plante
    setTimeout(async () => {
      try {
        if (deviceToDisconnect && typeof deviceToDisconnect.cancelConnection === 'function') {
          await deviceToDisconnect.cancelConnection();
          console.log('[BLEManager] Déconnexion réussie');
        }
      } catch (error: any) {
        // Ignorer les erreurs - le device peut être déjà déconnecté
        const errorMsg = error?.message || String(error);
        if (!errorMsg.includes('Device is not connected') && !errorMsg.includes('Device disconnected')) {
          console.log('[BLEManager] Erreur lors de la déconnexion (ignorée):', errorMsg);
        } else {
          console.log('[BLEManager] Device déjà déconnecté');
        }
      }
    }, 50); // Petit délai pour éviter les conflits
    
    // Appeler le callback
    if (onDisconnectedCallback) {
      try {
        onDisconnectedCallback();
      } catch (e) {
        console.error('[BLEManager] Erreur callback onDisconnected:', e);
      }
    }
    
    // Réinitialiser le flag
    this.isDisconnecting = false;
    console.log('[BLEManager] Déconnexion terminée');
  }

  /**
   * Envoyer une commande au device
   */
  async sendCommand(
    command: string,
    serviceUUID: string = this.DEFAULT_SERVICE_UUID,
    characteristicUUID: string = this.CHARACTERISTIC_UUID_RX
  ): Promise<boolean> {
    if (!this.device) {
      console.error('[BLEManager] Aucun device connecté');
      return false;
    }

    try {
      // Vérifier que le device est connecté
      const isConnected = await this.device.isConnected();
      if (!isConnected) {
        console.error('[BLEManager] Device non connecté');
        return false;
      }

      // Découvrir les services si nécessaire
      await this.device.discoverAllServicesAndCharacteristics();

      // Convertir la commande en bytes
      const commandBytes = new TextEncoder().encode(command);
      const base64Command = fromByteArray(commandBytes);

      // Écrire dans la caractéristique RX
      await this.device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        base64Command
      );

      console.log('[BLEManager] Commande envoyée:', command);
      return true;
    } catch (error: any) {
      console.error('[BLEManager] Erreur lors de l\'envoi de la commande:', error);
      this.callbacks.onError?.(error?.message || 'Erreur lors de l\'envoi de la commande');
      return false;
    }
  }

  /**
   * Démarrer le monitoring d'une caractéristique
   */
  async startMonitoring(
    onNotification: (response: BluetoothResponse) => void,
    serviceUUID: string = this.DEFAULT_SERVICE_UUID,
    characteristicUUID: string = this.CHARACTERISTIC_UUID_TX
  ): Promise<() => void> {
    if (!this.device) {
      console.error('[BLEManager] Aucun device connecté pour monitorer');
      return () => {};
    }

    if (this.isMonitoring) {
      console.log('[BLEManager] Monitoring déjà actif');
      return this.stopMonitoring.bind(this);
    }

    try {
      // Vérifier que le device est connecté
      const isConnected = await this.device.isConnected();
      if (!isConnected) {
        console.error('[BLEManager] Device non connecté pour monitorer');
        return () => {};
      }

      // Découvrir les services si nécessaire
      await this.device.discoverAllServicesAndCharacteristics();

      this.isMonitoring = true;
      this.monitoringUnsubscribed = false;

      this.monitoringSubscription = this.device.monitorCharacteristicForService(
        serviceUUID,
        characteristicUUID,
        (error: any, characteristic: any) => {
          try {
            if (this.monitoringUnsubscribed) {
              return;
            }

            if (error) {
              const errorMsg = error?.message || String(error);
              if (!errorMsg.includes('Unknown error') && !errorMsg.includes('Connection closed')) {
                console.debug('[BLEManager] Erreur monitoring:', errorMsg);
              }
              return;
            }

            if (!characteristic || !characteristic.value) {
              return;
            }

            try {
              const bytes = toByteArray(characteristic.value);
              const valueString = new TextDecoder().decode(bytes);

              try {
                const parsedValue: BluetoothResponse = JSON.parse(valueString);
                
                if (!this.monitoringUnsubscribed && !this.isDisconnecting) {
                  try {
                    onNotification(parsedValue);
                  } catch (callbackError) {
                    console.error('[BLEManager] Erreur dans callback onNotification local:', callbackError);
                  }
                  
                  try {
                    if (this.callbacks.onNotification && !this.isDisconnecting) {
                      this.callbacks.onNotification(parsedValue);
                    }
                  } catch (callbackError) {
                    console.error('[BLEManager] Erreur dans callback onNotification global:', callbackError);
                  }
                }
              } catch (parseError) {
                console.error('[BLEManager] Erreur parsing JSON:', parseError, 'Raw:', valueString);
              }
            } catch (decodeError) {
              console.error('[BLEManager] Erreur décodage:', decodeError);
            }
          } catch (globalError) {
            console.error('[BLEManager] Erreur globale dans callback monitoring:', globalError);
          }
        }
      );

      // Retourner la fonction pour arrêter le monitoring
      return () => {
        this.stopMonitoring();
      };
    } catch (error: any) {
      console.error('[BLEManager] Erreur démarrage monitoring:', error);
      this.isMonitoring = false;
      this.callbacks.onError?.(error?.message || 'Erreur démarrage monitoring');
      return () => {};
    }
  }

  /**
   * Arrêter le monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    try {
      this.monitoringUnsubscribed = true;
      this.isMonitoring = false;
      this.monitoringSubscription = null;
    } catch (error) {
      console.error('[BLEManager] Erreur dans stopMonitoring():', error);
      this.monitoringUnsubscribed = true;
      this.isMonitoring = false;
      this.monitoringSubscription = null;
    }
  }

  /**
   * Lire une caractéristique
   */
  async readCharacteristic(
    serviceUUID: string = this.DEFAULT_SERVICE_UUID,
    characteristicUUID: string = this.CHARACTERISTIC_UUID_TX
  ): Promise<string | null> {
    if (!this.device) {
      console.error('[BLEManager] Aucun device connecté');
      return null;
    }

    try {
      const isConnected = await this.device.isConnected();
      if (!isConnected) {
        console.error('[BLEManager] Device non connecté');
        return null;
      }

      await this.device.discoverAllServicesAndCharacteristics();

      const characteristic = await this.device.readCharacteristicForService(
        serviceUUID,
        characteristicUUID
      );

      if (characteristic && characteristic.value) {
        const bytes = toByteArray(characteristic.value);
        return new TextDecoder().decode(bytes);
      }

      return null;
    } catch (error: any) {
      console.error('[BLEManager] Erreur lecture caractéristique:', error);
      return null;
    }
  }

  /**
   * Nettoyer toutes les ressources
   */
  async cleanup(): Promise<void> {
    console.log('[BLEManager] Cleanup...');
    await this.disconnect();
    this.callbacks = {};
  }
}

// Export d'une instance singleton
export const bleManager = new BLEManagerClass();
