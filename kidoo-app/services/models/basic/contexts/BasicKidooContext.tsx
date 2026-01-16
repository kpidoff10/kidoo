/**
 * Context BasicKidoo
 * Hérite du Context Kidoo et ajoute les fonctions spécifiques au modèle Basic
 * 
 * Usage:
 * ```tsx
 * <KidooProvider kidoo={kidoo} autoConnect={true}>
 *   <BasicKidooProvider>
 *     <YourComponent />
 *   </BasicKidooProvider>
 * </KidooProvider>
 * 
 * // Dans YourComponent:
 * const { kidoo, isConnected, setBrightness, setColor, setSleepTimeout } = useBasicKidoo();
 * ```
 */

import React, { createContext, useContext, useCallback } from 'react';
import { useKidoo, type KidooContextValue } from '../../common/contexts/KidooContext';
import { useAuth } from '@/contexts/AuthContext';
import { bleManager } from '@/services/bte';
import { useResponseSyncMiddleware } from '@/hooks/use-response-sync-middleware';
import {
  BasicBluetoothCommandType,
  type CommandResponse,
  type BrightnessCommand,
  type ColorCommand,
  type EffectCommand,
  type SleepTimeoutCommand,
  type SleepConfigCommand,
} from '@/types/bluetooth';
import type { BrightnessOptions, ColorOptions, EffectOptions, SleepModeOptions, SleepTimeoutOptions } from '@/services/models/basic/command';

interface BasicKidooContextValue extends KidooContextValue {
  // Fonctions spécifiques au modèle Basic
  setBrightness: (brightness: BrightnessOptions) => Promise<CommandResponse<BrightnessCommand>>;
  getBrightness: () => Promise<number>;
  setColor: (color: ColorOptions) => Promise<CommandResponse<ColorCommand>>;
  setEffect: (effect: EffectOptions) => Promise<CommandResponse<EffectCommand>>;
  setSleepTimeout: (timeout: SleepTimeoutOptions) => Promise<CommandResponse<SleepTimeoutCommand>>;
  getSleepTimeout: () => Promise<number>;
  configureSleepMode: (options: SleepModeOptions) => Promise<CommandResponse<SleepConfigCommand>>;
  reset: () => Promise<boolean>;
}

const BasicKidooContext = createContext<BasicKidooContextValue | undefined>(undefined);

interface BasicKidooProviderProps {
  children: React.ReactNode;
}

export function BasicKidooProvider({ children }: BasicKidooProviderProps) {
  // Utiliser le Context Kidoo parent pour obtenir les fonctions de base
  const kidooContext = useKidoo();
  const { user } = useAuth();
  const userId = user?.id;
  // Destructurer les propriétés nécessaires pour avoir des références stables
  const { isConnected, sendCommandAndWait, kidoo } = kidooContext;
  
  // Activer le middleware de synchronisation automatique des réponses BLE
  // Le middleware gère automatiquement la synchronisation de toutes les réponses BLE,
  // y compris STORAGE_GET, BRIGHTNESS_SET, SLEEP_TIMEOUT_SET, etc.
  useResponseSyncMiddleware({
    kidoo,
    userId,
    isConnected,
  });

  // Définir la luminosité
  const setBrightness = useCallback(
    async (brightness: BrightnessOptions): Promise<CommandResponse<BrightnessCommand>> => {
      if (!isConnected) {
        throw new Error('Le Kidoo n\'est pas connecté');
      }

      if (brightness.percent < 10 || brightness.percent > 100) {
        throw new Error('La luminosité doit être entre 10 et 100');
      }

      const response = await sendCommandAndWait({
        command: BasicBluetoothCommandType.BRIGHTNESS,
        percent: brightness.percent,
      });

      // La synchronisation avec le serveur est maintenant gérée automatiquement
      // via le listener de réponses dans useEffect

      return response;
    },
    [isConnected, sendCommandAndWait]
  );

  // Obtenir la luminosité actuelle
  const getBrightness = useCallback(async (): Promise<number> => {
    if (!isConnected) {
      throw new Error('Le Kidoo n\'est pas connecté');
    }

    const response = await bleManager.getBrightness({
      timeout: 10000, // Augmenter le timeout à 10 secondes
      timeoutErrorMessage: 'Timeout: aucune réponse reçue pour BRIGHTNESS_GET',
    });

    if (response.status === 'success' && typeof response.brightness === 'number') {
      return response.brightness;
    }

    throw new Error(response.error || 'Erreur lors de la récupération de la luminosité');
  }, [isConnected]);

  // Définir une couleur RGB
  const setColor = useCallback(
    (color: ColorOptions): Promise<CommandResponse<ColorCommand>> => {
      if (!isConnected) {
        throw new Error('Le Kidoo n\'est pas connecté');
      }

      if (
        color.r < 0 || color.r > 255 ||
        color.g < 0 || color.g > 255 ||
        color.b < 0 || color.b > 255
      ) {
        throw new Error('Les valeurs RGB doivent être entre 0 et 255');
      }

      return sendCommandAndWait({
        command: BasicBluetoothCommandType.COLOR,
        r: color.r,
        g: color.g,
        b: color.b,
      });
    },
    [isConnected, sendCommandAndWait]
  );

  // Définir un effet LED
  const setEffect = useCallback(
    (effect: EffectOptions): Promise<CommandResponse<EffectCommand>> => {
      if (!isConnected) {
        throw new Error('Le Kidoo n\'est pas connecté');
      }

      return sendCommandAndWait({
        command: BasicBluetoothCommandType.EFFECT,
        effect: effect.effect,
      });
    },
    [isConnected, sendCommandAndWait]
  );

  // Définir le timeout de sommeil
  const setSleepTimeout = useCallback(
    async (timeout: SleepTimeoutOptions): Promise<CommandResponse<SleepTimeoutCommand>> => {
      if (!isConnected) {
        throw new Error('Le Kidoo n\'est pas connecté');
      }

      if (timeout.timeout < 5000 || timeout.timeout > 300000) {
        throw new Error('Le timeout doit être entre 5000 et 300000 ms (5 secondes à 5 minutes)');
      }

      const response = await sendCommandAndWait({
        command: BasicBluetoothCommandType.SLEEP_TIMEOUT,
        timeout: timeout.timeout,
      });

      // La synchronisation avec le serveur est maintenant gérée automatiquement
      // via le listener de réponses dans useEffect

      return response;
    },
    [isConnected, sendCommandAndWait]
  );

  // Obtenir le timeout de sommeil actuel
  const getSleepTimeout = useCallback(async (): Promise<number> => {
    if (!isConnected) {
      throw new Error('Le Kidoo n\'est pas connecté');
    }

    const response = await sendCommandAndWait({
      command: BasicBluetoothCommandType.GET_SLEEP_TIMEOUT,
    }, {
      timeout: 5000,
      timeoutErrorMessage: 'Timeout: aucune réponse reçue pour SLEEP_TIMEOUT_GET',
    });

    if (response.status === 'success' && typeof response.timeout === 'number') {
      return response.timeout;
    }

    throw new Error(response.error || 'Erreur lors de la récupération du timeout de sommeil');
  }, [isConnected, sendCommandAndWait]);

  // Configurer le mode sommeil
  const configureSleepMode = useCallback(
    (options: SleepModeOptions): Promise<CommandResponse<SleepConfigCommand>> => {
      if (!isConnected) {
        throw new Error('Le Kidoo n\'est pas connecté');
      }

      if (options.timeoutMs < 0 || options.transitionMs < 0) {
        throw new Error('Les valeurs de timeout doivent être positives');
      }

      if (options.transitionMs >= options.timeoutMs) {
        throw new Error('Le timeout de transition doit être inférieur au timeout de sommeil');
      }

      return sendCommandAndWait({
        command: BasicBluetoothCommandType.SLEEP_CONFIG,
        timeoutMs: options.timeoutMs,
        transitionMs: options.transitionMs,
      });
    },
    [isConnected, sendCommandAndWait]
  );

  // Réinitialiser le Kidoo
  const reset = useCallback((): Promise<boolean> => {
    return bleManager.reset();
  }, []);

  // Note: La synchronisation du stockage est maintenant gérée automatiquement par le middleware
  // Quand getStorage() est appelé (par exemple depuis storage-info.tsx), l'ESP32 répond avec STORAGE_GET,
  // et le middleware intercepte cette réponse et synchronise automatiquement avec le serveur.
  // Plus besoin de synchronisation manuelle ici.

  // Créer la valeur du Context en combinant KidooContext + fonctions Basic
  const value: BasicKidooContextValue = {
    // Spread toutes les propriétés de KidooContext
    ...kidooContext,
    // Ajouter les fonctions spécifiques au modèle Basic
    setBrightness,
    getBrightness,
    setColor,
    setEffect,
    setSleepTimeout,
    getSleepTimeout,
    configureSleepMode,
    reset,
  };

  return <BasicKidooContext.Provider value={value}>{children}</BasicKidooContext.Provider>;
}

/**
 * Hook pour accéder au context BasicKidoo
 * @throws {Error} Si utilisé en dehors d'un BasicKidooProvider (qui doit être dans un KidooProvider)
 */
export function useBasicKidoo() {
  const context = useContext(BasicKidooContext);
  if (context === undefined) {
    throw new Error('useBasicKidoo must be used within a BasicKidooProvider (which must be inside a KidooProvider)');
  }
  return context;
}
