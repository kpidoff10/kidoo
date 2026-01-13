/**
 * Service WiFi
 * Gère les fonctionnalités WiFi comme la récupération du SSID actuel
 */

import NetInfo from '@react-native-community/netinfo';
import type { NetInfoState } from '@react-native-community/netinfo';

export interface WifiInfo {
  ssid: string | null;
  isConnected: boolean;
  type: string;
}

export interface WifiService {
  /**
   * Récupère le SSID du réseau WiFi actuellement connecté
   */
  getCurrentSSID: () => Promise<string | null>;
  
  /**
   * Récupère les informations complètes du WiFi actuel
   */
  getWifiInfo: () => Promise<WifiInfo>;
  
  /**
   * Vérifie si l'appareil est connecté à un réseau WiFi
   */
  isConnectedToWifi: () => Promise<boolean>;
  
  /**
   * Écoute les changements de connexion WiFi
   */
  addWifiListener: (callback: (wifiInfo: WifiInfo) => void) => () => void;
}

/**
 * Récupère le SSID du réseau WiFi actuellement connecté
 */
async function getCurrentSSID(): Promise<string | null> {
  try {
    const state = await NetInfo.fetch();
    
    if (state.type === 'wifi' && state.isConnected && state.details) {
      // Sur iOS et Android, le SSID est dans state.details.ssid
      const wifiDetails = state.details as { ssid?: string };
      return wifiDetails.ssid || null;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du SSID:', error);
    return null;
  }
}

/**
 * Récupère les informations complètes du WiFi actuel
 */
async function getWifiInfo(): Promise<WifiInfo> {
  try {
    const state = await NetInfo.fetch();
    
    if (state.type === 'wifi' && state.isConnected && state.details) {
      const wifiDetails = state.details as { ssid?: string };
      return {
        ssid: wifiDetails.ssid || null,
        isConnected: state.isConnected,
        type: state.type,
      };
    }
    
    return {
      ssid: null,
      isConnected: false,
      type: state.type,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des informations WiFi:', error);
    return {
      ssid: null,
      isConnected: false,
      type: 'unknown',
    };
  }
}

/**
 * Vérifie si l'appareil est connecté à un réseau WiFi
 */
async function isConnectedToWifi(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return state.type === 'wifi' && state.isConnected === true;
  } catch (error) {
    console.error('Erreur lors de la vérification de la connexion WiFi:', error);
    return false;
  }
}

/**
 * Écoute les changements de connexion WiFi
 * Retourne une fonction pour se désabonner
 */
function addWifiListener(callback: (wifiInfo: WifiInfo) => void): () => void {
  const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    if (state.type === 'wifi' && state.isConnected && state.details) {
      const wifiDetails = state.details as { ssid?: string };
      callback({
        ssid: wifiDetails.ssid || null,
        isConnected: state.isConnected,
        type: state.type,
      });
    } else {
      callback({
        ssid: null,
        isConnected: false,
        type: state.type,
      });
    }
  });

  return unsubscribe;
}

/**
 * Service WiFi exporté
 */
export const wifiService: WifiService = {
  getCurrentSSID,
  getWifiInfo,
  isConnectedToWifi,
  addWifiListener,
};
