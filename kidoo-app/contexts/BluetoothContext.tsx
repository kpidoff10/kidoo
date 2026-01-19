/**
 * Context Bluetooth
 * Gère l'état du device Bluetooth connecté et les opérations de connexion/déconnexion
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { fromByteArray, toByteArray } from 'base64-js';
import { bteService, type BluetoothConnectionResult } from '@/services/bte';
import type { BluetoothResponse } from '@/types/bluetooth';

interface BluetoothDevice {
  id: string;
  name: string | null;
  deviceId: string;
}

interface BluetoothContextValue {
  // État
  connectedDevice: BluetoothDevice | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectionError: string | null;
  isBluetoothEnabled: boolean;
  isBluetoothAvailable: boolean;
  device: any | null; // Référence au device BLE connecté (pour envoyer des commandes)

  // Méthodes de connexion
  connect: (device: BluetoothDevice) => Promise<BluetoothConnectionResult>;
  disconnect: () => Promise<void>;
  reconnect: () => Promise<BluetoothConnectionResult | null>;
  clearError: () => void;

  // État Bluetooth système
  checkBluetoothState: () => Promise<void>;

  // Méthodes de communication
  sendCommand: (command: string, serviceUUID?: string, characteristicUUID?: string) => Promise<boolean>;
  sendSetup: () => Promise<boolean>;
  readCharacteristic: (serviceUUID?: string, characteristicUUID?: string) => Promise<string | null>;
  monitorCharacteristic: (onUpdate: (value: BluetoothResponse) => void, serviceUUID?: string, characteristicUUID?: string) => Promise<() => void>;
}

const BluetoothContext = createContext<BluetoothContextValue | undefined>(undefined);

interface BluetoothProviderProps {
  children: React.ReactNode;
}

export function BluetoothProvider({ children }: BluetoothProviderProps) {
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);
  const deviceRef = useRef<any>(null); // Référence au device BLE actuel

  const checkBluetoothState = useCallback(async () => {
    try {
      const available = bteService.isAvailable();
      setIsBluetoothAvailable(available);

      // Ne pas vérifier l'état activé/désactivé au démarrage pour éviter les erreurs natives
      // On vérifiera uniquement lors de la connexion si nécessaire
      // Par défaut, on suppose que le Bluetooth est disponible si le module est disponible
      setIsBluetoothEnabled(available);
    } catch (error) {
      console.debug('Erreur lors de la vérification de l\'état Bluetooth:', error);
      setIsBluetoothAvailable(false);
      setIsBluetoothEnabled(false);
    }
  }, []);

  // Vérifier uniquement si le module est disponible au démarrage (pas l'état activé/désactivé)
  useEffect(() => {
    const available = bteService.isAvailable();
    setIsBluetoothAvailable(available);
    // Ne pas vérifier l'état activé/désactivé au démarrage pour éviter les erreurs natives
    // On vérifiera lors de la connexion
  }, []);

  const disconnect = useCallback(async () => {
    console.log('[BluetoothContext] 🔌 disconnect appelé');
    console.log('[BluetoothContext] 🔌 connectedDevice:', !!connectedDevice);
    console.log('[BluetoothContext] 🔌 deviceRef.current:', !!deviceRef.current);
    
    if (!connectedDevice && !deviceRef.current) {
      console.log('[BluetoothContext] 🔌 Pas de device connecté, skip');
      return;
    }

    // Utiliser directement le deviceRef au lieu de créer un nouveau manager
    const deviceToDisconnect = deviceRef.current;
    
    try {
      if (deviceToDisconnect) {
        console.log('[BluetoothContext] 🔌 Tentative de déconnexion via deviceRef...');
        try {
          // Vérifier si le device est toujours connecté avant de déconnecter
          const isConnected = await deviceToDisconnect.isConnected();
          console.log('[BluetoothContext] 🔌 Device connecté:', isConnected);
          
          if (isConnected) {
            console.log('[BluetoothContext] 🔌 Appel de cancelConnection...');
            await deviceToDisconnect.cancelConnection();
            console.log('[BluetoothContext] 🔌 cancelConnection réussi');
          } else {
            console.log('[BluetoothContext] 🔌 Device déjà déconnecté');
          }
        } catch (cancelError: any) {
          console.debug('[BluetoothContext] 🔌 Erreur cancelConnection (ignorée):', cancelError?.message || String(cancelError));
          // Le device peut déjà être déconnecté, c'est OK
        }
      } else {
        console.log('[BluetoothContext] 🔌 Pas de deviceRef, utilisation de disconnectFromDevice...');
        const deviceId = connectedDevice?.deviceId;
        if (deviceId) {
      await bteService.disconnectFromDevice(deviceId);
        }
      }
    } catch (error: any) {
      console.debug('[BluetoothContext] 🔌 Erreur lors de la déconnexion (ignorée):', error?.message || String(error));
      // Ne pas re-throw - ignorer l'erreur
    } finally {
      console.log('[BluetoothContext] 🔌 Cleanup des refs...');
      try {
      setConnectedDevice(null);
      deviceRef.current = null;
      setConnectionError(null);
        console.log('[BluetoothContext] 🔌 Refs nettoyées');
      } catch (cleanupError: any) {
        console.debug('[BluetoothContext] 🔌 Erreur lors du cleanup (ignorée):', cleanupError?.message || String(cleanupError));
      }
    }
  }, [connectedDevice]);

  const connect = useCallback(
    async (device: BluetoothDevice): Promise<BluetoothConnectionResult> => {
      // Si déjà connecté au même device, ne rien faire
      if (connectedDevice?.deviceId === device.deviceId && deviceRef.current) {
        return { success: true, device: deviceRef.current };
      }

      // Déconnecter l'ancien device si différent
      if (connectedDevice && connectedDevice.deviceId !== device.deviceId) {
        await disconnect();
      }

      setIsConnecting(true);
      setConnectionError(null);

      try {
        // Vérifier que le Bluetooth est disponible
        // Ne pas vérifier isEnabled() car cela cause des erreurs natives
        // L'erreur se produira lors de la tentative de connexion si le Bluetooth n'est pas activé
        if (!bteService.isAvailable()) {
          throw new Error('Bluetooth non disponible');
        }

        // Se connecter au device
        const result = await bteService.connectToDevice(device.deviceId, {
          timeout: 10000,
          autoConnect: false,
        });

        if (result.success && result.device) {
          // Demander un MTU plus grand (247 bytes max standard BLE) pour éviter la fragmentation
          // Note: 512 bytes était trop élevé et causait des problèmes de mémoire sur l'ESP32
          try {
            await result.device.requestMTU(247);
            console.log('MTU négocié: 247 bytes');
          } catch (mtuError) {
            console.debug('Erreur lors de la négociation MTU (non critique):', mtuError);
            // Continuer même si la négociation MTU échoue
          }
          
          setConnectedDevice(device);
          deviceRef.current = result.device;
          setConnectionError(null);
        } else {
          setConnectionError(result.error || 'Échec de la connexion');
          setConnectedDevice(null);
          deviceRef.current = null;
        }

        return result;
      } catch (error: any) {
        const errorMessage = error?.message || 'Erreur de connexion Bluetooth';
        setConnectionError(errorMessage);
        setConnectedDevice(null);
        deviceRef.current = null;
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsConnecting(false);
      }
    },
    [connectedDevice, disconnect]
  );

  // Déconnecter à la fermeture si connecté
  useEffect(() => {
    return () => {
      // Déconnecter à la fermeture si connecté
      const deviceId = connectedDevice?.deviceId;
      if (deviceRef.current && deviceId) {
        bteService.disconnectFromDevice(deviceId);
      }
    };
  }, [connectedDevice?.deviceId]);

  const reconnect = useCallback(async (): Promise<BluetoothConnectionResult | null> => {
    if (!connectedDevice) {
      return null;
    }

    // Déconnecter d'abord
    await disconnect();
    
    // Attendre un court délai
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Reconnecter
    return connect(connectedDevice);
  }, [connectedDevice, disconnect, connect]);

  const clearError = useCallback(() => {
    setConnectionError(null);
  }, []);

  const sendCommand = useCallback(
    async (
      command: string,
      serviceUUID: string = '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
      characteristicUUID: string = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'
    ): Promise<boolean> => {
      // Si on a un device connecté, on peut supposer que le Bluetooth est activé
      // La vérification de l'état peut être problématique, donc on la saute si connecté
      if (!deviceRef.current || !connectedDevice) {
        console.error('Aucun device connecté');
        // Dans ce cas, vérifier l'état du Bluetooth
        await checkBluetoothState();
        if (!isBluetoothAvailable) {
          console.error('Bluetooth non disponible');
          return false;
        }
        if (!isBluetoothEnabled) {
          console.error('Bluetooth non activé');
          return false;
        }
        return false;
      }

      // Si on a un device connecté, on peut tenter d'envoyer la commande
      // même si la vérification d'état échoue (car la connexion fonctionne)

      try {
        const device = deviceRef.current;
        
        // Découvrir les services et caractéristiques si nécessaire
        await device.discoverAllServicesAndCharacteristics();
        
        // Convertir la commande en base64 pour l'envoi
        // react-native-ble-plx attend une chaîne base64
        const base64Value = fromByteArray(
          new TextEncoder().encode(command)
        );
        
        // Envoyer la commande (RX characteristic pour écrire)
        await device.writeCharacteristicWithoutResponseForService(
          serviceUUID,
          characteristicUUID,
          base64Value
        );
        
        console.log('Commande envoyée:', command);
        return true;
      } catch (error: any) {
        console.error('Erreur lors de l\'envoi de la commande:', error);
        return false;
      }
    },
    [connectedDevice, isBluetoothAvailable, isBluetoothEnabled, checkBluetoothState]
  );

  const readCharacteristic = useCallback(
    async (
      serviceUUID: string = '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
      characteristicUUID: string = 'beb5483e-36e1-4688-b7f5-ea07361b26a9'
    ): Promise<string | null> => {
      // Si on a un device connecté, on peut tenter de lire
      // La connexion active est la meilleure preuve que le Bluetooth fonctionne
      if (!deviceRef.current || !connectedDevice) {
        console.error('Aucun device connecté');
        // Dans ce cas, vérifier l'état du Bluetooth
        await checkBluetoothState();
        if (!isBluetoothAvailable) {
          console.error('Bluetooth non disponible');
          return null;
        }
        if (!isBluetoothEnabled) {
          console.error('Bluetooth non activé');
          return null;
        }
        return null;
      }

      // Si on a un device connecté, on peut tenter de lire la caractéristique
      // même si la vérification d'état échoue (car la connexion fonctionne)

      try {
        const device = deviceRef.current;
        
        // Vérifier que le device est toujours connecté
        try {
          const isConnected = await device.isConnected();
          if (!isConnected) {
            console.debug('Device non connecté lors de la lecture');
            return null;
          }
        } catch (connectionCheckError) {
          // Si la vérification de connexion échoue, on continue quand même
          // car cela peut être une erreur temporaire
          console.debug('Erreur lors de la vérification de connexion:', connectionCheckError);
        }
        
        // Découvrir les services et caractéristiques si nécessaire
        await device.discoverAllServicesAndCharacteristics();
        
        // Lire la caractéristique (TX characteristic pour lire)
        const characteristic = await device.readCharacteristicForService(
          serviceUUID,
          characteristicUUID
        );
        
        if (characteristic && characteristic.value) {
          // Décoder la valeur base64
          const bytes = toByteArray(characteristic.value);
          const value = new TextDecoder().decode(bytes);
          return value;
        }
        
        return null;
      } catch (error: any) {
        // Ne pas logger toutes les erreurs "Unknown error" car c'est souvent temporaire
        // Ne pas propager l'erreur pour éviter les crashes - retourner null à la place
        const errorMessage = error?.message || String(error);
        if (!errorMessage.includes('Unknown error')) {
          console.debug('Erreur lors de la lecture de la caractéristique (tentative):', errorMessage);
        }
        // Retourner null au lieu de propager l'erreur pour éviter les crashes
        return null;
      }
    },
    [connectedDevice, isBluetoothAvailable, isBluetoothEnabled, checkBluetoothState]
  );

  const sendSetup = useCallback(async (): Promise<boolean> => {
    return sendCommand('SETUP');
  }, [sendCommand]);

  const monitorCharacteristic = useCallback(
    async (
      onUpdate: (value: BluetoothResponse) => void,
      serviceUUID: string = '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
      characteristicUUID: string = 'beb5483e-36e1-4688-b7f5-ea07361b26a9'
    ): Promise<() => void> => {
      if (!deviceRef.current || !connectedDevice) {
        console.error('Aucun device connecté pour monitorer');
        return () => {}; // Retourner une fonction vide pour unsubscribe
      }
      
      // Note: On ne sauvegarde plus deviceForCleanup car on n'appelle plus remove()

      try {
        const device = deviceRef.current;
        
        // Vérifier que le device est toujours connecté
        try {
          const isConnected = await device.isConnected();
          if (!isConnected) {
            console.error('Device non connecté pour monitorer');
            return () => {};
          }
        } catch (connectionCheckError) {
          console.debug('Erreur lors de la vérification de connexion pour monitoring:', connectionCheckError);
          // Continuer quand même
        }
        
        // Découvrir les services et caractéristiques si nécessaire
        await device.discoverAllServicesAndCharacteristics();
        
        console.log('Démarrage du monitoring de la caractéristique...');
        // Monitorer la caractéristique (TX characteristic pour lire les notifications)
        const subscription = device.monitorCharacteristicForService(
          serviceUUID,
          characteristicUUID,
          (error: any, characteristic: any) => {
            // Vérifier si on est désabonné AVANT de traiter le callback
            if (isUnsubscribed) {
              console.debug('[BluetoothContext] 📡 Callback ignoré (désabonné)');
              return;
            }
            
            console.log('[BluetoothContext] 📡 Callback monitoring appelé');
            console.log('[BluetoothContext] 📡 Error:', error ? (error.message || String(error)) : 'null');
            console.log('[BluetoothContext] 📡 Characteristic:', characteristic ? 'présent' : 'null');
            console.log('[BluetoothContext] 📡 Value:', characteristic?.value ? 'présent' : 'null');
            
            try {
              if (error) {
                const errorMsg = error?.message || String(error);
                console.log('[BluetoothContext] 📡 Erreur détectée:', errorMsg);
                // Ne pas logger les erreurs "Unknown error" qui sont souvent temporaires
                if (!errorMsg.includes('Unknown error')) {
                  console.debug('[BluetoothContext] 📡 Erreur lors du monitoring:', errorMsg);
                }
                return;
              }
              
            if (characteristic && characteristic.value) {
              console.log('[BluetoothContext] 📡 Traitement de la valeur');
              try {
                // Décoder la valeur base64
                console.log('[BluetoothContext] 📡 Décodage base64...');
                const bytes = toByteArray(characteristic.value);
                console.log('[BluetoothContext] 📡 Bytes décodés:', bytes.length, 'bytes');
                const valueString = new TextDecoder().decode(bytes);
                console.log('[BluetoothContext] 📡 Notification reçue (raw):', valueString);
                
                // Parser le JSON automatiquement
                try {
                  console.log('[BluetoothContext] 📡 Parsing JSON...');
                  const parsedValue: BluetoothResponse = JSON.parse(valueString);
                  console.log('[BluetoothContext] 📡 Notification reçue (parsed):', parsedValue);
                  
                  // Appeler onUpdate directement sans setTimeout
                  try {
                    console.log('[BluetoothContext] 📡 Appel de onUpdate...');
                      onUpdate(parsedValue);
                    console.log('[BluetoothContext] 📡 onUpdate appelé avec succès');
                    } catch (updateError) {
                    console.error('[BluetoothContext] 📡 ERREUR dans onUpdate:', updateError);
                    console.error('[BluetoothContext] 📡 Stack:', updateError instanceof Error ? updateError.stack : 'N/A');
                    }
                } catch (parseError) {
                  console.error('[BluetoothContext] 📡 ERREUR lors du parsing JSON:', parseError);
                  console.error('[BluetoothContext] 📡 Stack:', parseError instanceof Error ? parseError.stack : 'N/A');
                  // En cas d'erreur de parsing, ne pas appeler onUpdate
                }
              } catch (decodeError) {
                console.error('[BluetoothContext] 📡 ERREUR lors du décodage de la valeur:', decodeError);
                console.error('[BluetoothContext] 📡 Stack:', decodeError instanceof Error ? decodeError.stack : 'N/A');
              }
            } else {
              console.log('[BluetoothContext] 📡 Pas de valeur à traiter');
            }
            } catch (callbackError) {
              // Protéger le callback contre les crashes
              console.error('[BluetoothContext] 📡 ERREUR CRITIQUE dans le callback de monitoring:', callbackError);
              console.error('[BluetoothContext] 📡 Stack:', callbackError instanceof Error ? callbackError.stack : 'N/A');
            }
            console.log('[BluetoothContext] 📡 Callback monitoring terminé');
          }
        );

        console.log('[BluetoothContext] Monitoring démarré avec succès');
        
        // Flag pour ignorer les callbacks futurs
        let isUnsubscribed = false;
        
        // Retourner la fonction pour se désabonner
        return () => {
          console.log('[BluetoothContext] 🛑 Fonction unsubscribe appelée');
          
          // Marquer comme désabonné IMMÉDIATEMENT pour ignorer les callbacks futurs
          isUnsubscribed = true;
          
          // Protection MAXIMALE - ne jamais laisser une erreur remonter
          try {
            console.log('[BluetoothContext] 🛑 Vérification subscription:', !!subscription);
            
            if (!subscription) {
              console.log('[BluetoothContext] 🛑 Pas de subscription à arrêter');
              return;
            }
            
            // NE JAMAIS appeler remove() directement - ça peut crasher au niveau natif
            // La bibliothèque gère automatiquement le cleanup quand le device est déconnecté
            // On marque juste comme désabonné et on laisse le garbage collector faire le travail
            
            console.log('[BluetoothContext] 🛑 Subscription marquée comme désabonnée (remove() non appelé pour éviter crash)');
            
            // Optionnel : essayer remove() seulement si on est SÛR que le device est connecté
            // Mais même dans ce cas, c'est risqué car la connexion peut se fermer entre-temps
            // Donc on ne fait RIEN - la bibliothèque gère le cleanup automatiquement
            
          } catch (outerError: any) {
            // Protection ultime - ne jamais laisser une erreur remonter
            console.debug('[BluetoothContext] 🛑 Erreur externe unsubscribe (ignorée):', outerError?.message || String(outerError));
          }
          
          console.log('[BluetoothContext] 🛑 Fonction unsubscribe terminée');
        };
      } catch (error: any) {
        console.error('Erreur lors du démarrage du monitoring:', error);
        return () => {}; // Retourner une fonction vide pour unsubscribe
      }
    },
    [connectedDevice]
  );

  const value: BluetoothContextValue = {
    // État
    connectedDevice,
    isConnecting,
    isConnected: connectedDevice !== null && deviceRef.current !== null,
    connectionError,
    isBluetoothEnabled,
    isBluetoothAvailable,
    device: deviceRef.current,

    // Méthodes de connexion
    connect,
    disconnect,
    reconnect,
    clearError,
    checkBluetoothState,

    // Méthodes de communication
    sendCommand,
    sendSetup,
    readCharacteristic,
    monitorCharacteristic,
  };

  return <BluetoothContext.Provider value={value}>{children}</BluetoothContext.Provider>;
}

/**
 * Hook pour accéder au context Bluetooth
 * @throws {Error} Si utilisé en dehors d'un BluetoothProvider
 */
export function useBluetooth() {
  const context = useContext(BluetoothContext);
  if (context === undefined) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
}
