/**
 * Hook générique pour les mutations optimistes avec React Query
 * Simplifie la création de mutations optimistes avec rollback automatique
 */

import { useMutation, useQueryClient, type UseMutationOptions, type UseMutationResult , QueryKey } from '@tanstack/react-query';


/**
 * Options pour une mutation optimiste
 */
export interface OptimisticMutationOptions<
  TData,
  TError,
  TVariables,
  TContext = { previousData: unknown }
> {
  /**
   * Fonction de mutation (appel API)
   */
  mutationFn: (variables: TVariables) => Promise<TData>;
  
  /**
   * Clé de requête à invalider après la mutation
   */
  queryKey: QueryKey;
  
  /**
   * Fonction pour mettre à jour optimistement le cache
   * @param variables - Variables de la mutation
   * @param previousData - Données précédentes du cache
   * @returns Nouvelles données à mettre dans le cache (peut être async)
   */
  optimisticUpdate: (variables: TVariables, previousData: unknown) => unknown | Promise<unknown>;
  
  /**
   * Clés de requête supplémentaires à annuler avant la mutation
   * @default [queryKey]
   */
  cancelQueryKeys?: QueryKey[];
  
  /**
   * Fonction appelée après la mutation (succès ou erreur)
   * Utile pour invalider d'autres queries
   */
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
  
  /**
   * Désactiver l'invalidation automatique des queries après la mutation
   * @default false - Invalide automatiquement par défaut
   */
  skipInvalidation?: boolean;
  
  /**
   * Options supplémentaires de useMutation
   */
  mutationOptions?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn' | 'onMutate' | 'onError' | 'onSettled'
  >;
}

/**
 * Hook générique pour les mutations optimistes
 * 
 * @example
 * ```ts
 * const mutation = useOptimisticMutation({
 *   mutationFn: async (variables) => await updateItem(variables),
 *   queryKey: ['items', itemId],
 *   optimisticUpdate: (variables, previousData) => ({
 *     ...previousData,
 *     ...variables,
 *   }),
 * });
 * ```
 */
export function useOptimisticMutation<
  TData,
  TError = Error,
  TVariables = void,
  TContext = { previousData: unknown }
>({
  mutationFn,
  queryKey,
  optimisticUpdate,
  cancelQueryKeys = [queryKey],
  onSettled,
  skipInvalidation = false,
  mutationOptions,
}: OptimisticMutationOptions<TData, TError, TVariables, TContext>): UseMutationResult<TData, TError, TVariables, TContext> {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    ...mutationOptions,
    onMutate: async (variables) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await Promise.all(
        cancelQueryKeys.map(key => queryClient.cancelQueries({ queryKey: key }))
      );

      // Sauvegarder l'état précédent pour rollback
      const previousData = queryClient.getQueryData(queryKey);

      // Mise à jour optimiste (peut être async)
      const newData = await optimisticUpdate(variables, previousData);
      if (newData !== undefined) {
        queryClient.setQueryData(queryKey, newData);
      }

      return { previousData } as TContext;
    },
    onError: (_error, _variables, context) => {
      // Rollback automatique en cas d'erreur
      if (context && typeof context === 'object' && 'previousData' in context) {
        const ctx = context as { previousData: unknown };
        queryClient.setQueryData(queryKey, ctx.previousData);
      }
    },
    onSettled: (data, error, variables) => {
      // Appel de la fonction onSettled personnalisée si fournie
      onSettled?.(data, error, variables);
      
      // Invalidation par défaut pour re-fetch (sauf si désactivée)
      if (!skipInvalidation) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}
