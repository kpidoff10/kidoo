/**
 * Context Kidoo
 * Gère les informations du Kidoo actuel, la connexion BLE et les opérations CRUD de base
 * Créé par les écrans qui affichent un Kidoo spécifique
 * 
 * Usage:
 * ```tsx
 * <KidooProvider kidoo={kidoo} autoConnect={true}>
 *   <YourComponent />
 * </KidooProvider>
 * 
 * // Dans YourComponent:
 * const { 
 *   kidoo, 
 *   kidooId, 
 *   isConnected, 
 *   connect, 
 *   disconnect,
 *   getSystemInfo,
 *   getStorage,
 *   updateKidoo,
 *   deleteKidoo 
 * } = useKidoo();
 * ```
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { bleManager, type BLEDevice } from '@/services/bte';
import { useKidooById, useUpdateKidoo, useDeleteKidoo } from '@/hooks/useKidoos';
import { useAuth } from '@/contexts/AuthContext';
import { CommonKidooActions } from '@/services/kidoo-actions/common';
import { nfcManager, type NFCReadResult, type NFCWriteResult } from '@/services/nfcManager';
import type { Kidoo } from '@/services/kidooService';
import type { TypedBluetoothCommand, CommandResponse, SystemInfoResponse, StorageGetResponse } from '@/types/bluetooth';
import type { UpdateKidooInput } from '@/types/shared';
import type { ApiResponse } from '@/services/api';

// Réexporter les types NFC pour faciliter leur utilisation
export type { NFCReadResult, NFCWriteResult };

export interface KidooContextValue {
  // Kidoo complet
  kidoo: Kidoo;
  
  // ID du Kidoo (pour faciliter l'accès)
  kidooId: string;
  
  // Autres propriétés utiles
  kidooName: string;
  kidooModel: string;

  // Connexion BLE
  isConnected: boolean;
  isConnecting: boolean;
  bluetoothError: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  // Envoyer une commande typée et attendre la réponse typée
  sendCommandAndWait: <T extends TypedBluetoothCommand>(
    command: T,
    options?: {
      timeout?: number;
      timeoutErrorMessage?: string;
    }
  ) => Promise<CommandResponse<T>>;

  // Fonctions globales communes à tous les modèles
  getSystemInfo: (options?: {
    timeout?: number;
    timeoutErrorMessage?: string;
  }) => Promise<SystemInfoResponse>;
  getStorage: (options?: {
    timeout?: number;
    timeoutErrorMessage?: string;
  }) => Promise<StorageGetResponse>;

  // Opérations CRUD de base
  updateKidoo: (data: UpdateKidooInput) => Promise<ApiResponse<Kidoo>>;
  deleteKidoo: () => Promise<ApiResponse<null>>;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // État de chargement pour les commandes BLE
  isSendingCommand: boolean;
  
  // Commandes communes pour les tags NFC
  tagAddSuccess: () => Promise<void>;
  readNFCTag: (
    blockNumber?: number,
    onProgress?: (state: 'reading' | 'read' | 'error', message?: string) => void
  ) => Promise<NFCReadResult>;
  writeNFCTagId: (
    tagId: string,
    blockNumber?: number,
    onProgress?: (state: 'creating' | 'writing' | 'updating' | 'written' | 'error', message?: string) => void
  ) => Promise<NFCWriteResult>;
}

const KidooContext = createContext<KidooContextValue | undefined>(undefined);

interface KidooProviderProps {
  kidooId: string;
  children: React.ReactNode;
  autoConnect?: boolean; // Se connecter automatiquement au montage
}

export function KidooProvider({ kidooId, children, autoConnect = false }: KidooProviderProps) {
  const { user } = useAuth();
  const userId = user?.id;
  const [isConnecting, setIsConnecting] = useState(false);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSendingCommand, setIsSendingCommand] = useState(false);
  const hasConnectedRef = useRef(false);

  // Récupérer le Kidoo via React Query (seulement si userId est disponible)
  const { data: kidooQuery, isLoading: isLoadingKidoo, error: kidooError } = useKidooById(kidooId, !!userId);

  // Hooks React Query pour les opérations CRUD
  const updateKidooMutation = useUpdateKidoo();
  const deleteKidooMutation = useDeleteKidoo();

  // Extraire le Kidoo depuis la réponse
  const kidoo = kidooQuery?.success ? kidooQuery.data : null;

  // Vérifier périodiquement l'état de connexion pour mettre à jour l'UI
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(bleManager.isConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 500); // Vérifier toutes les 500ms

    return () => clearInterval(interval);
  }, []);

  // Connexion automatique au montage (seulement si le Kidoo est chargé)
  useEffect(() => {
    if (kidoo && autoConnect && !hasConnectedRef.current && !isConnecting && !bleManager.isConnected()) {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidoo, autoConnect, isConnecting]);

  const connect = useCallback(async () => {
    if (!kidoo || isConnecting || bleManager.isConnected()) {
      return;
    }

    setIsConnecting(true);
    setBluetoothError(null);

    try {
      const device: BLEDevice = {
        id: kidoo.deviceId,
        name: kidoo.name,
        deviceId: kidoo.deviceId,
      };

      const result = await bleManager.connect(device);

      if (result.success) {
        hasConnectedRef.current = true;
        setBluetoothError(null);
      } else {
        setBluetoothError(result.error || 'Erreur lors de la connexion Bluetooth');
      }
    } catch (err) {
      setBluetoothError(err instanceof Error ? err.message : 'Erreur lors de la connexion Bluetooth');
    } finally {
      setIsConnecting(false);
    }
  }, [kidoo, isConnecting]);

  const disconnect = useCallback(async () => {
    try {
      await bleManager.disconnect();
      hasConnectedRef.current = false;
      setBluetoothError(null);
    } catch (err) {
      console.error('[KidooContext] Erreur lors de la déconnexion:', err);
      setBluetoothError(err instanceof Error ? err.message : 'Erreur lors de la déconnexion');
    }
  }, []);

  const sendCommandAndWait = useCallback(
    async <T extends TypedBluetoothCommand>(
      command: T,
      options?: {
        timeout?: number;
        timeoutErrorMessage?: string;
      }
    ): Promise<CommandResponse<T>> => {
      if (!bleManager.isConnected()) {
        const error = 'Le Kidoo n\'est pas connecté';
        setBluetoothError(error);
        throw new Error(error);
      }

      setIsSendingCommand(true);
      try {
        const response = await bleManager.sendCommandAndWait(command, options);
        setBluetoothError(null);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'envoi de la commande';
        setBluetoothError(errorMessage);
        throw err;
      } finally {
        setIsSendingCommand(false);
      }
    },
    []
  );

  // Fonction pour mettre à jour le Kidoo
  const updateKidoo = useCallback(
    async (data: UpdateKidooInput): Promise<ApiResponse<Kidoo>> => {
      if (!kidoo) {
        throw new Error('Kidoo non chargé');
      }
      try {
        const result = await updateKidooMutation.mutateAsync({
          kidooId: kidoo.id,
          data,
        });
        return result;
      } catch (error) {
        // React Query gère déjà les erreurs, on les re-lance
        throw error;
      }
    },
    [kidoo, updateKidooMutation]
  );

  // Fonction pour supprimer le Kidoo
  const deleteKidoo = useCallback(
    async (): Promise<ApiResponse<null>> => {
      if (!kidoo) {
        throw new Error('Kidoo non chargé');
      }
      try {
        const result = await deleteKidooMutation.mutateAsync(kidoo.id);
        return result;
      } catch (error) {
        // React Query gère déjà les erreurs, on les re-lance
        throw error;
      }
    },
    [kidoo, deleteKidooMutation]
  );

  // Fonction pour obtenir les informations système
  const getSystemInfo = useCallback(
    async (options?: {
      timeout?: number;
      timeoutErrorMessage?: string;
    }): Promise<SystemInfoResponse> => {
      if (!bleManager.isConnected()) {
        const error = 'Le Kidoo n\'est pas connecté';
        setBluetoothError(error);
        throw new Error(error);
      }

      setIsSendingCommand(true);
      try {
        const response = await bleManager.getSystemInfo(options);
        setBluetoothError(null);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des informations système';
        setBluetoothError(errorMessage);
        throw err;
      } finally {
        setIsSendingCommand(false);
      }
    },
    []
  );

  // Envoyer la commande TAG_ADD_SUCCESS (commune à tous les modèles)
  const tagAddSuccess = useCallback(async (): Promise<void> => {
    if (!bleManager.isConnected()) {
      const error = 'Le Kidoo n\'est pas connecté';
      setBluetoothError(error);
      throw new Error(error);
    }

    setIsSendingCommand(true);
    try {
      const result = await CommonKidooActions.tagAddSuccess();
      setBluetoothError(null);
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de l\'envoi de la commande TAG_ADD_SUCCESS');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'envoi de la commande TAG_ADD_SUCCESS';
      setBluetoothError(errorMessage);
      throw err;
    } finally {
      setIsSendingCommand(false);
    }
  }, []);

  // Lire un tag NFC (commune à tous les modèles)
  const readNFCTag = useCallback(
    async (
      blockNumber: number = 4,
      onProgress?: (state: 'reading' | 'read' | 'error', message?: string) => void
    ): Promise<NFCReadResult> => {
      if (!bleManager.isConnected()) {
        const error = 'Le Kidoo n\'est pas connecté';
        setBluetoothError(error);
        return { success: false, error };
      }

      setIsSendingCommand(true);
      try {
        const result = await nfcManager.readTag(blockNumber, onProgress);
        setBluetoothError(null);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la lecture du tag NFC';
        setBluetoothError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSendingCommand(false);
      }
    },
    []
  );

  // Écrire un UUID sur un tag NFC (commune à tous les modèles)
  const writeNFCTagId = useCallback(
    async (
      tagId: string,
      blockNumber: number = 4,
      onProgress?: (state: 'creating' | 'writing' | 'updating' | 'written' | 'error', message?: string) => void
    ): Promise<NFCWriteResult> => {
      if (!bleManager.isConnected()) {
        const error = 'Le Kidoo n\'est pas connecté';
        setBluetoothError(error);
        return { success: false, error };
      }

      setIsSendingCommand(true);
      try {
        const result = await nfcManager.writeTagIdToNFC(tagId, blockNumber, onProgress);
        setBluetoothError(null);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'écriture sur le tag NFC';
        setBluetoothError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSendingCommand(false);
      }
    },
    []
  );

  // Fonction pour obtenir les informations de stockage
  const getStorage = useCallback(
    async (options?: {
      timeout?: number;
      timeoutErrorMessage?: string;
    }): Promise<StorageGetResponse> => {
      if (!bleManager.isConnected()) {
        const error = 'Le Kidoo n\'est pas connecté';
        setBluetoothError(error);
        throw new Error(error);
      }

      setIsSendingCommand(true);
      try {
        const response = await bleManager.getStorage(options);
        setBluetoothError(null);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des informations de stockage';
        setBluetoothError(errorMessage);
        throw err;
      } finally {
        setIsSendingCommand(false);
      }
    },
    []
  );

  // Ne pas rendre les enfants si le Kidoo n'est pas chargé
  if (isLoadingKidoo || !kidoo) {
    return null; // Ou un composant de chargement si nécessaire
  }

  // Gérer les erreurs de chargement
  if (kidooError) {
    console.error('[KidooContext] Erreur lors du chargement du Kidoo:', kidooError);
    return null; // Ou un composant d'erreur si nécessaire
  }

  const value: KidooContextValue = {
    kidoo,
    kidooId: kidoo.id,
    kidooName: kidoo.name,
    kidooModel: kidoo.model || 'classic',
    isConnected,
    isConnecting,
    bluetoothError,
    connect,
    disconnect,
    sendCommandAndWait,
    getSystemInfo,
    getStorage,
    updateKidoo,
    deleteKidoo,
    isUpdating: updateKidooMutation.isPending,
    isDeleting: deleteKidooMutation.isPending,
    isSendingCommand,
    tagAddSuccess,
    readNFCTag,
    writeNFCTagId,
  };

  return <KidooContext.Provider value={value}>{children}</KidooContext.Provider>;
}

/**
 * Hook pour accéder au context Kidoo
 * @throws {Error} Si utilisé en dehors d'un KidooProvider
 */
export function useKidoo() {
  const context = useContext(KidooContext);
  if (context === undefined) {
    throw new Error('useKidoo must be used within a KidooProvider');
  }
  return context;
}
