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

  return useMutation<CreateKidooResponse, CreateKidooError, CreateKidooInput>({
    mutationFn: async (data: CreateKidooInput) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await createKidoo(data, user.id);
      if (result.success) {
        return result;
      }
      throw result; // React Query gère les erreurs automatiquement
    },
    onSuccess: () => {
      // Invalider la liste des Kidoos pour re-fetch
      queryClient.invalidateQueries({
        queryKey: kidooKeys.lists(),
      });
    },
  });
}

/**
 * Hook pour mettre à jour un Kidoo
 */
export function useUpdateKidoo() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<ApiResponse<Kidoo>, ApiResponse<null>, { kidooId: string; data: UpdateKidooInput }>({
    mutationFn: async ({ kidooId, data }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await updateKidoo(kidooId, data, user.id);
      if (result.success) {
        return result;
      }
      throw result; // React Query gère les erreurs automatiquement
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
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

  return useMutation<ApiResponse<null>, ApiResponse<null>, string>({
    mutationFn: async (kidooId: string) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      const result = await deleteKidoo(kidooId, user.id);
      if (result.success) {
        return result;
      }
      throw result; // React Query gère les erreurs automatiquement
    },
    onSuccess: (_data, kidooId) => {
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
