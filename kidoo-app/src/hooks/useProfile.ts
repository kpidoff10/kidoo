/**
 * useProfile Hook
 * Gestion du profil utilisateur avec React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, User } from '@/api';
import { showToast } from '@/components/ui/Toast';
import { useTranslation } from 'react-i18next';
import { useOptimisticUpdate } from './useOptimisticUpdate';
import { useAuth } from '@/contexts';
import { queryClient } from '@/lib/queryClient';

const PROFILE_KEY = ['profile'];

export interface UpdateProfileRequest {
  name?: string;
}

/**
 * Hook pour récupérer le profil utilisateur
 */
export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: authApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour mettre à jour le profil utilisateur (avec optimistic update)
 */
export function useUpdateProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const optimisticOptions = useOptimisticUpdate<User, UpdateProfileRequest>({
    queryKey: PROFILE_KEY,
    updateFn: (oldData, variables) => {
      // Si le cache est vide, on utilise les données de AuthContext comme fallback
      // Cela peut arriver si useProfile() n'a pas encore été appelé
      const currentData = oldData || user;
      
      if (!currentData) {
        // Si vraiment aucune donnée n'est disponible, on ne peut pas faire d'optimistic update
        // On laisse la mutation se faire normalement
        throw new Error('No profile data available for optimistic update');
      }
      
      return {
        ...currentData,
        ...variables,
      };
    },
  });

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authApi.updateProfile(data),
    ...optimisticOptions,
    onError: () => {
      // Le rollback est déjà géré par useOptimisticUpdate
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
  });
}

/**
 * Hook pour supprimer le compte utilisateur
 */
export function useDeleteAccount() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => authApi.deleteAccount(),
    onSuccess: () => {
      // Nettoyer le cache du profil
      queryClient.removeQueries({ queryKey: PROFILE_KEY });
    },
    onError: () => {
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
  });
}
