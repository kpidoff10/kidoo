/**
 * NFC Manager
 * Gestion centralisée de toutes les opérations NFC
 * - Conversion UUID <-> bytes
 * - Écriture sur tags NFC via BLE
 * - Lecture de tags NFC via BLE
 * - Intégration avec la base de données (création/mise à jour de tags)
 */

import { bleManager } from './bleManager';
import { createTag, updateTag } from './tagService';
import type { BluetoothResponse } from '@/types/bluetooth';

export interface NFCWriteResult {
  success: boolean;
  tagId?: string; // UUID du tag créé dans la DB
  uid?: string; // UID physique du tag NFC
  error?: string;
}

export interface NFCReadResult {
  success: boolean;
  tagId?: string; // UUID lu depuis le tag NFC
  uid?: string; // UID physique du tag NFC
  error?: string;
}

/**
 * Convertir un UUID string en tableau de bytes (16 bytes pour un bloc NFC)
 */
export function uuidToBytes(uuid: string): number[] {
  // Enlever les tirets et prendre les 32 premiers caractères hex
  const hexString = uuid.replace(/-/g, '').substring(0, 32);
  const bytes: number[] = [];
  for (let i = 0; i < 16 && i * 2 < hexString.length; i++) {
    const hexByte = hexString.substring(i * 2, i * 2 + 2);
    bytes.push(parseInt(hexByte, 16));
  }
  // Remplir avec des zéros si nécessaire
  while (bytes.length < 16) {
    bytes.push(0);
  }
  return bytes;
}

/**
 * Convertir un tableau de bytes (16 bytes) en UUID string avec tirets
 * Format UUID v4: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */
export function bytesToUuid(bytes: number[]): string {
  if (bytes.length < 16) {
    throw new Error('Le tableau doit contenir au moins 16 bytes');
  }
  
  // Convertir chaque byte en hex (2 caractères)
  const hexParts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const hex = bytes[i].toString(16).padStart(2, '0');
    hexParts.push(hex);
  }
  
  // Reconstruire l'UUID avec les tirets aux bonnes positions
  // Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const hexString = hexParts.join('');
  return `${hexString.substring(0, 8)}-${hexString.substring(8, 12)}-${hexString.substring(12, 16)}-${hexString.substring(16, 20)}-${hexString.substring(20, 32)}`;
}

class NFCManagerClass {
  private stopMonitoringFn: (() => void) | null = null;

  /**
   * Vérifier si le BLE est connecté (prérequis pour les opérations NFC)
   */
  isAvailable(): boolean {
    return bleManager.isConnected();
  }

  /**
   * Écrire un tag NFC avec création automatique dans la DB
   * Workflow :
   * 1. Créer le tag dans la DB (obtenir l'UUID)
   * 2. Écrire l'UUID sur le tag NFC via BLE
   * 3. Mettre à jour le tag dans la DB avec l'UID physique si fourni par l'ESP32
   * 
   * @param kidooId - ID du Kidoo
   * @param userId - ID de l'utilisateur
   * @param blockNumber - Numéro du bloc NFC à écrire (défaut: 4)
   * @param onProgress - Callback pour suivre la progression
   * @returns Résultat de l'opération
   */
  async writeTag(
    kidooId: string,
    userId: string,
    blockNumber: number = 4,
    onProgress?: (state: 'creating' | 'writing' | 'updating' | 'written' | 'error', message?: string) => void
  ): Promise<NFCWriteResult> {
    if (!this.isAvailable()) {
      const error = 'Le Kidoo n\'est pas connecté';
      onProgress?.('error', error);
      return { success: false, error };
    }

    try {
      // Étape 1: Créer le tag dans la DB
      onProgress?.('creating', 'Création du tag dans la base de données...');
      const createResult = await createTag(
        {
          kidooId,
          uid: 'TEMP_UID', // UID temporaire, sera remplacé après écriture
        },
        userId
      );

      if (!createResult.success) {
        const error = createResult.error || 'Erreur lors de la création du tag';
        onProgress?.('error', error);
        return { success: false, error };
      }

      const tagId = createResult.data.id;
      console.log('[NFCManager] Tag créé dans la DB avec id:', tagId);

      // Étape 2: Écrire l'UUID sur le tag NFC
      const writeResult = await this.writeTagIdToNFC(tagId, blockNumber, onProgress);

      if (!writeResult.success) {
        onProgress?.('error', writeResult.error);
        return writeResult;
      }

      // Étape 3: Mettre à jour le tag dans la DB avec l'UID physique si fourni
      if (writeResult.uid && writeResult.uid !== 'TEMP_UID') {
        onProgress?.('updating', 'Mise à jour du tag avec l\'UID physique...');
        try {
          const updateResult = await updateTag(tagId, { uid: writeResult.uid }, userId);
          if (updateResult.success) {
            console.log('[NFCManager] Tag mis à jour avec UID:', writeResult.uid);
          } else {
            console.error('[NFCManager] Erreur mise à jour tag:', updateResult.error);
            // On continue même si la mise à jour échoue
          }
        } catch (err) {
          console.error('[NFCManager] Exception lors de la mise à jour tag:', err);
          // On continue même si la mise à jour échoue
        }
      }

      onProgress?.('written', 'Tag écrit avec succès');
      return {
        success: true,
        tagId,
        uid: writeResult.uid,
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erreur lors de l\'écriture du tag NFC';
      console.error('[NFCManager] Erreur écriture tag:', err);
      onProgress?.('error', error);
      return { success: false, error };
    }
  }

  /**
   * Écrire un UUID sur un tag NFC via BLE
   * @param tagId - UUID à écrire sur le tag
   * @param blockNumber - Numéro du bloc NFC à écrire (défaut: 4)
   * @param onProgress - Callback pour suivre la progression
   * @returns Résultat avec l'UID physique si fourni par l'ESP32
   */
  private async writeTagIdToNFC(
    tagId: string,
    blockNumber: number = 4,
    onProgress?: (state: 'creating' | 'writing' | 'updating' | 'written' | 'error', message?: string) => void
  ): Promise<NFCWriteResult> {
    return new Promise((resolve) => {
      let isResolved = false; // Flag pour éviter les résolutions multiples
      let timeoutId: NodeJS.Timeout | null = null;

      // Fonction helper pour résoudre la Promise de manière sécurisée
      const safeResolve = (result: NFCWriteResult) => {
        if (isResolved) return;
        isResolved = true;
        
        // Annuler le timeout si présent
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        resolve(result);
      };

      // Arrêter le monitoring existant s'il y en a un
      if (this.stopMonitoringFn) {
        console.log('[NFCManager] Arrêt du monitoring existant');
        this.stopMonitoringFn();
        this.stopMonitoringFn = null;
      }
      bleManager.stopMonitoring();

      // Attendre un peu que le monitoring soit bien arrêté
      setTimeout(async () => {
        try {
          // Convertir le tagId UUID en bytes
          const tagIdBytes = uuidToBytes(tagId);

          // Démarrer le monitoring pour l'écriture
          console.log('[NFCManager] Démarrage du monitoring pour NFC_TAG_WRITTEN');
          onProgress?.('writing', 'Écriture sur le tag NFC...');

          this.stopMonitoringFn = await bleManager.startMonitoring(async (response: BluetoothResponse) => {
            console.log('[NFCManager] Réponse reçue:', JSON.stringify(response));
            const { status, message, uid } = response;

            if (status === 'success' && message === 'NFC_TAG_WRITTEN') {
              console.log('[NFCManager] Tag écrit avec succès, UID:', uid);
              
              // Annuler le timeout car on a reçu la réponse
              if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
              }
              
              // Arrêter le monitoring
              if (this.stopMonitoringFn) {
                this.stopMonitoringFn();
                this.stopMonitoringFn = null;
              }

              safeResolve({
                success: true,
                tagId,
                uid: uid || undefined,
              });
            } else if (status === 'error' && message === 'NFC_WRITE_ERROR') {
              console.error('[NFCManager] Erreur écriture NFC:', response.error);
              console.error('[NFCManager] Détails de la réponse:', JSON.stringify(response));
              
              // Annuler le timeout car on a reçu la réponse (même si c'est une erreur)
              if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
              }
              
              // Arrêter le monitoring
              if (this.stopMonitoringFn) {
                this.stopMonitoringFn();
                this.stopMonitoringFn = null;
              }

              // Construire un message d'erreur plus détaillé
              let errorMessage = response.error || 'Erreur lors de l\'écriture sur le tag';
              
              // Ajouter des suggestions selon le type d'erreur
              if (errorMessage.includes('authentification') || errorMessage.includes('auth')) {
                errorMessage += '. Vérifiez que le tag NFC est bien approché et qu\'il n\'est pas en lecture seule.';
              } else if (errorMessage.includes('timeout') || errorMessage.includes('délai')) {
                errorMessage += '. Le tag NFC n\'a pas été détecté. Approchez-le du Kidoo.';
              } else if (errorMessage.includes('bloc') || errorMessage.includes('block')) {
                errorMessage += '. Le bloc NFC ne peut pas être écrit. Vérifiez que le tag n\'est pas protégé.';
              }

              safeResolve({
                success: false,
                error: errorMessage,
              });
            } else {
              console.log('[NFCManager] Réponse non traitée:', { status, message, uid, fullResponse: JSON.stringify(response) });
            }
          });

          // Attendre un peu que le monitoring soit prêt
          await new Promise((resolveDelay) => setTimeout(resolveDelay, 200));

          // Envoyer la commande WRITE_NFC_TAG
          const commandJson = JSON.stringify({
            command: 'WRITE_NFC_TAG',
            blockNumber,
            data: tagIdBytes,
          });

          console.log('[NFCManager] Envoi de la commande WRITE_NFC_TAG avec id:', tagId);
          const success = await bleManager.sendCommand(commandJson);

          if (!success) {
            // Arrêter le monitoring
            if (this.stopMonitoringFn) {
              this.stopMonitoringFn();
              this.stopMonitoringFn = null;
            }

            safeResolve({
              success: false,
              error: 'Erreur lors de l\'envoi de la commande',
            });
            return;
          }

          // Définir un timeout de 15 secondes (15000ms) pour la réponse
          timeoutId = setTimeout(() => {
            if (!isResolved) {
              console.error('[NFCManager] Timeout: Aucune réponse reçue après 15 secondes');
              
              // Arrêter le monitoring
              if (this.stopMonitoringFn) {
                this.stopMonitoringFn();
                this.stopMonitoringFn = null;
              }

              safeResolve({
                success: false,
                error: 'Timeout: Aucun tag NFC détecté après 15 secondes. Approchez le tag du Kidoo et réessayez.',
              });
            }
          }, 15000); // 15 secondes
        } catch (err) {
          console.error('[NFCManager] Erreur écriture NFC:', err);
          
          // Arrêter le monitoring
          if (this.stopMonitoringFn) {
            this.stopMonitoringFn();
            this.stopMonitoringFn = null;
          }

          safeResolve({
            success: false,
            error: err instanceof Error ? err.message : 'Erreur lors de l\'écriture sur le tag',
          });
        }
      }, 100);
    });
  }

  /**
   * Lire un tag NFC via BLE
   * @param blockNumber - Numéro du bloc NFC à lire (défaut: 4)
   * @param onProgress - Callback pour suivre la progression
   * @returns UUID lu depuis le tag et UID physique
   */
  async readTag(
    blockNumber: number = 4,
    onProgress?: (state: 'reading' | 'read' | 'error', message?: string) => void
  ): Promise<NFCReadResult> {
    if (!this.isAvailable()) {
      const error = 'Le Kidoo n\'est pas connecté';
      onProgress?.('error', error);
      return { success: false, error };
    }

    return new Promise((resolve) => {
      // Arrêter le monitoring existant s'il y en a un
      if (this.stopMonitoringFn) {
        this.stopMonitoringFn();
        this.stopMonitoringFn = null;
      }
      bleManager.stopMonitoring();

      // Attendre un peu que le monitoring soit bien arrêté
      setTimeout(async () => {
        try {
          onProgress?.('reading', 'Lecture du tag NFC...');

          this.stopMonitoringFn = await bleManager.startMonitoring((response: BluetoothResponse) => {
            console.log('[NFCManager] Réponse reçue:', JSON.stringify(response));
            const { status, message, uid, data } = response;

            if (status === 'success' && message === 'NFC_TAG_READ') {
              console.log('[NFCManager] Tag lu avec succès, UID:', uid);
              
              // Arrêter le monitoring
              if (this.stopMonitoringFn) {
                this.stopMonitoringFn();
                this.stopMonitoringFn = null;
              }

              // Convertir les bytes en UUID
              let tagId: string | undefined;
              if (data && Array.isArray(data) && data.length >= 16) {
                try {
                  tagId = bytesToUuid(data);
                } catch (err) {
                  console.error('[NFCManager] Erreur conversion bytes vers UUID:', err);
                }
              }

              onProgress?.('read', 'Tag lu avec succès');
              resolve({
                success: true,
                tagId,
                uid: uid || undefined,
              });
            } else if (status === 'error' && message === 'NFC_READ_ERROR') {
              console.log('[NFCManager] Erreur lecture NFC:', response.error);
              
              // Arrêter le monitoring
              if (this.stopMonitoringFn) {
                this.stopMonitoringFn();
                this.stopMonitoringFn = null;
              }

              resolve({
                success: false,
                error: response.error || 'Erreur lors de la lecture du tag',
              });
            } else {
              console.log('[NFCManager] Réponse non traitée:', { status, message, uid });
            }
          });

          // Attendre un peu que le monitoring soit prêt
          await new Promise((resolveDelay) => setTimeout(resolveDelay, 200));

          // Envoyer la commande READ_NFC_TAG
          const commandJson = JSON.stringify({
            command: 'READ_NFC_TAG',
            blockNumber,
          });

          console.log('[NFCManager] Envoi de la commande READ_NFC_TAG');
          const success = await bleManager.sendCommand(commandJson);

          if (!success) {
            // Arrêter le monitoring
            if (this.stopMonitoringFn) {
              this.stopMonitoringFn();
              this.stopMonitoringFn = null;
            }

            resolve({
              success: false,
              error: 'Erreur lors de l\'envoi de la commande',
            });
          }
        } catch (err) {
          console.error('[NFCManager] Erreur lecture NFC:', err);
          
          // Arrêter le monitoring
          if (this.stopMonitoringFn) {
            this.stopMonitoringFn();
            this.stopMonitoringFn = null;
          }

          resolve({
            success: false,
            error: err instanceof Error ? err.message : 'Erreur lors de la lecture du tag',
          });
        }
      }, 100);
    });
  }

  /**
   * Arrêter le monitoring NFC en cours
   */
  stopMonitoring(): void {
    if (this.stopMonitoringFn) {
      this.stopMonitoringFn();
      this.stopMonitoringFn = null;
    }
    bleManager.stopMonitoring();
  }

  /**
   * Nettoyer toutes les ressources
   */
  cleanup(): void {
    this.stopMonitoring();
  }
}

// Export d'une instance singleton
export const nfcManager = new NFCManagerClass();
