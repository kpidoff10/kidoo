/**
 * Context NFC
 * Gère les opérations NFC et les Tags avec intégration React Query
 * Prend kidooId en props
 * Combine nfcManager (opérations BLE) et les hooks React Query (cache)
 * 
 * Usage:
 * ```tsx
 * <NFCProvider kidooId={kidoo.id}>
 *   <YourComponent />
 * </NFCProvider>
 * 
 * // Dans YourComponent:
 * const { tags, createTag, updateTag, deleteTag, writeTag } = useNFC();
 * ```
 */

import React, { createContext, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { nfcManager, type NFCWriteResult, type NFCReadResult } from '@/services/nfcManager';
import {
  useTagsByKidoo as useTagsByKidooHook,
  useCreateTag as useCreateTagHook,
  useUpdateTag as useUpdateTagHook,
  useDeleteTag as useDeleteTagHook,
  useCheckTagExists as useCheckTagExistsHook,
} from '@/hooks/useTags';
import type { CreateTagInput, UpdateTagInput } from '@/types/shared';

interface NFCContextValue {
  // kidooId du Context
  kidooId: string;

  // Tags du Kidoo (React Query)
  tags: {
    data: any;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };

  // Fonctions pour gérer les tags (utilisent les hooks React Query)
  createTag: (data: Omit<CreateTagInput, 'kidooId'>) => Promise<void>;
  updateTag: (tagId: string, data: UpdateTagInput) => Promise<void>;
  deleteTag: (tagId: string) => Promise<void>;

  // Fonction pour écrire un tag NFC (combine BLE + DB + cache)
  writeTag: (
    blockNumber?: number,
    tagName?: string,
    onProgress?: (state: 'creating' | 'writing' | 'updating' | 'written' | 'error', message?: string) => void
  ) => Promise<NFCWriteResult>;

  // Fonction pour lire un tag NFC (BLE pur)
  readTag: (
    blockNumber?: number,
    onProgress?: (state: 'reading' | 'read' | 'error', message?: string) => void
  ) => Promise<NFCReadResult>;

  // État des mutations
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isWriting: boolean;
}

const NFCContext = createContext<NFCContextValue | undefined>(undefined);

interface NFCProviderProps {
  kidooId: string;
  children: React.ReactNode;
}

export function NFCProvider({ kidooId, children }: NFCProviderProps) {
  const { user } = useAuth();

  // Hooks React Query
  const tagsQuery = useTagsByKidooHook(kidooId);
  const createTagMutation = useCreateTagHook();
  const updateTagMutation = useUpdateTagHook();
  const deleteTagMutation = useDeleteTagHook();

  // Fonction pour créer un tag (utilise le hook React Query)
  const createTag = useCallback(
    async (data: Omit<CreateTagInput, 'kidooId'>) => {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      await createTagMutation.mutateAsync({
        ...data,
        kidooId,
      });
    },
    [kidooId, user?.id, createTagMutation]
  );

  // Fonction pour mettre à jour un tag (utilise le hook React Query)
  const updateTag = useCallback(
    async (tagId: string, data: UpdateTagInput) => {
      await updateTagMutation.mutateAsync({ tagId, data });
    },
    [updateTagMutation]
  );

  // Fonction pour supprimer un tag (utilise le hook React Query)
  const deleteTag = useCallback(
    async (tagId: string) => {
      await deleteTagMutation.mutateAsync({ tagId, kidooId });
    },
    [kidooId, deleteTagMutation]
  );

  // Fonction pour écrire un tag NFC (combine nfcManager + hooks React Query)
  const writeTag = useCallback(
    async (
      blockNumber: number = 4,
      tagName?: string,
      onProgress?: (state: 'creating' | 'writing' | 'updating' | 'written' | 'error', message?: string) => void
    ): Promise<NFCWriteResult> => {
      if (!user?.id) {
        const error = 'Utilisateur non connecté';
        onProgress?.('error', error);
        return { success: false, error };
      }

      // Utiliser nfcManager.writeTag() qui appelle tagService (avec cache React Query)
      // Le cache sera automatiquement invalidé car tagService utilise queryClient
      return nfcManager.writeTag(kidooId, user.id, blockNumber, tagName, onProgress);
    },
    [kidooId, user?.id]
  );

  // Fonction pour lire un tag NFC (BLE pur)
  const readTag = useCallback(
    async (
      blockNumber: number = 4,
      onProgress?: (state: 'reading' | 'read' | 'error', message?: string) => void
    ): Promise<NFCReadResult> => {
      return nfcManager.readTag(blockNumber, onProgress);
    },
    []
  );

  const value: NFCContextValue = {
    kidooId,
    tags: {
      data: tagsQuery.data?.success ? tagsQuery.data.data : null,
      isLoading: tagsQuery.isLoading,
      error: tagsQuery.error,
      refetch: () => tagsQuery.refetch(),
    },
    createTag,
    updateTag,
    deleteTag,
    writeTag,
    readTag,
    isCreating: createTagMutation.isPending,
    isUpdating: updateTagMutation.isPending,
    isDeleting: deleteTagMutation.isPending,
    isWriting: false, // TODO: gérer l'état d'écriture si nécessaire
  };

  return <NFCContext.Provider value={value}>{children}</NFCContext.Provider>;
}

/**
 * Hook pour accéder au context NFC
 * @throws {Error} Si utilisé en dehors d'un NFCProvider
 */
export function useNFC() {
  const context = useContext(NFCContext);
  if (context === undefined) {
    throw new Error('useNFC must be used within a NFCProvider');
  }
  return context;
}
