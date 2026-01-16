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
 *   disconnect,
 *   getSystemInfo,
 *   getStorage,
 *   updateKidoo,
 *   deleteKidoo 
 * } = useKidoo();
 * 
 * // Note: La connexion est automatique à l'initialisation du contexte
 * ```
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { bleManager, type BLEDevice } from '@/services/bte';
import { useKidooById, useUpdateKidoo, useDeleteKidoo } from '@/services/models/common/hooks/useKidoos';
import { useTagsByKidoo } from '@/hooks/useTags';
import { useAuth } from '@/contexts/AuthContext';
import { CommonKidooActions } from '@/services/models/common/command';
import { nfcManager, type NFCReadResult, type NFCWriteResult } from '@/services/nfcManager';
import type { TypedBluetoothCommand, CommandResponse, SystemInfoResponse, StorageGetResponse } from '@/types/bluetooth';
import type { Kidoo, UpdateKidooInput } from '@/types/shared';
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
  disconnect: () => Promise<void>; // Permet une déconnexion manuelle si nécessaire
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
  
  // Tags du Kidoo (query React Query)
  tagsQuery: ReturnType<typeof useTagsByKidoo>;
  
  // Fonction de refresh pour actualiser le Kidoo et les données associées (tags, etc.)
  refresh: () => Promise<void>;
}

const KidooContext = createContext<KidooContextValue | undefined>(undefined);

interface KidooProviderProps {
  kidooId: string;
  children: React.ReactNode;
  autoConnect?: boolean; // Se connecter automatiquement au montage (défaut: true)
}

export function KidooProvider({ kidooId, children, autoConnect = true }: KidooProviderProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const userId = user?.id;
  const [isConnecting, setIsConnecting] = useState(false);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSendingCommand, setIsSendingCommand] = useState(false);
  const hasConnectedRef = useRef(false);
  const hasShownOfflineToastRef = useRef(false);
  const lastConnectionAttemptRef = useRef<number>(0);
  const connectionRetryCountRef = useRef<number>(0);

  // Récupérer le Kidoo via React Query (seulement si userId est disponible)
  const { data: kidooQuery, isLoading: isLoadingKidoo, error: kidooError, refetch: refetchKidoo } = useKidooById(kidooId, !!userId);

  // Récupérer les tags du Kidoo
  const tagsQuery = useTagsByKidoo(kidooId, !!userId);

  // Hooks React Query pour les opérations CRUD
  const updateKidooMutation = useUpdateKidoo();
  const deleteKidooMutation = useDeleteKidoo();

  // Extraire le Kidoo depuis la réponse
  const kidoo = kidooQuery?.success ? kidooQuery.data : null;

  // Vérifier périodiquement l'état de connexion pour mettre à jour l'UI
  useEffect(() => {
    let wasConnected = bleManager.isConnected();
    
    const checkConnection = () => {
      const connected = bleManager.isConnected();
      setIsConnected(connected);
      
      // Si on passe de déconnecté à connecté, afficher un toast success
      if (connected && !wasConnected && hasShownOfflineToastRef.current) {
        Toast.show({
          type: 'success',
          text1: t('kidoos.status.connected', 'Kidoo connecté'),
          text2: t('kidoos.config.online.message', 'La connexion Bluetooth est rétablie.'),
          visibilityTime: 3000,
          position: 'bottom',
        });
        hasShownOfflineToastRef.current = false;
      }
      
      // Réinitialiser le flag de toast si on se connecte
      if (connected) {
        hasShownOfflineToastRef.current = false;
      }
      
      wasConnected = connected;
    };

    checkConnection();
    const interval = setInterval(checkConnection, 500); // Vérifier toutes les 500ms

    return () => clearInterval(interval);
  }, [t]);


  // Connexion automatique au montage avec retry intelligent
  useEffect(() => {
    if (!kidoo || !autoConnect || hasConnectedRef.current || isConnecting || bleManager.isConnected()) {
      return;
    }

    // Éviter les tentatives trop fréquentes (minimum 10 secondes entre chaque tentative)
    const now = Date.now();
    const timeSinceLastAttempt = now - lastConnectionAttemptRef.current;
    const minDelay = 10000; // 10 secondes minimum entre les tentatives

    if (timeSinceLastAttempt < minDelay) {
      return;
    }

    // Backoff exponentiel : augmenter le délai après chaque échec
    const backoffDelay = Math.min(1000 * Math.pow(2, connectionRetryCountRef.current), 60000); // Max 60 secondes
    if (timeSinceLastAttempt < backoffDelay) {
      return;
    }

    console.log('[KidooContext] Tentative de connexion automatique');
    lastConnectionAttemptRef.current = now;
    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidoo, autoConnect, isConnecting, isConnected]);


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
        
        // Afficher un toast success si on avait affiché le warning avant
        if (hasShownOfflineToastRef.current) {
          Toast.show({
            type: 'success',
            text1: t('kidoos.status.connected', 'Kidoo connecté'),
            text2: t('kidoos.config.online.message', 'La connexion Bluetooth est rétablie.'),
            visibilityTime: 3000,
            position: 'bottom',
          });
        }
        
        // Réinitialiser les flags si on se connecte avec succès
        hasShownOfflineToastRef.current = false;
        connectionRetryCountRef.current = 0; // Réinitialiser le compteur de retry
        lastConnectionAttemptRef.current = 0; // Réinitialiser le timestamp
      } else {
        const errorMessage = result.error || 'Erreur lors de la connexion Bluetooth';
        setBluetoothError(errorMessage);
        
        // Incrémenter le compteur de retry pour le backoff exponentiel
        connectionRetryCountRef.current += 1;
        
      // Afficher le toast warning si la connexion échoue et qu'on ne l'a pas déjà affiché
      if (!hasShownOfflineToastRef.current) {
        Toast.show({
          type: 'warning',
          text1: t('kidoos.config.offline.title', 'Kidoo non connecté'),
          text2: t('kidoos.config.offline.message', 'Les informations sauvegardées seront envoyées au Kidoo une fois qu\'il sera connecté en Bluetooth.'),
          visibilityTime: 4000,
          position: 'bottom',
        });
        hasShownOfflineToastRef.current = true;
      }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion Bluetooth';
      setBluetoothError(errorMessage);
      
      // Incrémenter le compteur de retry pour le backoff exponentiel
      connectionRetryCountRef.current += 1;
      
        // Afficher le toast warning si la connexion échoue et qu'on ne l'a pas déjà affiché
        if (!hasShownOfflineToastRef.current) {
          Toast.show({
            type: 'warning',
            text1: t('kidoos.config.offline.title', 'Kidoo non connecté'),
            text2: t('kidoos.config.offline.message', 'Les informations sauvegardées seront envoyées au Kidoo une fois qu\'il sera connecté en Bluetooth.'),
            visibilityTime: 4000,
            position: 'bottom',
          });
          hasShownOfflineToastRef.current = true;
        }
    } finally {
      setIsConnecting(false);
    }
  }, [kidoo, isConnecting, t]);

  // Scanner en continu pour détecter automatiquement quand le device devient disponible
  useEffect(() => {
    if (!kidoo || !autoConnect) {
      bleManager.stopContinuousScan();
      return;
    }

    // Si déjà connecté, ne pas scanner
    if (bleManager.isConnected() || isConnecting) {
      bleManager.stopContinuousScan();
      return;
    }

    console.log('[KidooContext] Démarrage du scan continu pour détecter le device:', kidoo.deviceId);
    
    // Démarrer le scan continu - se connectera automatiquement quand le device est détecté
    const stopScan = bleManager.startContinuousScan(kidoo.deviceId, (deviceId) => {
      console.log('[KidooContext] Device détecté, tentative de connexion automatique:', deviceId);
      
      // Vérifier à nouveau l'état actuel (pas celui de la closure)
      const currentlyConnecting = isConnecting;
      const currentlyConnected = bleManager.isConnected();
      
      console.log('[KidooContext] État actuel - isConnecting:', currentlyConnecting, 'isConnected:', currentlyConnected);
      
      // Vérifier qu'on n'est pas déjà en train de se connecter ou connecté
      if (!currentlyConnecting && !currentlyConnected && kidoo) {
        console.log('[KidooContext] Déclenchement de la connexion...');
        // Utiliser setTimeout pour s'assurer que le callback est exécuté après l'arrêt du scan
        setTimeout(() => {
          connect();
        }, 200);
      } else {
        console.log('[KidooContext] Connexion ignorée - déjà en cours ou connecté');
      }
    });

    return () => {
      console.log('[KidooContext] Arrêt du scan continu');
      stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidoo?.deviceId, autoConnect, isConnecting, isConnected, connect]);

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
      
      // Si pas de connexion Bluetooth, afficher un message warning
      if (!bleManager.isConnected() && !hasShownOfflineToastRef.current) {
        Toast.show({
          type: 'warning',
          text1: t('kidoos.config.offline.title', 'Kidoo non connecté'),
          text2: t('kidoos.config.offline.message', 'Les informations sauvegardées seront envoyées au Kidoo une fois qu\'il sera connecté en Bluetooth.'),
          visibilityTime: 4000,
          position: 'bottom',
        });
        hasShownOfflineToastRef.current = true;
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
    [kidoo, updateKidooMutation, t]
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
        const { CommonSystemAction } = await import('@/services/models/common/command/common-command-system');
        const result = await CommonSystemAction.getSystemInfo(options?.timeout || 30000);
        
        if (result.success && result.data) {
          const response = result.data as SystemInfoResponse;
          setBluetoothError(null);
          return response;
        }
        
        throw new Error(result.error || 'Erreur lors de la récupération des informations système');
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
  // Utilise BasicStorageAction qui est disponible via le modèle Basic
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
        // Importer dynamiquement pour éviter les dépendances circulaires
        const { BasicStorageAction } = await import('@/services/models/basic/command/basic-command-storage');
        const result = await BasicStorageAction.getStorage();
        
        if (result.success && result.data) {
          const response = result.data as StorageGetResponse;
          setBluetoothError(null);
          return response;
        }
        
        throw new Error(result.error || 'Erreur lors de la récupération des informations de stockage');
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


  // Fonction de refresh pour actualiser le Kidoo uniquement
  const refresh = useCallback(async () => {
    await refetchKidoo();
  }, [refetchKidoo]);

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
    tagsQuery,
    refresh,
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
