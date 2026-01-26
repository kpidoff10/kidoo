/**
 * Utilitaires BLE
 * Fonctions réutilisables pour les commandes BLE
 */

import { Device, Characteristic, BleManager } from 'react-native-ble-plx';
import { BLE_SERVICE_UUID, BLE_CHARACTERISTIC_RX_UUID, BLE_CHARACTERISTIC_TX_UUID } from '../constants';
import { encodeBase64, decodeBase64 } from '@/utils/base64';

/**
 * Résultat de la recherche de caractéristique BLE
 */
export interface BLECharacteristicResult {
  success: boolean;
  characteristic?: Characteristic;
  message?: string;
}

/**
 * Résultat de l'envoi d'une commande BLE avec réponse
 */
export interface BLESendCommandResult {
  success: boolean;
  message?: string;
  data?: {
    success: boolean;
    message?: string;
    wifiConnected?: boolean;
    deviceId?: string;
    brightness?: number; // Brightness en pourcentage (0-100)
    sleepTimeout?: number; // Sleep timeout en millisecondes
    firmwareVersion?: string; // Version du firmware ESP32
    macAddress?: string; // Adresse MAC WiFi renvoyée par l'ESP32
  };
}

/**
 * Trouve et retourne la caractéristique RX pour l'envoi de commandes
 * 
 * @param device Device BLE connecté
 * @returns Résultat avec la caractéristique RX ou un message d'erreur
 * 
 * @example
 * ```ts
 * const result = await getRXCharacteristic(device);
 * if (result.success && result.characteristic) {
 *   await result.characteristic.writeWithResponse(data);
 * }
 * ```
 */
export async function getRXCharacteristic(
  device: Device
): Promise<BLECharacteristicResult> {
  try {
    // S'assurer que les services sont découverts
    await device.discoverAllServicesAndCharacteristics();

    // Trouver le service
    const services = await device.services();
    console.log('[BLE-UTILS] Services trouvés:', services.map(s => s.uuid));
    
    const targetService = services.find((s) => {
      const serviceUuid = s.uuid.toLowerCase().replace(/-/g, '');
      const targetUuid = BLE_SERVICE_UUID.toLowerCase().replace(/-/g, '');
      return serviceUuid === targetUuid;
    });

    if (!targetService) {
      console.error('[BLE-UTILS] Service non trouvé. UUID attendu:', BLE_SERVICE_UUID);
      return {
        success: false,
        message: 'Service BLE non trouvé',
      };
    }

    // Trouver la caractéristique RX
    const characteristics = await targetService.characteristics();
    console.log('[BLE-UTILS] Caractéristiques trouvées:', characteristics.map(c => c.uuid));
    
    const rxCharacteristic = characteristics.find((c) => {
      const charUuid = c.uuid.toLowerCase().replace(/-/g, '');
      const targetUuid = BLE_CHARACTERISTIC_RX_UUID.toLowerCase().replace(/-/g, '');
      return charUuid === targetUuid;
    });

    if (!rxCharacteristic) {
      console.error('[BLE-UTILS] Caractéristique RX non trouvée. UUID attendu:', BLE_CHARACTERISTIC_RX_UUID);
      return {
        success: false,
        message: 'Caractéristique RX non trouvée',
      };
    }

    return {
      success: true,
      characteristic: rxCharacteristic,
    };
  } catch (error: any) {
    console.error('[BLE-UTILS] Erreur lors de la recherche de la caractéristique RX:', error);
    return {
      success: false,
      message: error?.message || error?.reason || 'Erreur lors de la recherche de la caractéristique',
    };
  }
}

/**
 * Trouve et retourne la caractéristique TX pour la réception de notifications
 * 
 * @param device Device BLE connecté
 * @returns Résultat avec la caractéristique TX ou un message d'erreur
 */
export async function getTXCharacteristic(
  device: Device
): Promise<BLECharacteristicResult> {
  try {
    // S'assurer que les services sont découverts
    await device.discoverAllServicesAndCharacteristics();

    // Trouver le service
    const services = await device.services();
    
    const targetService = services.find((s) => {
      const serviceUuid = s.uuid.toLowerCase().replace(/-/g, '');
      const targetUuid = BLE_SERVICE_UUID.toLowerCase().replace(/-/g, '');
      return serviceUuid === targetUuid;
    });

    if (!targetService) {
      return {
        success: false,
        message: 'Service BLE non trouvé',
      };
    }

    // Trouver la caractéristique TX
    const characteristics = await targetService.characteristics();
    
    const txCharacteristic = characteristics.find((c) => {
      const charUuid = c.uuid.toLowerCase().replace(/-/g, '');
      const targetUuid = BLE_CHARACTERISTIC_TX_UUID.toLowerCase().replace(/-/g, '');
      return charUuid === targetUuid;
    });

    if (!txCharacteristic) {
      return {
        success: false,
        message: 'Caractéristique TX non trouvée',
      };
    }

    return {
      success: true,
      characteristic: txCharacteristic,
    };
  } catch (error: any) {
    console.error('[BLE-UTILS] Erreur lors de la recherche de la caractéristique TX:', error);
    return {
      success: false,
      message: error?.message || error?.reason || 'Erreur lors de la recherche de la caractéristique',
    };
  }
}

/**
 * Envoie une commande BLE au device et attend la réponse
 * Gère automatiquement la conversion JSON, l'encodage base64, l'envoi et l'écoute de la réponse
 * 
 * @param device Device BLE connecté
 * @param command Objet de commande à envoyer (sera converti en JSON)
 * @param commandName Nom de la commande pour les logs (optionnel)
 * @param timeoutMs Timeout en millisecondes pour attendre la réponse (défaut: 30000ms = 30s)
 * @returns Résultat de l'envoi de la commande avec la réponse du device
 * 
 * @example
 * ```ts
 * const result = await sendBLECommand(device, {
 *   command: 'setup',
 *   ssid: 'MyWiFi',
 *   password: 'password123'
 * }, 'setup', 30000);
 * 
 * if (result.success && result.data) {
 *   console.log('Réponse:', result.data);
 * }
 * ```
 */
export async function sendBLECommand(
  device: Device,
  command: Record<string, unknown>,
  commandName?: string,
  timeoutMs: number = 30000
): Promise<BLESendCommandResult> {
  const logPrefix = commandName ? `[BLE-${commandName.toUpperCase()}]` : '[BLE-COMMAND]';
  let txSubscription: any = null;
  let transactionId: string | null = null;

  try {
    // Vérifier que le device est toujours connecté avant d'essayer d'envoyer une commande
    // Cela évite les crashes quand la connexion est perdue pendant l'envoi
    try {
      const isConnected = await device.isConnected();
      if (!isConnected) {
        console.warn(`${logPrefix} Device non connecté, impossible d'envoyer la commande`);
        return {
          success: false,
          message: 'Device non connecté',
        };
      }
    } catch (checkError: any) {
      // Si on ne peut pas vérifier la connexion, c'est probablement que le device est déconnecté
      // ou que la bibliothèque est en train de nettoyer (ce qui cause le crash)
      console.warn(`${logPrefix} Impossible de vérifier la connexion (device probablement déconnecté):`, checkError?.message);
      return {
        success: false,
        message: 'Device déconnecté ou inaccessible',
      };
    }

    // Construire la commande JSON
    const commandString = JSON.stringify(command);
    console.log(`${logPrefix} Commande JSON:`, commandString);

    // Obtenir les caractéristiques RX et TX
    const rxResult = await getRXCharacteristic(device);
    const txResult = await getTXCharacteristic(device);
    
    if (!rxResult.success || !rxResult.characteristic) {
      return {
        success: false,
        message: rxResult.message || 'Impossible de trouver la caractéristique RX',
      };
    }

    if (!txResult.success || !txResult.characteristic) {
      return {
        success: false,
        message: txResult.message || 'Impossible de trouver la caractéristique TX',
      };
    }

    // Créer une promesse pour attendre la réponse
    const responsePromise = new Promise<BLESendCommandResult>((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | null = null;
      let resolved = false;
      let subscriptionCleaned = false;
      let lastProcessedValue: string | null = null; // Pour éviter de traiter la même réponse plusieurs fois

      // Fonction helper pour nettoyer l'abonnement une seule fois
      // IMPORTANT: Bug connu dans react-native-ble-plx - SafePromise.reject avec null
      // Le crash se produit quand on nettoie l'abonnement pendant qu'une déconnexion
      // est en cours. Solution: ne pas nettoyer du tout et laisser la bibliothèque gérer.
      // La bibliothèque nettoie automatiquement quand le device se déconnecte.
      const cleanupSubscription = () => {
        if (!subscriptionCleaned) {
          subscriptionCleaned = true;
          // NE PAS NETTOYER - Laisser la bibliothèque gérer le cycle de vie automatiquement
          // Le nettoyage manuel cause des crashes avec SafePromise sur Android
          // La subscription sera automatiquement nettoyée quand:
          // 1. Le device se déconnecte
          // 2. La bibliothèque détecte que le callback n'est plus utilisé
          // 
          // Si on doit vraiment nettoyer (par exemple pour libérer des ressources),
          // il faut le faire APRÈS un délai très long et avec beaucoup de précaution
          // Mais dans notre cas, on préfère laisser la bibliothèque gérer
          console.log(`${logPrefix} Abonnement laissé actif (nettoyage automatique par la bibliothèque)`);
        }
      };

      // Timeout
      timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.warn(`${logPrefix} Timeout en attente de la réponse (${timeoutMs}ms)`);
          // Résoudre d'abord, puis nettoyer après
          resolve({
            success: false,
            message: `Timeout: aucune réponse reçue dans les ${timeoutMs}ms`,
          });
          // Nettoyer après un court délai
          setTimeout(() => cleanupSubscription(), 100);
        }
      }, timeoutMs);

      // Écouter les notifications TX
      // Note: Ne pas utiliser requestTransaction/cancelTransaction car cela peut causer des crashes
      // La bibliothèque gère automatiquement les transactions pour monitor()
      txSubscription = txResult.characteristic!.monitor((error, characteristic) => {
        if (error) {
          if (!resolved) {
            resolved = true;
            if (timeoutId) clearTimeout(timeoutId);
            
            // Vérifier si c'est une erreur de déconnexion
            // Ces erreurs sont normales et ne doivent pas être traitées comme des erreurs critiques
            const isDisconnectionError = 
              error?.message?.includes('disconnected') ||
              error?.message?.includes('connection') ||
              error?.reason === 'DeviceDisconnected' ||
              String(error?.errorCode) === 'DeviceDisconnected';
            
            if (isDisconnectionError) {
              console.log(`${logPrefix} Device déconnecté pendant l'écoute (normal)`);
              // Résoudre avec une erreur de déconnexion plutôt que de rejeter
              // Cela évite les crashes dans les promesses
              resolve({
                success: false,
                message: 'Device déconnecté',
              });
            } else {
              console.error(`${logPrefix} Erreur lors de l'écoute des notifications:`, error);
              // Rejeter seulement pour les erreurs non liées à la déconnexion
              reject(error);
            }
            
            // Ne pas nettoyer l'abonnement - la bibliothèque le fera automatiquement
            // Le nettoyage manuel cause des crashes avec SafePromise sur Android
          }
          return;
        }

        if (!characteristic?.value) {
          return;
        }

        try {
          // Décoder la réponse base64
          const base64Value = characteristic.value;
          
          // Éviter de traiter la même réponse plusieurs fois
          if (lastProcessedValue === base64Value) {
            console.log(`${logPrefix} Réponse déjà traitée, ignorée`);
            return;
          }
          
          console.log(`${logPrefix} Réponse reçue (base64):`, base64Value);
          
          // Décoder base64 vers string
          let decodedValue = decodeBase64(base64Value);
          
          // Nettoyer la chaîne : supprimer les caractères nuls, espaces en début/fin, et caractères non imprimables
          decodedValue = decodedValue
            .replace(/\0/g, '') // Supprimer les caractères nuls
            .trim() // Supprimer les espaces en début/fin
            .replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Supprimer les caractères de contrôle
          
          console.log(`${logPrefix} Réponse décodée (nettoyée):`, decodedValue);
          console.log(`${logPrefix} Longueur de la réponse:`, decodedValue.length);

          // Vérifier que la chaîne n'est pas vide
          if (!decodedValue || decodedValue.length === 0) {
            console.warn(`${logPrefix} Réponse vide après nettoyage, ignorée`);
            return;
          }

          // Extraire uniquement le JSON valide (en cas de caractères supplémentaires)
          // Chercher le premier { et le dernier } pour extraire le JSON
          const firstBrace = decodedValue.indexOf('{');
          const lastBrace = decodedValue.lastIndexOf('}');
          
          if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
            console.error(`${logPrefix} Format JSON invalide: pas de braces trouvées`);
            return;
          }
          
          const jsonString = decodedValue.substring(firstBrace, lastBrace + 1);
          console.log(`${logPrefix} JSON extrait:`, jsonString);

          // Parser le JSON
          const responseData = JSON.parse(jsonString);
          console.log(`${logPrefix} Réponse parsée:`, responseData);
          
          // Marquer cette valeur comme traitée
          lastProcessedValue = base64Value;

          if (!resolved) {
            resolved = true;
            if (timeoutId) clearTimeout(timeoutId);
            
            // Extraire les informations de la réponse
            const success = responseData.success === true;
            const message = responseData.message || '';
            
            // Pour la commande setup, vérifier si WiFi est connecté
            const wifiConnected = responseData.wifiConnected === true;
            
            // Extraire le deviceId si présent (renvoyé par l'ESP32 lors de la commande setup)
            const deviceId = responseData.deviceId || undefined;
            
            // Extraire brightness, sleepTimeout et firmwareVersion si présents
            const brightness = responseData.brightness !== undefined ? responseData.brightness : undefined;
            const sleepTimeout = responseData.sleepTimeout !== undefined ? responseData.sleepTimeout : undefined;
            const firmwareVersion = responseData.firmwareVersion || undefined;
            const macAddress = responseData.macAddress || undefined;

            // Résoudre d'abord, puis nettoyer après un délai
            resolve({
              success: success,
              message: message,
              data: responseData,
            });
            
            // Nettoyer après un court délai pour laisser la promesse se résoudre complètement
            setTimeout(() => cleanupSubscription(), 100);
          }
        } catch (parseError) {
          console.error(`${logPrefix} Erreur lors du parsing de la réponse:`, parseError);
          // Ne pas rejeter, continuer à attendre d'autres notifications
        }
      });
    });

    // Convertir la string en base64 pour l'envoi BLE
    const base64Command = encodeBase64(commandString);
    console.log(`${logPrefix} Envoi de la commande (base64):`, base64Command);

    // Envoyer la commande
    await rxResult.characteristic.writeWithResponse(base64Command);
    console.log(`${logPrefix} Commande envoyée, attente de la réponse...`);

    // Attendre la réponse
    const result = await responsePromise;
    
    // L'abonnement est déjà nettoyé dans la promesse via cleanupSubscription()
    // Ne pas nettoyer à nouveau ici pour éviter les doubles nettoyages qui causent le crash

    return result;
  } catch (error: any) {
    console.error(`${logPrefix} Erreur lors de l'envoi de la commande:`, error);
    console.error(`${logPrefix} Détails de l'erreur:`, {
      message: error?.message,
      reason: error?.reason,
      errorCode: error?.errorCode,
      attErrorCode: error?.attErrorCode,
    });

    // IMPORTANT: NE PAS nettoyer l'abonnement manuellement en cas d'erreur
    // Cela cause un crash (NullPointerException) dans react-native-ble-plx
    // quand la connexion est perdue, car la bibliothèque nettoie déjà automatiquement
    // Le nettoyage manuel interfère avec le nettoyage automatique et cause le crash
    // La bibliothèque gère automatiquement le cycle de vie des abonnements

    return {
      success: false,
      message: error?.message || error?.reason || 'Erreur inconnue',
    };
  }
}
