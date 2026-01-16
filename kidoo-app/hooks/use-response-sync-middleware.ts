/**
 * Hook personnalisé pour gérer le middleware de synchronisation des réponses BLE
 * 
 * Usage:
 * ```tsx
 * const { kidoo, userId, isConnected } = useKidoo();
 * useResponseSyncMiddleware({ kidoo, userId, isConnected });
 * ```
 */

import { useEffect, useRef } from 'react';
import { setupResponseSyncMiddleware } from '@/services/bte/responseSyncMiddleware';
import type { Kidoo } from '@/types/shared';

interface UseResponseSyncMiddlewareOptions {
  kidoo: Kidoo | null | undefined;
  userId: string | undefined;
  isConnected: boolean;
}

/**
 * Hook pour activer automatiquement le middleware de synchronisation des réponses BLE
 * Le middleware s'active automatiquement quand le Kidoo est connecté et se désactive à la déconnexion
 */
export function useResponseSyncMiddleware({
  kidoo,
  userId,
  isConnected,
}: UseResponseSyncMiddlewareOptions): void {
  const syncMiddlewareUnsubscribeRef = useRef<(() => void) | null>(null);
  const lastKidooIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Si on n'a pas les infos nécessaires, désactiver le middleware
    if (!kidoo || !userId || !isConnected) {
      if (syncMiddlewareUnsubscribeRef.current) {
        syncMiddlewareUnsubscribeRef.current();
        syncMiddlewareUnsubscribeRef.current = null;
        lastKidooIdRef.current = null;
      }
      return;
    }

    // Vérifier si le middleware est déjà actif pour ce Kidoo
    // Éviter de réactiver le middleware si c'est le même Kidoo et qu'il est déjà connecté
    const currentKidooId = kidoo.id;
    
    if (lastKidooIdRef.current === currentKidooId && syncMiddlewareUnsubscribeRef.current) {
      // Le middleware est déjà actif pour ce Kidoo, ne pas le réactiver
      return;
    }

    // Activer le middleware de synchronisation
    const unsubscribe = setupResponseSyncMiddleware({
      kidooId: currentKidooId,
      userId,
      onSyncError: (error, response) => {
        console.error('[useResponseSyncMiddleware] Erreur de synchronisation:', error.message, response.message);
      },
      onSyncSuccess: (response, syncedData) => {
        console.log('[useResponseSyncMiddleware] Synchronisation réussie:', response.message, syncedData);
      },
    });

    syncMiddlewareUnsubscribeRef.current = unsubscribe;
    lastKidooIdRef.current = currentKidooId;

    // Nettoyer à la déconnexion ou au démontage
    return () => {
      if (syncMiddlewareUnsubscribeRef.current) {
        syncMiddlewareUnsubscribeRef.current();
        syncMiddlewareUnsubscribeRef.current = null;
      }
      lastKidooIdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidoo?.id, userId, isConnected]);
}
