/**
 * NFC Manager
 * Gestion centralisée de toutes les opérations NFC
 * - Conversion UUID <-> bytes
 * - Écriture sur tags NFC via BLE
 * - Lecture de tags NFC via BLE
 * - Intégration avec la base de données (création/mise à jour de tags)
 */

import { bleManager } from './bte';
import { createTag, updateTag } from './tagService';

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
  private timeoutId: ReturnType<typeof setTimeout> | null = null; // Timeout pour les opérations NFC en cours

  /**
   * Vérifier si le BLE est connecté (prérequis pour les opérations NFC)
   */
  isAvailable(): boolean {
    return bleManager.isConnected();
  }

  /**
   * Générer un UUID v4
   */
  private generateUUID(): string {
    // Utiliser crypto.randomUUID() si disponible (React Native 0.71+)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback pour les versions plus anciennes
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Écrire un tag NFC avec création automatique dans la DB
   * Workflow :
   * 1. Générer l'UUID côté app
   * 2. Écrire l'UUID sur le tag NFC via BLE
   * 3. Une fois que l'ESP confirme le succès, créer le tag dans la DB avec le tagId et l'UID
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
      // Étape 1: Générer l'UUID côté app
      const tagId = this.generateUUID();
      console.log('[NFCManager] UUID généré:', tagId);

      // Étape 2: Écrire l'UUID sur le tag NFC
      onProgress?.('writing', 'Écriture sur le tag NFC...');
      const writeResult = await this.writeTagIdToNFC(tagId, blockNumber, onProgress);

      if (!writeResult.success) {
        onProgress?.('error', writeResult.error);
        return writeResult;
      }

      // Étape 3: Créer le tag dans la DB seulement après confirmation de l'ESP
      onProgress?.('creating', 'Création du tag dans la base de données...');
      const createResult = await createTag(
        {
          tagId, // UUID généré par l'app et écrit sur le tag NFC
          kidooId,
          // Pas d'UID à la création, il sera mis à jour après si fourni
        },
        userId
      );

      if (!createResult.success) {
        const error = createResult.error || 'Erreur lors de la création du tag';
        onProgress?.('error', error);
        return { success: false, error };
      }

      const createdTagId = createResult.data.id;
      console.log('[NFCManager] Tag créé dans la DB avec id:', createdTagId);

      // Étape 4: Mettre à jour le tag dans la DB avec l'UID physique si fourni
      if (writeResult.uid) {
        onProgress?.('updating', 'Mise à jour du tag avec l\'UID physique...');
        try {
          const updateResult = await updateTag(createdTagId, { uid: writeResult.uid }, userId);
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
        tagId: createdTagId, // Retourner l'id de la DB (pas le tagId)
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
   * @param tagId - UUID généré par l'app à écrire sur le tag NFC
   * @param blockNumber - Numéro du bloc NFC à écrire (défaut: 4)
   * @param onProgress - Callback pour suivre la progression
   * @returns Résultat avec l'UID physique si fourni par l'ESP32
   */
  private async writeTagIdToNFC(
    tagId: string,
    blockNumber: number = 4,
    onProgress?: (state: 'creating' | 'writing' | 'updating' | 'written' | 'error', message?: string) => void
  ): Promise<NFCWriteResult> {
    // Nettoyer le timeout précédent s'il existe
    this.clearTimeout();

    // Vérifier que le monitoring est actif (doit être démarré à la connexion)
    if (!bleManager.isConnected()) {
      return {
        success: false,
        error: 'Le Kidoo n\'est pas connecté',
      };
    }

    try {
      // Convertir le tagId UUID en bytes
      const tagIdBytes = uuidToBytes(tagId);

      onProgress?.('writing', 'Écriture sur le tag NFC...');

      console.log('[NFCManager] Écriture du tag NFC avec id:', tagId);
      
      // Écrire le tag NFC
      const response = await bleManager.writeNFCTag(blockNumber, tagIdBytes, {
        timeout: 15000,
        timeoutErrorMessage: 'Timeout: Aucun tag NFC détecté après 15 secondes. Approchez le tag du Kidoo et réessayez.',
      });

      // Traiter la réponse
      const { uid } = response;
      console.log('[NFCManager] Tag écrit avec succès, UID:', uid);
      
      return {
        success: true,
        tagId,
        uid: uid || undefined,
      };
    } catch (err) {
      console.error('[NFCManager] Erreur écriture NFC:', err);
      
      // Construire un message d'erreur plus détaillé
      let errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'écriture sur le tag';
      
      // Ajouter des suggestions selon le type d'erreur
      if (errorMessage.includes('authentification') || errorMessage.includes('auth')) {
        errorMessage += '. Vérifiez que le tag NFC est bien approché et qu\'il n\'est pas en lecture seule.';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('délai')) {
        errorMessage += '. Le tag NFC n\'a pas été détecté. Approchez-le du Kidoo.';
      } else if (errorMessage.includes('bloc') || errorMessage.includes('block')) {
        errorMessage += '. Le bloc NFC ne peut pas être écrit. Vérifiez que le tag n\'est pas protégé.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
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

    return new Promise(async (resolve) => {
      try {
        onProgress?.('reading', 'Lecture du tag NFC...');

        console.log('[NFCManager] Lecture du tag NFC');
        
        // Lire le tag NFC
        const response = await bleManager.readNFCTag(blockNumber);

        // Traiter la réponse
        const { uid, data } = response;
        console.log('[NFCManager] Tag lu avec succès, UID:', uid);

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
      } catch (err) {
        console.error('[NFCManager] Erreur lecture NFC:', err);
        resolve({
          success: false,
          error: err instanceof Error ? err.message : 'Erreur lors de la lecture du tag',
        });
      }
    });
  }

  /**
   * Nettoyer le timeout en cours
   */
  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Arrêter le monitoring NFC en cours (supprime juste le callback actif)
   */
  stopMonitoring(): void {
    // Nettoyer le timeout s'il existe
    this.clearTimeout();
    
    // Supprimer le callback actif (le monitoring reste actif)
    if (this.stopMonitoringFn) {
      this.stopMonitoringFn();
      this.stopMonitoringFn = null;
    }
    // Ne pas appeler bleManager.stopMonitoring() car le monitoring doit rester actif
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
