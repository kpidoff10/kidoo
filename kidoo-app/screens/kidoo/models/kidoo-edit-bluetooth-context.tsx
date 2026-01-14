/**
 * Contexte Bluetooth pour les modales d'édition Kidoo
 * Gère automatiquement la connexion Bluetooth au Kidoo lors de l'ouverture de la modale
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { bleManager, type BLEDevice } from '@/services/bte';
import type { Kidoo } from '@/services/kidooService';

interface KidooEditBluetoothContextValue {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendCommand: (command: string) => Promise<boolean>;
}

const KidooEditBluetoothContext = createContext<KidooEditBluetoothContextValue | null>(null);

interface KidooEditBluetoothProviderProps {
  children: React.ReactNode;
  kidoo: Kidoo;
  autoConnect?: boolean; // Se connecter automatiquement au montage
}

export function KidooEditBluetoothProvider({
  children,
  kidoo,
  autoConnect = true,
}: KidooEditBluetoothProviderProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const hasConnectedRef = useRef(false);

  // Vérifier périodiquement l'état de connexion pour mettre à jour l'UI
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(bleManager.isConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 500); // Vérifier toutes les 500ms

    return () => clearInterval(interval);
  }, []);

  // Connexion automatique au montage
  useEffect(() => {
    if (autoConnect && !hasConnectedRef.current && !isConnecting && !bleManager.isConnected()) {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect, isConnecting]);

  // Ne pas déconnecter automatiquement au démontage
  // La déconnexion est gérée par l'écran parent ([id].tsx) pour éviter les conflits

  const connect = useCallback(async () => {
    if (isConnecting || bleManager.isConnected()) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const device: BLEDevice = {
        id: kidoo.deviceId,
        name: kidoo.name,
        deviceId: kidoo.deviceId,
      };

      const result = await bleManager.connect(device);

      if (result.success) {
        hasConnectedRef.current = true;
        setError(null);
      } else {
        setError(result.error || 'Erreur lors de la connexion Bluetooth');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion Bluetooth');
    } finally {
      setIsConnecting(false);
    }
  }, [kidoo.deviceId, kidoo.name, isConnecting]);

  const disconnect = useCallback(async () => {
    try {
      await bleManager.disconnect();
      hasConnectedRef.current = false;
      setError(null);
    } catch (err) {
      console.error('[KidooEditBluetoothContext] Erreur lors de la déconnexion:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la déconnexion');
    }
  }, []);

  const sendCommand = useCallback(async (command: string): Promise<boolean> => {
    if (!bleManager.isConnected()) {
      setError('Le Kidoo n\'est pas connecté');
      return false;
    }

    try {
      const success = await bleManager.sendCommand(command);
      if (!success) {
        setError('Erreur lors de l\'envoi de la commande');
      } else {
        setError(null);
      }
      return success;
    } catch (err) {
      console.error('[KidooEditBluetoothContext] Erreur envoi commande:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi de la commande');
      return false;
    }
  }, []);

  const value: KidooEditBluetoothContextValue = {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendCommand,
  };

  return (
    <KidooEditBluetoothContext.Provider value={value}>
      {children}
    </KidooEditBluetoothContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte Bluetooth dans les modales d'édition
 */
export function useKidooEditBluetooth(): KidooEditBluetoothContextValue {
  const context = useContext(KidooEditBluetoothContext);
  if (!context) {
    throw new Error('useKidooEditBluetooth must be used within KidooEditBluetoothProvider');
  }
  return context;
}
