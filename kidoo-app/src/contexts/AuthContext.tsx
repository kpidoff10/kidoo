/**
 * Auth Context
 * Gestion de l'authentification utilisateur
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { authApi, User, LoginRequest, RegisterRequest } from '@/api';
import { tokenStorage, developerStorage } from '@/utils/storage';
import { showToast } from '@/components/ui/Toast';
import { useTranslation } from 'react-i18next';
import { queryClient } from '@/lib/queryClient';
import { setUser as setSentryUser, setTag } from '@/lib/sentry';

const PROFILE_KEY = ['profile'];

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDeveloper: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: { name?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
  setDeveloperMode: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { t } = useTranslation();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isDeveloper: false,
  });

  // Vérifier si l'utilisateur est connecté au démarrage et charger le mode développeur
  useEffect(() => {
    checkAuth();
    loadDeveloperMode();
  }, []);

  const loadDeveloperMode = async () => {
    try {
      const isDeveloper = await developerStorage.isEnabled();
      // Ajouter le tag développeur dans Sentry
      setTag('developer_mode', isDeveloper ? 'enabled' : 'disabled');
      setState((prev) => ({
        ...prev,
        isDeveloper,
      }));
    } catch (error) {
      console.error('Error loading developer mode:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const hasTokens = await tokenStorage.hasTokens();
      
      if (!hasTokens) {
        setState((prev) => ({
          ...prev,
          user: null,
          isLoading: false,
          isAuthenticated: false,
        }));
        return;
      }

      // Récupérer le profil utilisateur
      const user = await authApi.getProfile();
      
      // Synchroniser le cache React Query
      queryClient.setQueryData<User>(PROFILE_KEY, user);
      
      // Mettre à jour le contexte utilisateur dans Sentry
      setSentryUser({
        id: user.id,
        email: user.email,
        username: user.name || user.email,
      });
      
      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
        isAuthenticated: true,
      }));
    } catch (error) {
      // Token invalide ou expiré
      await tokenStorage.clearTokens();
      // Réinitialiser le contexte utilisateur dans Sentry
      setSentryUser(null);
      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }));
    }
  };

  const login = useCallback(async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data);
      
      // Stocker les tokens
      await tokenStorage.setTokens(response.accessToken, response.refreshToken);
      
      // Synchroniser le cache React Query
      queryClient.setQueryData<User>(PROFILE_KEY, response.user);
      
      // Mettre à jour le contexte utilisateur dans Sentry
      setSentryUser({
        id: response.user.id,
        email: response.user.email,
        username: response.user.name || response.user.email,
      });
      
      setState((prev) => ({
        ...prev,
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      }));
    } catch (error) {
      showToast.error({
        title: t('toast.error'),
        message: t('auth.errors.invalidCredentials'),
      });
      throw error;
    }
  }, [t]);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data);
      
      // Stocker les tokens
      await tokenStorage.setTokens(response.accessToken, response.refreshToken);
      
      // Mettre à jour le contexte utilisateur dans Sentry
      setSentryUser({
        id: response.user.id,
        email: response.user.email,
        username: response.user.name || response.user.email,
      });
      
      setState((prev) => ({
        ...prev,
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      }));

      showToast.success({
        title: t('toast.success'),
        message: t('home.welcome'),
      });
    } catch (error) {
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
      throw error;
    }
  }, [t]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignorer les erreurs de logout côté serveur
      console.error('Logout error:', error);
    } finally {
      // Toujours nettoyer les tokens locaux
      await tokenStorage.clearTokens();
      
      // Nettoyer le cache React Query
      queryClient.removeQueries({ queryKey: PROFILE_KEY });
      
      // Réinitialiser le contexte utilisateur dans Sentry
      setSentryUser(null);
      
      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }));
    }
  }, []);

  const updateUser = useCallback(async (data: { name?: string }) => {
    try {
      const updatedUser = await authApi.updateProfile(data);
      
      // Mettre à jour le contexte utilisateur dans Sentry
      setSentryUser({
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.name || updatedUser.email,
      });
      
      setState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
      throw error;
    }
  }, [t]);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authApi.getProfile();
      
      // Synchroniser le cache React Query
      queryClient.setQueryData<User>(PROFILE_KEY, user);
      
      // Mettre à jour le contexte utilisateur dans Sentry
      setSentryUser({
        id: user.id,
        email: user.email,
        username: user.name || user.email,
      });
      
      setState((prev) => ({
        ...prev,
        user,
      }));
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, []);

  const setDeveloperMode = useCallback(async (enabled: boolean) => {
    try {
      await developerStorage.setEnabled(enabled);
      // Mettre à jour le tag développeur dans Sentry
      setTag('developer_mode', enabled ? 'enabled' : 'disabled');
      setState((prev) => ({
        ...prev,
        isDeveloper: enabled,
      }));
      
      if (enabled) {
        showToast.success({
          title: t('toast.success'),
          message: t('profile.developerModeEnabled', { defaultValue: 'Mode développeur activé' }),
        });
      } else {
        showToast.success({
          title: t('toast.success'),
          message: t('profile.developerModeDisabled', { defaultValue: 'Mode développeur désactivé' }),
        });
      }
    } catch (error) {
      console.error('Error setting developer mode:', error);
      showToast.error({
        title: t('toast.error'),
        message: t('errors.generic'),
      });
    }
  }, [t]);

  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      login,
      register,
      logout,
      updateUser,
      refreshUser,
      setDeveloperMode,
    }),
    [state, login, register, logout, updateUser, refreshUser, setDeveloperMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
