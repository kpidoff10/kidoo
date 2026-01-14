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
    onSuccess: (_data, variables) => {
      // Invalider la liste des tags du Kidoo pour re-fetch
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
    onSuccess: (response) => {
      if (response.success && response.data) {
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
    onSuccess: (_data, variables) => {
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
