/**
 * Middleware de synchronisation des réponses BLE avec le serveur
 * Intercepte les réponses de l'ESP32 et synchronise automatiquement les modifications avec le serveur
 * 
 * Usage:
 * ```ts
 * import { setupResponseSyncMiddleware } from '@/services/bte/responseSyncMiddleware';
 * 
 * // Dans un contexte ou au démarrage de l'app
 * const unsubscribe = setupResponseSyncMiddleware({
 *   kidooId: kidoo.id,
 *   userId: user.id,
 *   onSyncError: (error) => console.error('Erreur de sync:', error),
 * });
 * 
 * // Pour arrêter le middleware
 * unsubscribe();
 * ```
 */

import { bleManager } from './bleManager';
import { updateKidoo , kidooKeys } from '@/services/models/common/api';

import { updateKidooConfigBasic } from '@/services/models/basic/api';
import type { BluetoothResponse } from '@/types/bluetooth';
import type { BLEManagerCallbacks } from './bleManager';
import { SYNC_MAPPINGS, KIDOO_SYNC_MESSAGES, type SyncMappingSingle } from '../models/sync-middleware-mapping';
import { queryClient } from '@/providers/QueryProvider';

export interface ResponseSyncMiddlewareOptions {
  /** ID du Kidoo à synchroniser */
  kidooId: string;
  /** ID de l'utilisateur connecté */
  userId: string;
  /** Callback optionnel pour gérer les erreurs de synchronisation */
  onSyncError?: (error: Error, response: BluetoothResponse) => void;
  /** Callback optionnel appelé après une synchronisation réussie */
  onSyncSuccess?: (response: BluetoothResponse, syncedData: Record<string, unknown>) => void;
}

/**
 * Cache pour éviter les synchronisations multiples de la même réponse
 * Clé: message + timestamp, Valeur: timestamp de la dernière synchronisation
 */
const syncCache = new Map<string, number>();
const SYNC_CACHE_DURATION = 2000; // 2 secondes pour éviter les doublons

/**
 * Génère une clé unique pour une réponse
 */
function getResponseKey(response: BluetoothResponse): string {
  return `${response.message}_${response.status}`;
}

/**
 * Vérifie si une réponse a déjà été synchronisée récemment
 */
function hasBeenSyncedRecently(response: BluetoothResponse): boolean {
  const key = getResponseKey(response);
  const lastSync = syncCache.get(key);
  if (!lastSync) {
    return false;
  }
  
  const now = Date.now();
  if (now - lastSync > SYNC_CACHE_DURATION) {
    syncCache.delete(key);
    return false;
  }
  
  return true;
}

/**
 * Marque une réponse comme synchronisée
 */
function markAsSynced(response: BluetoothResponse): void {
  const key = getResponseKey(response);
  syncCache.set(key, Date.now());
  
  // Nettoyer le cache périodiquement (garder seulement les entrées récentes)
  if (syncCache.size > 100) {
    const now = Date.now();
    for (const [k, timestamp] of syncCache.entries()) {
      if (now - timestamp > SYNC_CACHE_DURATION) {
        syncCache.delete(k);
      }
    }
  }
}

/**
 * Extrait les données à synchroniser depuis une réponse BLE
 * Utilise le mapping SYNC_MAPPINGS pour savoir quel champ extraire
 */
function extractSyncData(response: BluetoothResponse): Record<string, unknown> | null {
  // Vérifier que la réponse est un succès
  if (response.status !== 'success') {
    return null;
  }

  // Chercher le mapping pour ce type de message
  const mapping = SYNC_MAPPINGS[response.message];
  if (!mapping) {
    // Pas de mapping défini pour ce type de message, on ne synchronise pas
    return null;
  }

  // Vérifier si c'est un mapping multiple (avec fonction extract)
  if ('extract' in mapping && typeof mapping.extract === 'function') {
    // Mapping multiple : utiliser la fonction extract
    return mapping.extract(response as Record<string, unknown>);
  }

  // Mapping simple : extraire un seul champ
  const singleMapping = mapping as SyncMappingSingle;
  const responseValue = (response as Record<string, unknown>)[singleMapping.field];
  
  if (responseValue === undefined || responseValue === null) {
    // La valeur n'existe pas dans la réponse
    console.warn(
      `[ResponseSyncMiddleware] Champ '${singleMapping.field}' non trouvé dans la réponse:`,
      response.message
    );
    return null;
  }

  // Retourner l'objet avec le nom de champ de la config Basic
  return {
    [singleMapping.configField]: responseValue,
  };
}

/**
 * Configure le middleware de synchronisation des réponses BLE
 * @param options - Options de configuration du middleware
 * @returns Fonction pour désactiver le middleware
 */
export function setupResponseSyncMiddleware(
  options: ResponseSyncMiddlewareOptions
): () => void {
  const { kidooId, userId, onSyncError, onSyncSuccess } = options;
  
  // Callback pour intercepter les notifications BLE
  const notificationHandler: BLEManagerCallbacks['onNotification'] = async (response: BluetoothResponse) => {
    // Ignorer les réponses d'erreur
    if (response.status !== 'success') {
      return;
    }
    
    // Vérifier si cette réponse a déjà été synchronisée récemment
    if (hasBeenSyncedRecently(response)) {
      console.log('[ResponseSyncMiddleware] Réponse déjà synchronisée récemment, skip:', response.message);
      return;
    }
    
    // Extraire les données à synchroniser
    const syncData = extractSyncData(response);
    
    if (!syncData || Object.keys(syncData).length === 0) {
      // Pas de données à synchroniser pour ce type de réponse
      return;
    }
    
    try {
      console.log('[ResponseSyncMiddleware] Synchronisation avec le serveur:', response.message, syncData);
      
      // Déterminer si on synchronise dans Kidoo ou KidooConfigBasic
      const isKidooSync = KIDOO_SYNC_MESSAGES.has(response.message);
      
      // Synchroniser avec le serveur
      const result = isKidooSync
        ? await updateKidoo(kidooId, syncData, userId)
        : await updateKidooConfigBasic(kidooId, syncData, userId);
      
      if (result.success) {
        // Marquer comme synchronisé
        markAsSynced(response);
        
        // Invalider le cache du Kidoo
        queryClient.invalidateQueries({
          queryKey: kidooKeys.detail(kidooId),
        });
        
        // Si c'est une synchronisation de stockage, invalider aussi le cache storage
        if (response.message === 'STORAGE_GET') {
          queryClient.invalidateQueries({
            queryKey: ['kidoo', kidooId, 'storage'],
          });
        }
        
        // Appeler le callback de succès si défini
        if (onSyncSuccess) {
          onSyncSuccess(response, syncData);
        }
        
        console.log('[ResponseSyncMiddleware] Synchronisation réussie:', response.message, isKidooSync ? '(Kidoo)' : '(ConfigBasic)');
      } else {
        throw new Error(result.error || 'Erreur lors de la synchronisation');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('[ResponseSyncMiddleware] Erreur lors de la synchronisation:', errorMessage, response);
      
      // Appeler le callback d'erreur si défini
      if (onSyncError) {
        onSyncError(
          error instanceof Error ? error : new Error(errorMessage),
          response
        );
      }
    }
  };
  
  // Enregistrer le callback
  bleManager.setCallbacks({
    onNotification: notificationHandler,
  });
  
  console.log('[ResponseSyncMiddleware] Middleware activé pour Kidoo:', kidooId);
  
  // Retourner la fonction pour désactiver le middleware
  return () => {
    // Retirer le callback (on garde les autres callbacks s'ils existent)
    bleManager.setCallbacks({
      onNotification: undefined,
    });
    
    console.log('[ResponseSyncMiddleware] Middleware désactivé pour Kidoo:', kidooId);
  };
}

/**
 * Nettoie le cache de synchronisation (utile pour les tests ou le debug)
 */
export function clearSyncCache(): void {
  syncCache.clear();
}
