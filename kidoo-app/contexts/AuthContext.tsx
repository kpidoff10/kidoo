/**
 * Contexte d'authentification pour gérer l'état utilisateur
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SessionUser, LoginInput, RegisterInput, LoginError, RegisterError } from '@/shared';
import { loginUser, registerUser, logoutUser as apiLogout } from '@/services/authService';

const STORAGE_KEY = '@kidoo:user';
const DEVELOPER_MODE_KEY = '@kidoo:developerMode';

interface AuthContextType {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDeveloperMode: boolean;
  enableDeveloperMode: () => Promise<void>;
  toggleDeveloperMode: () => Promise<void>;
  login: (credentials: LoginInput) => Promise<{ success: boolean; error?: string; field?: string }>;
  register: (data: RegisterInput) => Promise<{ success: boolean; error?: string; field?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  // Charger l'utilisateur et le mode développeur depuis le stockage local au démarrage
  useEffect(() => {
    loadUserFromStorage();
    loadDeveloperModeFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserToStorage = async (userData: SessionUser | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    }
  };

  const login = useCallback(async (credentials: LoginInput) => {
    try {
      setIsLoading(true);
      console.log('Tentative de connexion avec:', { email: credentials.email });
      const response = await loginUser(credentials);
      console.log('Réponse de connexion:', response);
      
      // loginUser retourne maintenant LoginResponse | LoginError
      if (!response || !response.success) {
        console.error('Erreur lors de la connexion:', response);
        const error = response as LoginError;
        return {
          success: false,
          error: error.error || 'Connexion échouée',
          field: error.field,
        };
      }
      
      const userData: SessionUser = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      };
      setUser(userData);
      await saveUserToStorage(userData);
      console.log('Utilisateur connecté avec succès');
      return { success: true };
    } catch (error) {
      console.error('Exception lors de la connexion:', error);
      // Si c'est une LoginError (objet avec success: false)
      if (error && typeof error === 'object' && 'success' in error && !error.success) {
        const loginError = error as LoginError;
        return {
          success: false,
          error: loginError.error || 'Une erreur est survenue lors de la connexion',
          field: loginError.field,
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      console.log('Tentative d\'inscription avec:', { email: data.email, name: data.name });
      
      const response = await registerUser(data);
      console.log('Réponse d\'inscription:', response);
      
      // registerUser retourne maintenant RegisterResponse | RegisterError
      if (!response || !response.success) {
        console.error('Erreur lors de l\'inscription:', response);
        const error = response as RegisterError;
        return {
          success: false,
          error: error.error || 'Inscription échouée',
          field: error.field,
        };
      }

      // Après l'inscription réussie, connecter automatiquement l'utilisateur
      console.log('Connexion automatique après inscription...');
      const loginResponse = await loginUser({
        email: data.email,
        password: data.password,
      });
      
      // loginUser retourne maintenant LoginResponse | LoginError (ne lance plus d'exception)
      if (!loginResponse || !loginResponse.success) {
        console.error('Échec de la connexion automatique:', loginResponse);
        const loginErr = loginResponse as LoginError;
        return {
          success: false,
          error: loginErr.error || 'Compte créé mais connexion échouée. Veuillez vous connecter manuellement.',
          field: loginErr.field,
        };
      }
      
      const userData: SessionUser = {
        id: loginResponse.user.id,
        email: loginResponse.user.email,
        name: loginResponse.user.name,
      };
      setUser(userData);
      await saveUserToStorage(userData);
      console.log('Utilisateur connecté avec succès');
      return { success: true };
    } catch (error) {
      console.error('Erreur complète lors de l\'inscription:', error);
      
      // Si c'est une RegisterError (objet avec success: false)
      if (error && typeof error === 'object' && 'success' in error && !error.success) {
        const registerError = error as RegisterError;
        return {
          success: false,
          error: registerError.error || 'Une erreur est survenue lors de l\'inscription',
          field: registerError.field,
        };
      }
      
      // Si c'est une autre erreur
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await apiLogout();
      setUser(null);
      await saveUserToStorage(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, on déconnecte localement
      setUser(null);
      await saveUserToStorage(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    // Pour l'instant, on recharge depuis le stockage
    // Plus tard, on pourra appeler une API pour rafraîchir les données
    await loadUserFromStorage();
  }, []);

  const loadDeveloperModeFromStorage = async () => {
    try {
      const storedMode = await AsyncStorage.getItem(DEVELOPER_MODE_KEY);
      if (storedMode !== null) {
        setIsDeveloperMode(storedMode === 'true');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du mode développeur:', error);
    }
  };

  const saveDeveloperModeToStorage = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(DEVELOPER_MODE_KEY, enabled.toString());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du mode développeur:', error);
    }
  };

  const enableDeveloperMode = useCallback(async () => {
    setIsDeveloperMode(true);
    await saveDeveloperModeToStorage(true);
  }, []);

  const toggleDeveloperMode = useCallback(async () => {
    const newMode = !isDeveloperMode;
    setIsDeveloperMode(newMode);
    await saveDeveloperModeToStorage(newMode);
  }, [isDeveloperMode]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isDeveloperMode,
    enableDeveloperMode,
    toggleDeveloperMode,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
