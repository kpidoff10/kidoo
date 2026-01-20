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
      showToast.success({
        title: t('toast.success'),
        message: t('toast.saved'),
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
