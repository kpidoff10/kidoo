/**
 * Secure Storage Utilities
 * Gestion sécurisée des tokens et données sensibles
 * Avec fallback localStorage pour le web
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'kidoo_access_token',
  REFRESH_TOKEN: 'kidoo_refresh_token',
  USER_DATA: 'kidoo_user_data',
  BIOMETRIC_ENABLED: 'kidoo_biometric_enabled',
  DEVELOPER_MODE: 'kidoo_developer_mode',
} as const;

// Vérifier si on est sur le web
const isWeb = Platform.OS === 'web';

/**
 * Stocker une valeur de manière sécurisée
 */
export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
}

/**
 * Récupérer une valeur sécurisée
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (isWeb) {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
}

/**
 * Supprimer une valeur sécurisée
 */
export async function deleteSecureItem(key: string): Promise<void> {
  try {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Error deleting ${key}:`, error);
  }
}

// Token management
export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return getSecureItem(KEYS.ACCESS_TOKEN);
  },

  async setAccessToken(token: string): Promise<void> {
    return setSecureItem(KEYS.ACCESS_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return getSecureItem(KEYS.REFRESH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    return setSecureItem(KEYS.REFRESH_TOKEN, token);
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      setSecureItem(KEYS.ACCESS_TOKEN, accessToken),
      setSecureItem(KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      deleteSecureItem(KEYS.ACCESS_TOKEN),
      deleteSecureItem(KEYS.REFRESH_TOKEN),
    ]);
  },

  async hasTokens(): Promise<boolean> {
    const accessToken = await getSecureItem(KEYS.ACCESS_TOKEN);
    return !!accessToken;
  },
};

// Biometric settings
export const biometricStorage = {
  async isEnabled(): Promise<boolean> {
    const value = await getSecureItem(KEYS.BIOMETRIC_ENABLED);
    return value === 'true';
  },

  async setEnabled(enabled: boolean): Promise<void> {
    await setSecureItem(KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
  },
};

// Developer mode settings
export const developerStorage = {
  async isEnabled(): Promise<boolean> {
    const value = await getSecureItem(KEYS.DEVELOPER_MODE);
    return value === 'true';
  },

  async setEnabled(enabled: boolean): Promise<void> {
    await setSecureItem(KEYS.DEVELOPER_MODE, enabled ? 'true' : 'false');
  },
};
