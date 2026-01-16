/**
 * Hooks React Query pour les Kidoos
 * Gère le cache et les mutations pour les opérations sur les Kidoos
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  createKidoo,
  getKidooById,
  getKidoos,
  updateKidoo,
  deleteKidoo,
  kidooKeys,
  type CreateKidooResponse,
  type CreateKidooError,
  type Kidoo,
} from '@/services/kidooService';
import type { CreateKidooInput, UpdateKidooInput } from '@/types/shared';
import type { ApiResponse } from '@/services/api';
import { useOptimisticMutation } from './useOptimisticMutation';

// Réexporter kidooKeys pour compatibilité
export { kidooKeys };

/**
 * Hook pour récupérer tous les Kidoos de l'utilisateur
 * @param enabled - Active/désactive la requête (défaut: true)
 */
export function useKidoos(enabled: boolean = true) {
  const { user } = useAuth();

  return useQuery<ApiResponse<Kidoo[]>>({
    queryKey: kidooKeys.lists(),
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      return getKidoos(user.id);
    },
    enabled: enabled && !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook pour récupérer un Kidoo par son ID
 * @param kidooId - ID du Kidoo
 * @param enabled - Active/désactive la requête (défaut: true)
 */
export function useKidooById(kidooId: string, enabled: boolean = true) {
  const { user } = useAuth();

  return useQuery<ApiResponse<Kidoo>>({
    queryKey: kidooKeys.detail(kidooId),
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      return getKidooById(kidooId, user.id);
    },
    enabled: enabled && !!user?.id && !!kidooId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook pour créer un nouveau Kidoo
 */
export function useCreateKidoo() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useOptimisticMutation<
    CreateKidooResponse,
    CreateKidooError,
    CreateKidooInput,
    { previousData: ApiResponse<Kidoo[]> | undefined }
  >({
    mutationFn: async (data: CreateKidooInput) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await createKidoo(data, user.id);
      if (result.success) {
        return result;
      }
      throw result;
    },
    queryKey: kidooKeys.lists(),
    optimisticUpdate: (variables, previousData) => {
      const previous = previousData as ApiResponse<Kidoo[]> | undefined;
      
      // Mise à jour optimiste : créer un Kidoo temporaire avec les données fournies
      if (previous?.success && previous.data) {
        const tempKidoo: Kidoo = {
          id: `temp-${Date.now()}`, // ID temporaire
          name: variables.name,
          model: variables.model,
          deviceId: variables.deviceId,
          macAddress: variables.macAddress || null,
          firmwareVersion: variables.firmwareVersion || null,
          lastConnected: null,
          isConnected: false,
          wifiSSID: null,
          userId: user!.id,
          isSynced: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          ...previous,
          data: [...previous.data, tempKidoo],
        };
      }
      
      return previous;
    },
    onSettled: (data) => {
      // Remplacer le Kidoo temporaire par le Kidoo réel retourné par le serveur
      if (data?.success) {
        const previousData = queryClient.getQueryData<ApiResponse<Kidoo[]>>(
          kidooKeys.lists()
        );
        if (previousData?.success && previousData.data) {
          // Remplacer le Kidoo temporaire par le vrai Kidoo
          const updatedKidoos = previousData.data.map(kidoo =>
            kidoo.id.startsWith('temp-') ? data.data : kidoo
          );
          queryClient.setQueryData<ApiResponse<Kidoo[]>>(
            kidooKeys.lists(),
            {
              ...previousData,
              data: updatedKidoos,
            }
          );
        }
      }
    },
  });
}

/**
 * Hook pour mettre à jour un Kidoo
 */
export function useUpdateKidoo() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<
    ApiResponse<Kidoo>,
    ApiResponse<null>,
    { kidooId: string; data: UpdateKidooInput },
    { previousDetail: ApiResponse<Kidoo> | undefined; previousList: ApiResponse<Kidoo[]> | undefined }
  >({
    mutationFn: async ({ kidooId, data }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await updateKidoo(kidooId, data, user.id);
      if (result.success) {
        return result;
      }
      throw result;
    },
    onMutate: async ({ kidooId, data }) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: kidooKeys.detail(kidooId) });
      await queryClient.cancelQueries({ queryKey: kidooKeys.lists() });

      // Sauvegarder les états précédents pour rollback
      const previousDetail = queryClient.getQueryData<ApiResponse<Kidoo>>(
        kidooKeys.detail(kidooId)
      );
      const previousList = queryClient.getQueryData<ApiResponse<Kidoo[]>>(
        kidooKeys.lists()
      );

      // Mise à jour optimiste du détail
      if (previousDetail?.success && previousDetail.data) {
        queryClient.setQueryData<ApiResponse<Kidoo>>(kidooKeys.detail(kidooId), {
          ...previousDetail,
          data: { ...previousDetail.data, ...data, updatedAt: new Date().toISOString() },
        });
      }

      // Mise à jour optimiste de la liste
      if (previousList?.success && previousList.data) {
        const updatedKidoos = previousList.data.map(kidoo =>
          kidoo.id === kidooId ? { ...kidoo, ...data, updatedAt: new Date().toISOString() } : kidoo
        );
        queryClient.setQueryData<ApiResponse<Kidoo[]>>(kidooKeys.lists(), {
          ...previousList,
          data: updatedKidoos,
        });
      }

      return { previousDetail, previousList };
    },
    onError: (_err, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousDetail) {
        queryClient.setQueryData(kidooKeys.detail(variables.kidooId), context.previousDetail);
      }
      if (context?.previousList) {
        queryClient.setQueryData(kidooKeys.lists(), context.previousList);
      }
    },
    onSettled: (response) => {
      if (response?.success && response.data) {
        // Invalider le Kidoo spécifique
        queryClient.invalidateQueries({
          queryKey: kidooKeys.detail(response.data.id),
        });
        // Invalider la liste des Kidoos
        queryClient.invalidateQueries({
          queryKey: kidooKeys.lists(),
        });
      }
    },
  });
}

/**
 * Hook pour supprimer un Kidoo
 */
export function useDeleteKidoo() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<
    ApiResponse<null>,
    ApiResponse<null>,
    string,
    { previousDetail: ApiResponse<Kidoo> | undefined; previousList: ApiResponse<Kidoo[]> | undefined }
  >({
    mutationFn: async (kidooId: string) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await deleteKidoo(kidooId, user.id);
      if (result.success) {
        return result;
      }
      throw result;
    },
    onMutate: async (kidooId) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: kidooKeys.detail(kidooId) });
      await queryClient.cancelQueries({ queryKey: kidooKeys.lists() });

      // Sauvegarder les états précédents pour rollback
      const previousDetail = queryClient.getQueryData<ApiResponse<Kidoo>>(
        kidooKeys.detail(kidooId)
      );
      const previousList = queryClient.getQueryData<ApiResponse<Kidoo[]>>(
        kidooKeys.lists()
      );

      // Mise à jour optimiste : supprimer le Kidoo de la liste
      if (previousList?.success && previousList.data) {
        const updatedKidoos = previousList.data.filter(kidoo => kidoo.id !== kidooId);
        queryClient.setQueryData<ApiResponse<Kidoo[]>>(kidooKeys.lists(), {
          ...previousList,
          data: updatedKidoos,
        });
      }

      return { previousDetail, previousList };
    },
    onError: (_err, kidooId, context) => {
      // Rollback en cas d'erreur
      if (context?.previousDetail) {
        queryClient.setQueryData(kidooKeys.detail(kidooId), context.previousDetail);
      }
      if (context?.previousList) {
        queryClient.setQueryData(kidooKeys.lists(), context.previousList);
      }
    },
    onSettled: (_data, _error, kidooId) => {
      // Invalider le Kidoo spécifique
      queryClient.invalidateQueries({
        queryKey: kidooKeys.detail(kidooId),
      });
      // Invalider la liste des Kidoos
      queryClient.invalidateQueries({
        queryKey: kidooKeys.lists(),
      });
    },
  });
}
