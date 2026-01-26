/**
 * useKidoos Hook
 * Gestion des Kidoos avec React Query et optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kidoosApi, Kidoo, CreateKidooRequest, UpdateKidooRequest } from '@/api';
import { showToast } from '@/components/ui/Toast';
import { useTranslation } from 'react-i18next';

const KIDOOS_KEY = ['kidoos'];

/**
 * Hook pour récupérer la liste des Kidoos
 */
export function useKidoos() {
  return useQuery({
    queryKey: KIDOOS_KEY,
    queryFn: kidoosApi.getAll,
  });
}

/**
 * Hook pour récupérer un Kidoo par ID
 */
export function useKidoo(id: string) {
  return useQuery({
    queryKey: [...KIDOOS_KEY, id],
    queryFn: () => kidoosApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook pour créer un Kidoo
 */
export function useCreateKidoo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateKidooRequest) => kidoosApi.create(data),
    onSuccess: (newKidoo) => {
      // Ajouter le nouveau Kidoo au cache
      queryClient.setQueryData<Kidoo[]>(KIDOOS_KEY, (old) => {
        return old ? [...old, newKidoo] : [newKidoo];
      });
      // Toast de succès retiré - l'écran de succès dans Step3Finalization suffit
    },
    onError: () => {
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
  });
}

/**
 * Hook pour mettre à jour un Kidoo (avec optimistic update)
 */
export function useUpdateKidoo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKidooRequest }) =>
      kidoosApi.update(id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Annuler les queries en cours
      await queryClient.cancelQueries({ queryKey: KIDOOS_KEY });
      
      // Snapshot de l'état précédent
      const previousKidoos = queryClient.getQueryData<Kidoo[]>(KIDOOS_KEY);
      
      // Optimistic update
      queryClient.setQueryData<Kidoo[]>(KIDOOS_KEY, (old) => {
        return old?.map((kidoo) =>
          kidoo.id === id ? { ...kidoo, ...data } : kidoo
        );
      });
      
      return { previousKidoos };
    },
    
    // Rollback en cas d'erreur
    onError: (err, variables, context) => {
      if (context?.previousKidoos) {
        queryClient.setQueryData(KIDOOS_KEY, context.previousKidoos);
      }
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
    
    // Toujours refetch après
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KIDOOS_KEY });
    },
    
    onSuccess: () => {
      showToast.success({
        title: t('toast.success'),
        message: t('toast.updated'),
      });
    },
  });
}

/**
 * Hook pour mettre à jour le nom d'un Kidoo (avec optimistic update)
 */
export function useUpdateKidooName() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      kidoosApi.updateName(id, name),
    
    // Optimistic update
    onMutate: async ({ id, name }) => {
      // Annuler les queries en cours
      await queryClient.cancelQueries({ queryKey: KIDOOS_KEY });
      
      // Snapshot de l'état précédent
      const previousKidoos = queryClient.getQueryData<Kidoo[]>(KIDOOS_KEY);
      
      // Optimistic update
      queryClient.setQueryData<Kidoo[]>(KIDOOS_KEY, (old) => {
        return old?.map((kidoo) =>
          kidoo.id === id ? { ...kidoo, name } : kidoo
        );
      });
      
      return { previousKidoos };
    },
    
    // Rollback en cas d'erreur
    onError: (err, variables, context) => {
      if (context?.previousKidoos) {
        queryClient.setQueryData(KIDOOS_KEY, context.previousKidoos);
      }
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
    
    // Toujours refetch après
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KIDOOS_KEY });
    },
  });
}

/**
 * Hook pour récupérer la configuration de l'heure de coucher (Dream)
 */
export function useDreamBedtimeConfig(kidooId: string) {
  return useQuery({
    queryKey: [...KIDOOS_KEY, kidooId, 'dream-bedtime-config'],
    queryFn: () => kidoosApi.getDreamBedtimeConfig(kidooId),
    enabled: !!kidooId,
  });
}

/**
 * Hook pour mettre à jour la configuration de l'heure de coucher (Dream)
 */
export function useUpdateDreamBedtimeConfig() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: {
        hour: number;
        minute: number;
        color: string;
        brightness: number;
        nightlightAllNight: boolean;
      }
    }) => kidoosApi.updateDreamBedtimeConfig(id, data),
    
    onSuccess: (data, variables) => {
      // Mettre à jour le cache
      queryClient.setQueryData(
        [...KIDOOS_KEY, variables.id, 'dream-bedtime-config'],
        data
      );
      showToast.success({
        title: t('toast.success'),
        message: t('kidoos.dream.bedtime.saved', { defaultValue: 'Configuration enregistrée' }),
      });
    },
    
    onError: () => {
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
  });
}

/**
 * Hook pour vérifier si un Kidoo est en ligne (avec optimistic update)
 */
export function useKidooCheckOnline() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => kidoosApi.checkOnline(id),
    
    // Optimistic update
    onMutate: async (id) => {
      // Annuler les queries en cours
      await queryClient.cancelQueries({ queryKey: KIDOOS_KEY });
      
      // Snapshot de l'état précédent
      const previousKidoos = queryClient.getQueryData<Kidoo[]>(KIDOOS_KEY);
      
      // Optimistic update - on ne change rien, on attend la réponse
      // (on pourrait mettre isConnected à true optimistiquement, mais c'est risqué)
      
      return { previousKidoos };
    },
    
    // Mise à jour après succès
    onSuccess: (data, id) => {
      // Mettre à jour le cache avec le nouveau statut
      queryClient.setQueryData<Kidoo[]>(KIDOOS_KEY, (old) => {
        return old?.map((kidoo) =>
          kidoo.id === id
            ? {
                ...kidoo,
                isConnected: data.isOnline,
                lastConnected: data.isOnline ? new Date().toISOString() : kidoo.lastConnected,
              }
            : kidoo
        );
      });
    },
    
    // Rollback en cas d'erreur
    onError: (err, id, context) => {
      if (context?.previousKidoos) {
        queryClient.setQueryData(KIDOOS_KEY, context.previousKidoos);
      }
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
    
    // Toujours refetch après pour avoir les données à jour
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KIDOOS_KEY });
    },
  });
}

/**
 * Hook pour supprimer un Kidoo (avec optimistic update)
 */
export function useDeleteKidoo() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => kidoosApi.delete(id),
    
    // Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: KIDOOS_KEY });
      
      const previousKidoos = queryClient.getQueryData<Kidoo[]>(KIDOOS_KEY);
      
      queryClient.setQueryData<Kidoo[]>(KIDOOS_KEY, (old) => {
        return old?.filter((kidoo) => kidoo.id !== id);
      });
      
      return { previousKidoos };
    },
    
    onError: (err, id, context) => {
      if (context?.previousKidoos) {
        queryClient.setQueryData(KIDOOS_KEY, context.previousKidoos);
      }
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KIDOOS_KEY });
    },
    
    onSuccess: () => {
      showToast.success({
        title: t('toast.success'),
        message: t('toast.deleted'),
      });
    },
  });
}
