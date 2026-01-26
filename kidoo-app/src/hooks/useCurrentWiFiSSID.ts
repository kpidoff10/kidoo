/**
 * Hook pour récupérer le SSID WiFi actuel
 * Utilise NetInfo pour obtenir le nom du réseau WiFi auquel l'appareil est connecté
 */

import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface UseCurrentWiFiSSIDReturn {
  /**
   * SSID du réseau WiFi actuel (null si non disponible ou non connecté)
   */
  ssid: string | null;
  
  /**
   * Indique si le SSID est en cours de chargement
   */
  isLoading: boolean;
}

/**
 * Récupère le SSID WiFi actuel via NetInfo
 * 
 * @example
 * ```tsx
 * const { ssid, isLoading } = useCurrentWiFiSSID();
 * 
 * if (ssid) {
 *   console.log('Connecté à:', ssid);
 * }
 * ```
 */
export function useCurrentWiFiSSID(): UseCurrentWiFiSSIDReturn {
  const [ssid, setSSID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fonction pour extraire le SSID depuis l'état NetInfo
    const extractSSID = (state: NetInfoState): string | null => {
      // Vérifier si on est connecté à un réseau WiFi
      if (state.type !== 'wifi' && state.type !== 'unknown') {
        return null;
      }

      // Sur iOS et Android, le SSID peut être dans state.details.ssid
      if (state.details && 'ssid' in state.details) {
        const wifiSSID = (state.details as { ssid?: string }).ssid;
        if (wifiSSID && wifiSSID.trim().length > 0) {
          return wifiSSID;
        }
      }

      return null;
    };

    // Récupérer l'état initial
    NetInfo.fetch().then((state) => {
      const currentSSID = extractSSID(state);
      setSSID(currentSSID);
      setIsLoading(false);
    });

    // Écouter les changements de connexion
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const currentSSID = extractSSID(state);
      setSSID(currentSSID);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { ssid, isLoading };
}
