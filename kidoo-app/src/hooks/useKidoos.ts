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
 * Hook pour contrôler manuellement la routine de coucher (Dream)
 */
export function useControlDreamBedtime() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      id,
      action,
    }: {
      id: string;
      action: 'start' | 'stop';
    }) => kidoosApi.controlDreamBedtime(id, action),
    onError: () => {
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
    onSuccess: (data, variables) => {
      showToast.success({
        title: t('toast.success'),
        message: variables.action === 'start' 
          ? t('kidoos.dream.bedtime.started', { defaultValue: 'Routine démarrée' })
          : t('kidoos.dream.bedtime.stopped', { defaultValue: 'Routine arrêtée' }),
      });
    },
  });
}

/**
 * Hook pour arrêter la routine active (bedtime ou wakeup) (Dream)
 */
export function useStopDreamRoutine() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => kidoosApi.stopDreamRoutine(id),
    onError: () => {
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
    onSuccess: () => {
      showToast.success({
        title: t('toast.success'),
        message: t('kidoos.dream.routine.stopped', { defaultValue: 'Routine arrêtée' }),
      });
    },
  });
}

/**
 * Hook pour tester la configuration de l'heure de coucher (Dream)
 */
export function useTestDreamBedtime() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      id,
      action,
      params,
    }: {
      id: string;
      action: 'start' | 'stop';
      params?: {
        hour?: number;
        minute?: number;
        color?: string;
        brightness?: number;
      };
    }) => kidoosApi.testDreamBedtime(id, action, params),
    onError: () => {
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
  });
}

/**
 * Hook pour tester la configuration de l'heure de réveil (Dream)
 */
export function useTestDreamWakeup() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({
      id,
      action,
      params,
    }: {
      id: string;
      action: 'start' | 'stop';
      params?: {
        hour?: number;
        minute?: number;
        color?: string;
        brightness?: number;
      };
    }) => kidoosApi.testDreamWakeup(id, action, params),
    onError: () => {
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
  });
}

/**
 * Hook pour mettre à jour la configuration de l'heure de coucher (Dream)
 * (avec optimistic update)
 */
export function useUpdateDreamBedtimeConfig() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Helper pour convertir la couleur hex en RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 107, b: 107 }; // Couleur par défaut
  };

  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: {
        weekdaySchedule?: Record<string, { hour: number; minute: number; activated: boolean }>;
        color?: string;
        effect?: string;
        brightness: number;
        nightlightAllNight: boolean;
      }
    }) => kidoosApi.updateDreamBedtimeConfig(id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      const queryKey = [...KIDOOS_KEY, id, 'dream-bedtime-config'];
      
      // Annuler les queries en cours
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot de l'état précédent
      const previousData = queryClient.getQueryData(queryKey);
      
      // Mise à jour optimiste
      const optimisticData: any = {
        brightness: data.brightness,
        nightlightAllNight: data.nightlightAllNight,
      };
      
      // Si une couleur est fournie, l'utiliser
      if (data.color) {
        const rgb = hexToRgb(data.color);
        optimisticData.colorR = rgb.r;
        optimisticData.colorG = rgb.g;
        optimisticData.colorB = rgb.b;
      }
      
      // Si un effet est fourni, l'utiliser
      if (data.effect) {
        optimisticData.effect = data.effect === 'none' ? null : data.effect;
      }
      
      // Ajouter weekdaySchedule si présent
      if (data.weekdaySchedule) {
        optimisticData.weekdaySchedule = data.weekdaySchedule;
      }
      
      queryClient.setQueryData(queryKey, optimisticData);
      
      return { previousData };
    },
    
    // Pas de toast de succès - l'écran se ferme immédiatement grâce à l'optimistic update
    
    // Rollback en cas d'erreur
    onError: (error, variables, context) => {
      const queryKey = [...KIDOOS_KEY, variables.id, 'dream-bedtime-config'];
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
    
    // Toujours refetch après pour synchroniser avec le serveur
    onSettled: (data, error, variables) => {
      const queryKey = [...KIDOOS_KEY, variables.id, 'dream-bedtime-config'];
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * Hook pour récupérer la configuration de l'heure de réveil (Dream)
 */
export function useDreamWakeupConfig(kidooId: string) {
  return useQuery({
    queryKey: [...KIDOOS_KEY, kidooId, 'dream-wakeup-config'],
    queryFn: () => kidoosApi.getDreamWakeupConfig(kidooId),
    enabled: !!kidooId,
  });
}

/**
 * Hook pour mettre à jour la configuration de l'heure de réveil (Dream)
 * (avec optimistic update)
 */
export function useUpdateDreamWakeupConfig() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Helper pour convertir la couleur hex en RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 200, b: 100 }; // Couleur par défaut (jaune doux)
  };

  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: {
        weekdaySchedule?: Record<string, { hour: number; minute: number }>;
        color: string;
        brightness: number;
      }
    }) => kidoosApi.updateDreamWakeupConfig(id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      const queryKey = [...KIDOOS_KEY, id, 'dream-wakeup-config'];
      
      // Annuler les queries en cours
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot de l'état précédent
      const previousData = queryClient.getQueryData(queryKey);
      
      // Mise à jour optimiste
      const rgb = hexToRgb(data.color);
      const optimisticData: any = {
        colorR: rgb.r,
        colorG: rgb.g,
        colorB: rgb.b,
        brightness: data.brightness,
      };
      
      // Ajouter weekdaySchedule si présent
      if (data.weekdaySchedule) {
        optimisticData.weekdaySchedule = data.weekdaySchedule;
      }
      
      queryClient.setQueryData(queryKey, optimisticData);
      
      return { previousData };
    },
    
    // Pas de toast de succès - l'écran se ferme immédiatement grâce à l'optimistic update
    
    // Rollback en cas d'erreur
    onError: (error, variables, context) => {
      const queryKey = [...KIDOOS_KEY, variables.id, 'dream-wakeup-config'];
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    },
    
    // Toujours refetch après pour synchroniser avec le serveur
    onSettled: (data, error, variables) => {
      const queryKey = [...KIDOOS_KEY, variables.id, 'dream-wakeup-config'];
      queryClient.invalidateQueries({ queryKey });
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
 * Hook pour mettre à jour la luminosité générale d'un Kidoo (avec optimistic update)
 */
export function useUpdateBrightness() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, brightness }: { id: string; brightness: number }) =>
      kidoosApi.updateBrightness(id, brightness),
    
    // Pas d'optimistic update car la luminosité est envoyée en temps réel via PubNub
    // On laisse le serveur gérer la mise à jour
    
    onError: () => {
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
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
