/**
 * useOptimisticUpdate Hook
 * Hook réutilisable pour gérer les mises à jour optimistes avec React Query
 */

import { queryClient } from '@/lib/queryClient';
import { useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useCallback } from 'react';

export interface OptimisticUpdateContext<TData = unknown> {
  previousData: TData | undefined;
}

export interface UseOptimisticUpdateOptions<TData, TVariables, TError = Error> {
  /**
   * Query key à mettre à jour
   */
  queryKey: unknown[];
  
  /**
   * Fonction pour mettre à jour les données de manière optimiste
   * @param oldData - Les données actuelles dans le cache
   * @param variables - Les variables de la mutation
   * @returns Les nouvelles données à mettre dans le cache
   */
  updateFn: (oldData: TData | undefined, variables: TVariables) => TData;
}

/**
 * Hook pour créer des options de mutation avec mise à jour optimiste
 * 
 * @example
 * ```tsx
 * const mutation = useMutation({
 *   mutationFn: ({ id, data }) => api.update(id, data),
 *   ...useOptimisticUpdate({
 *     queryKey: ['kidoos'],
 *     updateFn: (oldData, { id, data }) => {
 *       return oldData?.map(k => k.id === id ? { ...k, ...data } : k) ?? [];
 *     },
 *   }),
 * });
 * ```
 */
export function useOptimisticUpdate<TData, TVariables, TError = Error>({
  queryKey,
  updateFn,
}: UseOptimisticUpdateOptions<TData, TVariables, TError>): Pick<
  UseMutationOptions<TData, TError, TVariables, OptimisticUpdateContext<TData>>,
  'onMutate' | 'onError' | 'onSettled'
> {

  const onMutate = useCallback(
    async (variables: TVariables) => {
      // Annuler les queries en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey });

      // Snapshot de l'état précédent
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Mise à jour optimiste
      queryClient.setQueryData<TData>(queryKey, (old) => updateFn(old, variables));

      // Retourner le contexte pour le rollback
      return { previousData };
    },
    [queryKey, updateFn, queryClient]
  );

  const onError = useCallback(
    (
      error: TError,
      variables: TVariables,
      context: OptimisticUpdateContext<TData> | undefined
    ) => {
      // Rollback en cas d'erreur
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    [queryKey, queryClient]
  );

  const onSettled = useCallback(() => {
    // Toujours refetch après pour synchroniser avec le serveur
    queryClient.invalidateQueries({ queryKey });
  }, [queryKey, queryClient]);

  return {
    onMutate,
    onError,
    onSettled,
  };
}
