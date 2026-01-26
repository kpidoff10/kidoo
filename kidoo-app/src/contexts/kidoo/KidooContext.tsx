/**
 * Kidoo Context
 * Gestion des Kidoos
 */

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { Kidoo } from '@/api';
import { useKidoos, useKidoo, useCreateKidoo, useUpdateKidoo, useKidooCheckOnline, useDeleteKidoo } from '@/hooks/useKidoos';
import { getModelHandler, ModelHandler } from './modelHandlers';

interface KidooContextType {
  // Données
  kidoos: Kidoo[] | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  error: Error | null;
  
  // Actions
  refetch: () => void;
  createKidoo: ReturnType<typeof useCreateKidoo>;
  updateKidoo: ReturnType<typeof useUpdateKidoo>;
  checkOnline: ReturnType<typeof useKidooCheckOnline>;
  deleteKidoo: ReturnType<typeof useDeleteKidoo>;
  
  // Utilitaires
  getKidooById: (id: string) => Kidoo | undefined;
  hasKidoos: boolean;
  
  // Handlers de modèles
  getModelHandler: (model: string) => ModelHandler;
  getKidooModelHandler: (kidooId: string) => ModelHandler | undefined;
}

const KidooContext = createContext<KidooContextType | undefined>(undefined);

interface KidooProviderProps {
  children: React.ReactNode;
}

export function KidooProvider({ children }: KidooProviderProps) {
  const { data: kidoos, isLoading, isRefetching, error, refetch } = useKidoos();
  const createKidoo = useCreateKidoo();
  const updateKidoo = useUpdateKidoo();
  const checkOnline = useKidooCheckOnline();
  const deleteKidoo = useDeleteKidoo();

  // Fonction utilitaire pour récupérer un Kidoo par ID
  const getKidooById = useMemo(() => {
    return (id: string): Kidoo | undefined => {
      return kidoos?.find((kidoo) => kidoo.id === id);
    };
  }, [kidoos]);

  // Vérifier si l'utilisateur a des Kidoos
  const hasKidoos = useMemo(() => {
    return (kidoos?.length ?? 0) > 0;
  }, [kidoos]);

  // Fonction pour obtenir le handler d'un modèle
  const getModelHandlerFn = useCallback((model: string): ModelHandler => {
    return getModelHandler(model);
  }, []);

  // Fonction pour obtenir le handler d'un Kidoo spécifique
  const getKidooModelHandlerFn = useCallback((kidooId: string): ModelHandler | undefined => {
    const kidoo = kidoos?.find((k) => k.id === kidooId);
    if (!kidoo) return undefined;
    return getModelHandler(kidoo.model);
  }, [kidoos]);

  const value = useMemo<KidooContextType>(
    () => ({
      kidoos,
      isLoading,
      isRefetching,
      error: error as Error | null,
      refetch,
      createKidoo,
      updateKidoo,
      checkOnline,
      deleteKidoo,
      getKidooById,
      hasKidoos,
      getModelHandler: getModelHandlerFn,
      getKidooModelHandler: getKidooModelHandlerFn,
    }),
    [kidoos, isLoading, isRefetching, error, refetch, createKidoo, updateKidoo, checkOnline, deleteKidoo, getKidooById, hasKidoos, getModelHandlerFn, getKidooModelHandlerFn]
  );

  return <KidooContext.Provider value={value}>{children}</KidooContext.Provider>;
}

export function useKidooContext(): KidooContextType {
  const context = useContext(KidooContext);
  if (context === undefined) {
    throw new Error('useKidooContext must be used within a KidooProvider');
  }
  return context;
}
