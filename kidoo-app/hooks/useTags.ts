/**
 * Hooks React Query pour les Tags NFC
 * Gère le cache et les mutations pour les opérations sur les Tags
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
    createTag,
    getTagsByKidoo,
    updateTag,
    deleteTag,
    checkTagExists,
    tagKeys,
    type CreateTagResponse,
    type CreateTagError,
    type CheckTagExistsResponse,
    type CheckTagExistsError,
  } from '@/services/tagService';
import type { CreateTagInput, UpdateTagInput, Tag } from '@/types/shared';
import type { ApiResponse } from '@/services/api';

// Réexporter tagKeys pour compatibilité
export { tagKeys };

/**
 * Hook pour récupérer tous les tags d'un Kidoo
 * @param kidooId - ID du Kidoo
 * @param enabled - Active/désactive la requête (défaut: true)
 */
export function useTagsByKidoo(kidooId: string, enabled: boolean = true) {
  const { user } = useAuth();

  return useQuery<ApiResponse<Tag[]>>({
    queryKey: tagKeys.byKidoo(kidooId),
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      return getTagsByKidoo(kidooId, user.id);
    },
    enabled: enabled && !!user?.id && !!kidooId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook pour créer un nouveau Tag NFC
 */
export function useCreateTag() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<CreateTagResponse, CreateTagError, CreateTagInput>({
    mutationFn: async (data: CreateTagInput) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await createTag(data, user.id);
      if (result.success) {
        return result;
      }
      throw result; // React Query gère les erreurs automatiquement
    },
    onMutate: async (variables) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: tagKeys.byKidoo(variables.kidooId) });

      // Sauvegarder l'état précédent pour rollback
      const previousData = queryClient.getQueryData<ApiResponse<Tag[]>>(
        tagKeys.byKidoo(variables.kidooId)
      );

      // Mise à jour optimiste : créer un tag temporaire avec les données fournies
      if (previousData?.success && previousData.data) {
        const tempTag: Tag = {
          id: `temp-${Date.now()}`, // ID temporaire
          tagId: variables.tagId,
          kidooId: variables.kidooId,
          name: variables.name || null,
          uid: null, // Sera rempli par le serveur
          userId: user!.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData<ApiResponse<Tag[]>>(
          tagKeys.byKidoo(variables.kidooId),
          {
            ...previousData,
            data: [...previousData.data, tempTag],
          }
        );
      }

      return { previousData };
    },
    onError: (_err, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousData) {
        queryClient.setQueryData(tagKeys.byKidoo(variables.kidooId), context.previousData);
      }
    },
    onSuccess: (data, variables) => {
      // Remplacer le tag temporaire par le tag réel retourné par le serveur
      if (data.success) {
        const previousData = queryClient.getQueryData<ApiResponse<Tag[]>>(
          tagKeys.byKidoo(variables.kidooId)
        );
        if (previousData?.success && previousData.data) {
          // Remplacer le tag temporaire par le vrai tag
          const updatedTags = previousData.data.map(tag =>
            tag.id.startsWith('temp-') ? data.data : tag
          );
          queryClient.setQueryData<ApiResponse<Tag[]>>(
            tagKeys.byKidoo(variables.kidooId),
            {
              ...previousData,
              data: updatedTags,
            }
          );
        }
      }
    },
    onSettled: (_data, _error, variables) => {
      // Re-fetch pour s'assurer que les données sont à jour
      queryClient.invalidateQueries({
        queryKey: tagKeys.byKidoo(variables.kidooId),
      });
    },
  });
}

/**
 * Hook pour mettre à jour un Tag
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<ApiResponse<Tag>, ApiResponse<null>, { tagId: string; data: UpdateTagInput }>({
    mutationFn: async ({ tagId, data }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await updateTag(tagId, data, user.id);
      if (result.success) {
        return result;
      }
      throw result; // React Query gère les erreurs automatiquement
    },
    onMutate: async ({ tagId, data }) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: tagKeys.detail(tagId) });
      
      // Trouver toutes les listes qui contiennent ce tag
      const allQueries = queryClient.getQueriesData({ queryKey: tagKeys.lists() });
      
      // Sauvegarder les états précédents pour rollback
      const previousStates: Array<{ queryKey: readonly unknown[]; data: unknown }> = [];
      
      for (const [queryKey, queryData] of allQueries) {
        previousStates.push({ queryKey, data: queryData });
        
        // Mise à jour optimiste dans chaque liste
        if (queryData && typeof queryData === 'object' && 'success' in queryData) {
          const response = queryData as ApiResponse<Tag[]>;
          if (response.success && response.data) {
            const updatedTags = response.data.map(tag =>
              tag.id === tagId ? { ...tag, ...data, updatedAt: new Date().toISOString() } : tag
            );
            queryClient.setQueryData<ApiResponse<Tag[]>>(queryKey, {
              ...response,
              data: updatedTags,
            });
          }
        }
      }
      
      // Mise à jour optimiste du détail du tag
      const previousDetail = queryClient.getQueryData<ApiResponse<Tag>>(tagKeys.detail(tagId));
      if (previousDetail?.success && previousDetail.data) {
        queryClient.setQueryData<ApiResponse<Tag>>(tagKeys.detail(tagId), {
          ...previousDetail,
          data: { ...previousDetail.data, ...data, updatedAt: new Date().toISOString() },
        });
      }

      return { previousStates, previousDetail };
    },
    onError: (_err, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousStates) {
        context.previousStates.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(tagKeys.detail(variables.tagId), context.previousDetail);
      }
    },
    onSettled: (response) => {
      if (response?.success && response.data) {
        // Invalider le tag spécifique
        queryClient.invalidateQueries({
          queryKey: tagKeys.detail(response.data.id),
        });
        // Invalider toutes les listes (car le tag peut avoir changé de Kidoo)
        queryClient.invalidateQueries({
          queryKey: tagKeys.lists(),
        });
      }
    },
  });
}

/**
 * Hook pour vérifier si un tag existe déjà
 */
export function useCheckTagExists() {
  const { user } = useAuth();

  return useMutation<
    CheckTagExistsResponse,
    CheckTagExistsError,
    { tagId: string; uid?: string; kidooId?: string }
  >({
    mutationFn: async ({ tagId, uid, kidooId }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await checkTagExists(tagId, user.id, uid, kidooId);
      if (result.success) {
        return result;
      }
      throw result; // React Query gère les erreurs automatiquement
    },
  });
}

/**
 * Hook pour supprimer un Tag
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<ApiResponse<null>, ApiResponse<null>, { tagId: string; kidooId?: string }>({
    mutationFn: async ({ tagId }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await deleteTag(tagId, user.id);
      if (result.success) {
        return result;
      }
      throw result; // React Query gère les erreurs automatiquement
    },
    onMutate: async ({ tagId, kidooId }) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: tagKeys.detail(tagId) });
      
      // Sauvegarder les états précédents pour rollback
      const previousStates: Array<{ queryKey: readonly unknown[]; data: unknown }> = [];
      
      if (kidooId) {
        // Si on connaît le kidooId, on peut cibler directement la liste
        await queryClient.cancelQueries({ queryKey: tagKeys.byKidoo(kidooId) });
        const previousData = queryClient.getQueryData<ApiResponse<Tag[]>>(
          tagKeys.byKidoo(kidooId)
        );
        if (previousData) {
          previousStates.push({ queryKey: tagKeys.byKidoo(kidooId), data: previousData });
          
          // Mise à jour optimiste : supprimer le tag de la liste
          if (previousData.success && previousData.data) {
            const updatedTags = previousData.data.filter(tag => tag.id !== tagId);
            queryClient.setQueryData<ApiResponse<Tag[]>>(tagKeys.byKidoo(kidooId), {
              ...previousData,
              data: updatedTags,
            });
          }
        }
      } else {
        // Sinon, mettre à jour toutes les listes
        const allQueries = queryClient.getQueriesData({ queryKey: tagKeys.lists() });
        for (const [queryKey, queryData] of allQueries) {
          if (queryData) {
            previousStates.push({ queryKey, data: queryData });
            
            if (typeof queryData === 'object' && 'success' in queryData) {
              const response = queryData as ApiResponse<Tag[]>;
              if (response.success && response.data) {
                const updatedTags = response.data.filter(tag => tag.id !== tagId);
                queryClient.setQueryData<ApiResponse<Tag[]>>(queryKey, {
                  ...response,
                  data: updatedTags,
                });
              }
            }
          }
        }
      }
      
      // Sauvegarder le détail du tag
      const previousDetail = queryClient.getQueryData<ApiResponse<Tag>>(tagKeys.detail(tagId));

      return { previousStates, previousDetail };
    },
    onError: (_err, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousStates) {
        context.previousStates.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(tagKeys.detail(variables.tagId), context.previousDetail);
      }
    },
    onSettled: (_data, _error, variables) => {
      // Invalider le tag spécifique
      queryClient.invalidateQueries({
        queryKey: tagKeys.detail(variables.tagId),
      });
      // Invalider la liste des tags du Kidoo si fournie
      if (variables.kidooId) {
        queryClient.invalidateQueries({
          queryKey: tagKeys.byKidoo(variables.kidooId),
        });
      } else {
        // Sinon, invalider toutes les listes
        queryClient.invalidateQueries({
          queryKey: tagKeys.lists(),
        });
      }
    },
  });
}
