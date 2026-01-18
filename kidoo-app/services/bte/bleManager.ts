/**
 * BLE Manager
 * Gestion centralisée de toutes les opérations Bluetooth Low Energy (BTE)
 * - Connexion/Déconnexion
 * - Envoi de commandes
 * - Monitoring de caractéristiques
 * - Gestion des subscriptions
 */

import { fromByteArray, toByteArray } from 'base64-js';
import type {
  BluetoothResponse,
  TypedBluetoothCommand,
  CommandResponse,
  WifiSetupResponse,
} from '@/types/bluetooth';
import { BluetoothCommandType, BluetoothMessage, COMMAND_TO_MESSAGE, MESSAGE_TO_ERROR } from '@/types/bluetooth';

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

export interface WaitForResponseOptions {
  /** Message attendu (enum BluetoothMessage ou string pour les messages génériques) */
  expectedMessage: BluetoothMessage | string;
  /** Timeout en millisecondes (défaut: 30000) */
  timeout?: number;
  /** Message d'erreur personnalisé pour le timeout (optionnel) */
  timeoutErrorMessage?: string;
}

class BLEManagerClass {
  private device: any | null = null;
  private deviceInfo: BLEDevice | null = null;
  private isConnecting = false;
  private callbacks: BLEManagerCallbacks = {};
  private monitoringSubscription: any | null = null;
  private isMonitoring = false;
  private monitoringUnsubscribed = false;
  private isDisconnecting = false; // Flag pour ignorer les callbacks pendant la déconnexion
  private activeNotificationCallback: ((response: BluetoothResponse) => void) | null = null; // Callback actif pour les notifications
  private scanCache: Map<string, { available: boolean; timestamp: number }> = new Map(); // Cache des scans récents
  private readonly SCAN_CACHE_DURATION = 10000; // Cache valide pendant 10 secondes
  private activeScanManager: any | null = null; // Manager utilisé pour le scan continu
  private activeScanCallback: ((deviceId: string) => void) | null = null; // Callback pour le scan continu

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
   * Vérifier si le Bluetooth est disponible (méthode privée)
   */
  private isAvailable(): boolean {
    return bluetoothModuleAvailable && BleManager !== null;
  }

  /**
   * Vérifier si un device est connecté
   */
  isConnected(): boolean {
    return this.device !== null && this.deviceInfo !== null;
  }

  /**
   * Vérifier si un device est disponible (scannable)
   * Utilise un cache pour éviter les scans répétés
   * @param deviceId - ID du device à vérifier
   * @param manager - Instance du BleManager
   * @param timeout - Timeout en ms (défaut: 5000)
   * @returns true si le device est trouvé, false sinon
   */
  private async isDeviceAvailable(deviceId: string, manager: any, timeout: number = 5000): Promise<boolean> {
    // Vérifier le cache d'abord
    const cached = this.scanCache.get(deviceId);
    const now = Date.now();
    if (cached && (now - cached.timestamp) < this.SCAN_CACHE_DURATION) {
      console.log('[BLEManager] Utilisation du cache de scan pour:', deviceId, cached.available ? 'disponible' : 'non disponible');
      return cached.available;
    }

    return new Promise((resolve) => {
      let found = false;
      const timeoutId = setTimeout(() => {
        try {
          manager.stopDeviceScan();
        } catch (_e) {
          // Ignorer les erreurs d'arrêt du scan
        }
        if (!found) {
          console.log('[BLEManager] Device non trouvé dans le scan:', deviceId);
          // Mettre en cache le résultat
          this.scanCache.set(deviceId, { available: false, timestamp: now });
          resolve(false);
        }
      }, timeout);

      try {
        // Démarrer le scan directement
        manager.startDeviceScan(null, null, (error: any, scannedDevice: any) => {
          if (found) {
            return; // Déjà trouvé, ignorer les autres résultats
          }

          if (error) {
            // Ignorer les erreurs de scan individuelles
            return;
          }

          if (scannedDevice && scannedDevice.id === deviceId) {
            found = true;
            clearTimeout(timeoutId);
            try {
              manager.stopDeviceScan();
            } catch (_e) {
              // Ignorer les erreurs d'arrêt du scan
            }
            console.log('[BLEManager] Device trouvé dans le scan:', deviceId);
            // Mettre en cache le résultat
            this.scanCache.set(deviceId, { available: true, timestamp: now });
            resolve(true);
          }
        });
      } catch (error) {
        clearTimeout(timeoutId);
        try {
          manager.stopDeviceScan();
        } catch (_e) {
          // Ignorer les erreurs d'arrêt du scan
        }
        console.debug('[BLEManager] Erreur lors du scan:', error);
        // Mettre en cache le résultat (non disponible)
        this.scanCache.set(deviceId, { available: false, timestamp: now });
        resolve(false);
      }
    });
  }

  /**
   * Invalider le cache de scan pour un device (appelé après une connexion réussie)
   */
  private invalidateScanCache(deviceId?: string): void {
    if (deviceId) {
      this.scanCache.delete(deviceId);
    } else {
      this.scanCache.clear();
    }
  }

  /**
   * Démarrer un scan continu pour détecter un device spécifique
   * Appelle le callback automatiquement quand le device est détecté
   * @param deviceId - ID du device à rechercher
   * @param onDeviceFound - Callback appelé quand le device est trouvé
   * @returns Fonction pour arrêter le scan
   */
  startContinuousScan(
    deviceId: string,
    onDeviceFound: (deviceId: string) => void
  ): () => void {
    if (!this.isAvailable()) {
      console.log('[BLEManager] Bluetooth non disponible pour le scan continu');
      return () => {}; // Retourner une fonction vide
    }

    // Arrêter le scan précédent s'il existe
    this.stopContinuousScan();

    try {
      console.log('[BLEManager] Démarrage du scan continu pour:', deviceId);
      
      // Créer un nouveau manager pour le scan
      const manager = new BleManager();
      this.activeScanManager = manager;
      this.activeScanCallback = onDeviceFound;
      
      // Démarrer le scan
      manager.startDeviceScan(null, null, (error: any, scannedDevice: any) => {
        if (error) {
          // Ignorer les erreurs de scan individuelles
          return;
        }

        if (scannedDevice && scannedDevice.id === deviceId) {
          console.log('[BLEManager] Device détecté dans le scan continu:', deviceId);
          
          // Sauvegarder le callback avant d'arrêter le scan
          const callback = this.activeScanCallback;
          console.log('[BLEManager] Callback disponible:', !!callback);
          
          if (!callback) {
            console.warn('[BLEManager] Aucun callback disponible pour le device détecté');
            return;
          }
          
          // Arrêter le scan
          this.stopContinuousScan();
          
          // Appeler le callback après un court délai pour s'assurer que le scan est bien arrêté
          console.log('[BLEManager] Appel du callback de détection du device dans 100ms');
          setTimeout(() => {
            console.log('[BLEManager] Exécution du callback de détection du device');
            try {
              callback(deviceId);
              console.log('[BLEManager] Callback exécuté avec succès');
            } catch (error) {
              console.error('[BLEManager] Erreur lors de l\'exécution du callback:', error);
            }
          }, 100);
        }
      });

      // Retourner la fonction pour arrêter le scan
      return () => {
        this.stopContinuousScan();
      };
    } catch (error) {
      console.error('[BLEManager] Erreur lors du démarrage du scan continu:', error);
      this.activeScanCallback = null;
      this.activeScanManager = null;
      return () => {}; // Retourner une fonction vide
    }
  }

  /**
   * Arrêter le scan continu
   */
  stopContinuousScan(): void {
    if (this.activeScanManager) {
      try {
        this.activeScanManager.stopDeviceScan();
      } catch (error) {
        console.debug('[BLEManager] Erreur lors de l\'arrêt du scan continu:', error);
      }
      this.activeScanManager = null;
    }
    this.activeScanCallback = null;
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

    let manager: any = null;

    try {
      if (!this.isAvailable()) {
        this.isConnecting = false;
        return { success: false, error: 'Bluetooth non disponible' };
      }

      manager = new BleManager();

      // Vérifier l'état du Bluetooth
      const state = await manager.state();
      if (state !== State.PoweredOn) {
        manager.destroy();
        this.isConnecting = false;
        return { success: false, error: 'Bluetooth non activé' };
      }

      console.log('[BLEManager] Vérification de la disponibilité du device:', device.deviceId);

      // Vérifier si le device est disponible avant de tenter la connexion
      const isAvailable = await this.isDeviceAvailable(device.deviceId, manager, 5000);
      if (!isAvailable) {
        manager.destroy();
        this.isConnecting = false;
        return { success: false, error: 'Device non disponible ou hors de portée' };
      }

      console.log('[BLEManager] Device disponible, tentative de connexion:', device.deviceId);

      // Se connecter au device
      const bleDevice = await manager.connectToDevice(device.deviceId, {
        autoConnect: false,
        timeout: 10000,
      });

      // Attendre que la connexion soit établie
      console.log('[BLEManager] Tentative de connexion en cours...');
      await bleDevice.connect();

      // Vérifier si la connexion est établie
      const isConnected = bleDevice.isConnected;
      console.log('[BLEManager] État de connexion après connect():', isConnected);
      
      if (!isConnected) {
        console.error('[BLEManager] ÉCHEC: La connexion n\'est pas établie');
        manager.destroy();
        this.isConnecting = false;
        return { success: false, error: 'Échec de la connexion' };
      }

      console.log('[BLEManager] Connexion établie avec succès !');
      
      // Découvrir les services AVANT de négocier le MTU (ordre recommandé)
      try {
        console.log('[BLEManager] Découverte des services et caractéristiques...');
        await bleDevice.discoverAllServicesAndCharacteristics();
        console.log('[BLEManager] Services et caractéristiques découverts');
      } catch (discoverError) {
        console.error('[BLEManager] ERREUR lors de la découverte des services:', discoverError);
        // Ne pas retourner d'erreur ici, continuer quand même
      }

      // Demander un MTU plus grand (247 bytes max standard BLE)
      // Note: 512 bytes était trop élevé et causait des problèmes de mémoire sur l'ESP32
      try {
        console.log('[BLEManager] Négociation du MTU (247 bytes)...');
        await bleDevice.requestMTU(247);
        console.log('[BLEManager] MTU négocié avec succès: 247 bytes');
      } catch (mtuError) {
        console.warn('[BLEManager] Erreur lors de la négociation MTU (non critique):', mtuError);
      }

      // Stocker le device
      this.device = bleDevice;
      this.deviceInfo = device;
      this.isConnecting = false;

      // Invalider le cache de scan pour ce device (connexion réussie)
      this.invalidateScanCache(device.deviceId);

      console.log('[BLEManager] Démarrage du monitoring automatique...');
      // Démarrer le monitoring automatiquement après la connexion
      await this.startPersistentMonitoring();
      console.log('[BLEManager] Monitoring démarré');

      if (!this.isDisconnecting) {
        try {
          this.callbacks.onConnected?.(device);
        } catch (callbackError) {
          console.error('[BLEManager] Erreur dans callback onConnected:', callbackError);
        }
      }
      return { success: true, device: bleDevice };
    } catch (error: any) {
      this.isConnecting = false;
      
      // Nettoyer le manager si créé
      if (manager) {
        try {
          manager.destroy();
        } catch (destroyError) {
          console.debug('[BLEManager] Erreur lors de la destruction du manager:', destroyError);
        }
      }
      
      // Extraire le message d'erreur de manière sécurisée
      let errorMessage = 'Erreur de connexion Bluetooth';
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.reason) {
        errorMessage = error.reason;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Appeler le callback d'erreur de manière sécurisée
      try {
        this.callbacks.onError?.(errorMessage);
      } catch (callbackError) {
        console.error('[BLEManager] Erreur dans le callback onError:', callbackError);
      }
      
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
    
    // Arrêter le monitoring et nettoyer le callback actif
    this.stopMonitoring();
    this.activeNotificationCallback = null;
    
    // Nettoyer les références immédiatement
    this.device = null;
    this.deviceInfo = null;
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
   * Envoyer une commande au device (méthode bas niveau)
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
   * Envoyer une commande typée et attendre la réponse correspondante
   * Combine sendCommand + waitForResponse automatiquement
   * Utilise un type générique pour inférer automatiquement le type de retour selon la commande
   */
  async sendCommandAndWait<T extends TypedBluetoothCommand>(
    command: T,
    options?: {
      timeout?: number;
      timeoutErrorMessage?: string;
    }
  ): Promise<CommandResponse<T>> {
    // Trouver le message attendu pour cette commande
    const expectedMessage = COMMAND_TO_MESSAGE[command.command];
    if (!expectedMessage) {
      throw new Error(`Aucun message attendu défini pour la commande: ${command.command}`);
    }

    // Envoyer la commande
    const commandJson = JSON.stringify(command);
    const success = await this.sendCommand(commandJson);
    
    if (!success) {
      throw new Error('Erreur lors de l\'envoi de la commande');
    }

    // Attendre la réponse
    // Le cast est sûr car le type de retour est garanti par le mapping CommandToResponseMap
    return this.waitForResponse({
      expectedMessage,
      timeout: options?.timeout,
      timeoutErrorMessage: options?.timeoutErrorMessage,
    }) as Promise<CommandResponse<T>>;
  }

  /**
   * Démarrer le monitoring persistant (appelé automatiquement à la connexion)
   */
  private async startPersistentMonitoring(): Promise<void> {
    if (!this.device) {
      console.error('[BLEManager] Aucun device connecté pour démarrer le monitoring');
      return;
    }

    if (this.isMonitoring) {
      console.log('[BLEManager] Monitoring déjà actif');
      return;
    }

    try {
      // Vérifier que le device est connecté
      const isConnected = await this.device.isConnected();
      if (!isConnected) {
        console.error('[BLEManager] Device non connecté pour démarrer le monitoring');
        return;
      }

      // Découvrir les services si nécessaire (on l'a déjà fait dans connect(), mais on le refait au cas où)
      try {
        console.log('[BLEManager] Découverte des services pour le monitoring...');
        await this.device.discoverAllServicesAndCharacteristics();
        console.log('[BLEManager] Services découverts pour le monitoring');
      } catch (discoverError) {
        console.error('[BLEManager] ERREUR lors de la découverte des services pour le monitoring:', discoverError);
        throw discoverError; // Propager l'erreur car on ne peut pas monitorer sans services
      }

      console.log('[BLEManager] Démarrage du monitoring persistant');
      this.isMonitoring = true;
      this.monitoringUnsubscribed = false;

      this.monitoringSubscription = this.device.monitorCharacteristicForService(
        this.DEFAULT_SERVICE_UUID,
        this.CHARACTERISTIC_UUID_TX,
        (error: any, characteristic: any) => {
          try {
            if (this.monitoringUnsubscribed || this.isDisconnecting) {
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
                  // Appeler le callback actif s'il existe
                  if (this.activeNotificationCallback) {
                    try {
                      this.activeNotificationCallback(parsedValue);
                    } catch (callbackError) {
                      console.error('[BLEManager] Erreur dans callback actif:', callbackError);
                    }
                  }
                  
                  // Appeler aussi le callback global si défini
                  try {
                    if (this.callbacks.onNotification && !this.isDisconnecting) {
                      this.callbacks.onNotification(parsedValue);
                    }
                  } catch (callbackError) {
                    console.error('[BLEManager] Erreur dans callback global:', callbackError);
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

      console.log('[BLEManager] Monitoring persistant démarré');
    } catch (error: any) {
      console.error('[BLEManager] Erreur démarrage monitoring persistant:', error);
      this.isMonitoring = false;
      this.callbacks.onError?.(error?.message || 'Erreur démarrage monitoring');
    }
  }

  /**
   * Définir le callback actif pour les notifications (méthode privée)
   * Le monitoring reste actif, on change juste le callback
   */
  private setActiveNotificationCallback(callback: ((response: BluetoothResponse) => void) | null): void {
    this.activeNotificationCallback = callback;
    if (callback) {
      console.log('[BLEManager] Callback actif défini');
    } else {
      console.log('[BLEManager] Callback actif supprimé');
    }
  }

  /**
   * Attendre une réponse spécifique du monitoring
   * Surveille le monitoring pour un message donné et retourne la réponse ou une erreur après timeout
   * Gère automatiquement les messages d'erreur correspondants (ex: 'WIFI_ERROR' si on attend 'WIFI_OK')
   * 
   * @param options - Options de configuration (expectedMessage requis, timeout et timeoutErrorMessage optionnels)
   * @returns Promise qui se résout avec la réponse complète ou rejette avec une erreur
   */
  async waitForResponse(options: WaitForResponseOptions): Promise<BluetoothResponse> {
    const { expectedMessage, timeout = 30000, timeoutErrorMessage } = options;
    
    if (!this.device || !this.isMonitoring) {
      throw new Error('Device non connecté ou monitoring non démarré');
    }

    return new Promise((resolve, reject) => {
      let timeoutId: any = null;
      let isResolved = false;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        // Supprimer le callback actif
        if (this.activeNotificationCallback === notificationCallback) {
          this.setActiveNotificationCallback(null);
        }
      };

      const notificationCallback = (response: BluetoothResponse) => {
        if (isResolved) return;

        // Trouver le message d'erreur correspondant (seulement si c'est un enum BluetoothMessage)
        const errorMessage = typeof expectedMessage === 'string' && expectedMessage in MESSAGE_TO_ERROR
          ? MESSAGE_TO_ERROR[expectedMessage as BluetoothMessage]
          : expectedMessage;

        // Vérifier si c'est la réponse attendue (succès ou erreur correspondante)
        if (response.message === expectedMessage || response.message === errorMessage) {
          isResolved = true;
          cleanup();
          
          // Si c'est le message de succès avec status success -> résoudre
          if (response.status === 'success' && response.message === expectedMessage) {
            resolve(response);
          } else {
            // Message d'erreur ou status error -> rejeter avec l'erreur
            reject(new Error(response.error || `Erreur dans la réponse: ${response.message}`));
          }
        }
        // Sinon, on ignore la réponse (ce n'est pas celle qu'on attend)
      };

      // Définir le callback actif
      this.setActiveNotificationCallback(notificationCallback);

      // Configurer le timeout
      timeoutId = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          const errorMsg = timeoutErrorMessage || `Timeout: aucune réponse reçue après ${Math.round(timeout / 1000)} secondes`;
          reject(new Error(errorMsg));
        }
      }, timeout);
    });
  }

  /**
   * Arrêter le monitoring persistant (méthode privée, appelée lors de la déconnexion)
   */
  private stopMonitoring(): void {
    if (!this.isMonitoring && !this.monitoringSubscription) {
      return;
    }

    try {
      // Nettoyer le callback actif
      this.activeNotificationCallback = null;
      
      // NE JAMAIS appeler remove() directement - ça peut crasher au niveau natif
      // La bibliothèque gère automatiquement le cleanup quand le device est déconnecté
      // On marque juste comme désabonné et on laisse le garbage collector faire le travail
      this.monitoringUnsubscribed = true;
      this.isMonitoring = false;
      this.monitoringSubscription = null;
      
      console.log('[BLEManager] Monitoring persistant arrêté');
    } catch (error) {
      console.error('[BLEManager] Erreur dans stopMonitoring():', error);
      this.monitoringUnsubscribed = true;
      this.isMonitoring = false;
      this.monitoringSubscription = null;
      this.activeNotificationCallback = null;
    }
  }

  /**
   * Configurer le WiFi d'un Kidoo
   * Fonction utilitaire qui simplifie l'appel de configuration WiFi
   */
  async configureWiFi(
    ssid: string,
    password?: string,
    options?: {
      timeout?: number;
      timeoutErrorMessage?: string;
    }
  ): Promise<WifiSetupResponse> {
    return this.sendCommandAndWait(
      {
        command: BluetoothCommandType.SETUP,
        ssid: ssid.trim(),
        password: password || '',
      },
      options
    );
  }

  /**
   * Réinitialiser les paramètres par défaut du Kidoo
   * Commande globale commune à tous les modèles
   * Note: Cette commande n'est pas encore implémentée côté ESP32 en BLE
   * @returns true si la commande a été envoyée avec succès
   */
  async reset(): Promise<boolean> {
    return this.sendCommand(JSON.stringify({ command: 'RESET' }));
  }
}

// Export d'une instance singleton
export const bleManager = new BLEManagerClass();
