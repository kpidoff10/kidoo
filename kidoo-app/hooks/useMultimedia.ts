/**
 * Hooks React Query pour les fichiers multimédias
 * Gère le cache et les mutations pour les opérations sur les fichiers multimédias
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  getMultimediaByTag,
  reorderMultimediaFiles,
  deleteMultimediaFile,
  updateMultimediaFileStatus,
  multimediaKeys,
  type MultimediaFile,
} from '@/services/multimediaService';
import type { ApiResponse } from '@/services/api';

// Réexporter multimediaKeys pour compatibilité
export { multimediaKeys };

/**
 * Hook pour récupérer tous les fichiers multimédias d'un tag
 * @param tagId - ID du tag (UUID)
 * @param enabled - Active/désactive la requête (défaut: true)
 */
export function useMultimediaByTag(tagId: string, enabled: boolean = true) {
  const { user } = useAuth();

  return useQuery<ApiResponse<MultimediaFile[]>>({
    queryKey: multimediaKeys.byTag(tagId),
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      return getMultimediaByTag(tagId, user.id);
    },
    enabled: enabled && !!user?.id && !!tagId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook pour réorganiser l'ordre des fichiers multimédias
 * @param tagId - ID du tag (UUID)
 */
export function useReorderMultimedia(tagId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<ApiResponse<null>, ApiResponse<null>, { fileIds: string[] }>({
    mutationFn: async ({ fileIds }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await reorderMultimediaFiles(tagId, fileIds, user.id);
      if (result.success) {
        return result;
      }
      throw result;
    },
    onSuccess: () => {
      // Invalider la liste des fichiers multimédias pour re-fetch
      queryClient.invalidateQueries({
        queryKey: multimediaKeys.byTag(tagId),
      });
    },
  });
}

/**
 * Hook pour mettre à jour le statut d'un fichier multimédia (activer/désactiver)
 * @param tagId - ID du tag (UUID) pour invalider le cache après mise à jour
 */
export function useUpdateMultimediaStatus(tagId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<ApiResponse<MultimediaFile>, Error, { fileId: string; disabled: boolean }>({
    mutationFn: async ({ fileId, disabled }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await updateMultimediaFileStatus(fileId, disabled, user.id);
      if (result.success) {
        return result;
      }
      throw new Error(result.error || 'Une erreur est survenue lors de la mise à jour');
    },
    onSuccess: () => {
      // Invalider la liste des fichiers multimédias pour re-fetch
      queryClient.invalidateQueries({
        queryKey: multimediaKeys.byTag(tagId),
      });
    },
  });
}

/**
 * Hook pour supprimer un fichier multimédia
 * @param tagId - ID du tag (UUID) pour invalider le cache après suppression
 */
export function useDeleteMultimedia(tagId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<ApiResponse<null>, Error, { fileId: string }>({
    mutationFn: async ({ fileId }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await deleteMultimediaFile(fileId, user.id);
      if (result.success) {
        return result;
      }
      throw new Error(result.error || 'Une erreur est survenue lors de la suppression');
    },
    onSuccess: () => {
      // Invalider la liste des fichiers multimédias pour re-fetch
      queryClient.invalidateQueries({
        queryKey: multimediaKeys.byTag(tagId),
      });
    },
  });
}
