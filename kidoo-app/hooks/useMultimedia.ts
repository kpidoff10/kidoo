/**
 * Hooks React Query pour les fichiers multimédias
 * Gère le cache et les mutations pour les opérations sur les fichiers multimédias
 */

import { useQuery } from '@tanstack/react-query';
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
import { useOptimisticMutation } from './useOptimisticMutation';

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
  const { user } = useAuth();

  return useOptimisticMutation<
    ApiResponse<null>,
    ApiResponse<null>,
    { fileIds: string[] },
    { previousData: ApiResponse<MultimediaFile[]> | undefined }
  >({
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
    queryKey: multimediaKeys.byTag(tagId),
    optimisticUpdate: (variables, previousData) => {
      const data = previousData as ApiResponse<MultimediaFile[]> | undefined;
      if (!data?.success || !data.data) {
        return previousData;
      }

      const filesMap = new Map(data.data.map(file => [file.id, file]));
      const reorderedFiles = variables.fileIds
        .map(id => filesMap.get(id))
        .filter((file): file is MultimediaFile => file !== undefined)
        .map((file, index) => ({ ...file, order: index }));

      // Ajouter les fichiers qui ne sont pas dans fileIds (au cas où)
      const remainingFiles = data.data.filter(
        file => !variables.fileIds.includes(file.id)
      );
      const allFiles = [...reorderedFiles, ...remainingFiles].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );

      return {
        ...data,
        data: allFiles,
      };
    },
  });
}

/**
 * Hook pour mettre à jour le statut d'un fichier multimédia (activer/désactiver)
 * @param tagId - ID du tag (UUID) pour invalider le cache après mise à jour
 */
export function useUpdateMultimediaStatus(tagId: string) {
  const { user } = useAuth();

  return useOptimisticMutation<
    ApiResponse<MultimediaFile>,
    Error,
    { fileId: string; disabled: boolean },
    { previousData: ApiResponse<MultimediaFile[]> | undefined }
  >({
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
    queryKey: multimediaKeys.byTag(tagId),
    optimisticUpdate: (variables, previousData) => {
      const data = previousData as ApiResponse<MultimediaFile[]> | undefined;
      if (!data?.success || !data.data) {
        return previousData;
      }

      const updatedFiles = data.data.map(file =>
        file.id === variables.fileId ? { ...file, disabled: variables.disabled } : file
      );

      return {
        ...data,
        data: updatedFiles,
      };
    },
  });
}

/**
 * Hook pour supprimer un fichier multimédia
 * @param tagId - ID du tag (UUID) pour invalider le cache après suppression
 */
export function useDeleteMultimedia(tagId: string) {
  const { user } = useAuth();

  return useOptimisticMutation<
    ApiResponse<null>,
    Error,
    { fileId: string },
    { previousData: ApiResponse<MultimediaFile[]> | undefined }
  >({
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
    queryKey: multimediaKeys.byTag(tagId),
    optimisticUpdate: (variables, previousData) => {
      const data = previousData as ApiResponse<MultimediaFile[]> | undefined;
      if (!data?.success || !data.data) {
        return previousData;
      }

      const updatedFiles = data.data.filter(file => file.id !== variables.fileId);

      return {
        ...data,
        data: updatedFiles,
      };
    },
  });
}
