/**
 * Hook utilitaire pour les mutations BLE avec synchronisation serveur et optimistic update
 * 
 * Ce hook permet d'envoyer une commande BLE, mettre à jour optimistiquement le cache avec la réponse BLE,
 * synchroniser avec le serveur en arrière-plan, et rollback automatique si la sync échoue.
 * 
 * Utilise `useOptimisticMutation` comme base pour la gestion de l'optimistic update.
 * 
 * @example
 * ```tsx
 * const mutation = useBleMutation({
 *   queryKey: ['kidoo', kidooId, 'brightness'],
 *   bleCommandFn: async (variables) => await BasicBrightnessAction.setBrightness(variables),
 *   syncFn: async (variables, bleResponse) => {
 *     return await updateKidooConfigBasic(kidooId, { brightness: bleResponse.brightness }, userId);
 *   },
 *   optimisticUpdate: (variables, bleResponse, previousData) => ({
 *     ...previousData,
 *     brightness: bleResponse.brightness,
 *   }),
 * });
 * ```
 */

import { useOptimisticMutation } from './useOptimisticMutation';
import { useRef } from 'react';
import { bleManager } from '@/services/bte';
import type { QueryKey } from '@tanstack/react-query';


export interface BleMutationOptions<
  TBleResponse,
  TSyncResponse,
  TVariables,
  TQueryData,
  TError = Error
> {
  /** Clé de requête à mettre à jour optimistiquement */
  queryKey: QueryKey;
  /** Fonction pour envoyer la commande BLE */
  bleCommandFn: (variables: TVariables) => Promise<TBleResponse>;
  /** Fonction pour synchroniser avec le serveur après succès BLE (ou directement si pas connecté) */
  syncFn: (variables: TVariables, bleResponse: TBleResponse | null) => Promise<TSyncResponse>;
  /** Fonction pour transformer la réponse BLE (ou les variables) en données de query pour l'optimistic update */
  optimisticUpdate: (variables: TVariables, bleResponse: TBleResponse | null, previousData: TQueryData | undefined) => TQueryData;
  /** Clés de requête supplémentaires à annuler avant la mutation */
  cancelQueryKeys?: QueryKey[];
  /** Callback appelé après succès */
  onSuccess?: (data: TSyncResponse, variables: TVariables) => void;
  /** Callback appelé après erreur */
  onError?: (error: TError, variables: TVariables) => void;
}

/**
 * Hook pour les mutations BLE avec synchronisation serveur et optimistic update
 * 
 * 1. Envoie la commande BLE dans optimisticUpdate (onMutate)
 * 2. Met à jour optimistiquement le cache avec la réponse BLE (UI instantanée)
 * 3. Synchronise avec le serveur dans mutationFn (utilise la réponse BLE stockée)
 * 4. Rollback automatique si la sync échoue (via useOptimisticMutation)
 */
export function useBleMutation<
  TBleResponse,
  TSyncResponse,
  TVariables,
  TQueryData,
  TError = Error
>({
  queryKey,
  bleCommandFn,
  syncFn,
  optimisticUpdate,
  cancelQueryKeys,
  onSuccess,
  onError,
}: BleMutationOptions<TBleResponse, TSyncResponse, TVariables, TQueryData, TError>) {

  // Ref pour stocker la réponse BLE entre optimisticUpdate et mutationFn
  const bleResponseRef = useRef<{ variables: TVariables; response: TBleResponse | null } | null>(null);

  return useOptimisticMutation<TSyncResponse, TError, TVariables, { previousData: TQueryData | undefined; bleResponse: TBleResponse | null }>({
    queryKey,
    cancelQueryKeys: cancelQueryKeys || [queryKey],
    mutationFn: async (variables: TVariables) => {
      // Récupérer la réponse BLE stockée dans optimisticUpdate
      const stored = bleResponseRef.current;
      if (!stored || stored.variables !== variables) {
        // Si pas de réponse stockée (ne devrait pas arriver), vérifier la connexion et refaire l'appel BLE si connecté
        if (bleManager.isConnected()) {
          const bleResponse = await bleCommandFn(variables);
          const syncResponse = await syncFn(variables, bleResponse);
          return syncResponse;
        } else {
          // Pas connecté, synchroniser directement avec le serveur sans réponse BLE
          const syncResponse = await syncFn(variables, null);
          return syncResponse;
        }
      }

      // Utiliser la réponse BLE stockée (peut être null si pas connecté)
      const bleResponse = stored.response;
      
      // Nettoyer la ref
      bleResponseRef.current = null;
      
      // Synchroniser avec le serveur
      const syncResponse = await syncFn(variables, bleResponse);
      
      return syncResponse;
    },
    optimisticUpdate: async (variables, previousData) => {
      // Vérifier si on est connecté avant d'envoyer la commande BLE
      const isConnected = bleManager.isConnected();
      
      let bleResponse: TBleResponse | null = null;
      
      if (isConnected) {
        try {
          // Envoyer la commande BLE pour obtenir la réponse immédiatement
          bleResponse = await bleCommandFn(variables);
        } catch (error) {
          // Si erreur BLE, on continue sans réponse BLE (synchronisation serveur uniquement)
          console.warn('[useBleMutation] Erreur lors de la commande BLE, synchronisation serveur uniquement:', error);
          bleResponse = null;
        }
      }
      
      // Stocker la réponse (ou null) pour mutationFn
      bleResponseRef.current = { variables, response: bleResponse };
      
      // Mettre à jour optimistiquement avec la réponse BLE (ou les variables si pas de réponse)
      return optimisticUpdate(variables, bleResponse, previousData as TQueryData | undefined) as unknown;
    },
    onSettled: (data, error, variables) => {
      // Nettoyer la ref
      if (error) {
        bleResponseRef.current = null;
        onError?.(error as TError, variables);
      } else if (data) {
        onSuccess?.(data, variables);
      }
    },
    // Désactiver l'invalidation automatique car on a déjà mis à jour le cache avec l'optimistic update
    // Le cache est déjà à jour avec la réponse BLE, pas besoin de re-fetch
    skipInvalidation: true,
  });
}
