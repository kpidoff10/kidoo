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
import { tokenStorage } from '@/utils/storage';
import { showToast } from '@/components/ui/Toast';
import { useTranslation } from 'react-i18next';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: { name?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
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
  });

  // Vérifier si l'utilisateur est connecté au démarrage
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const hasTokens = await tokenStorage.hasTokens();
      
      if (!hasTokens) {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      // Récupérer le profil utilisateur
      const user = await authApi.getProfile();
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      // Token invalide ou expiré
      await tokenStorage.clearTokens();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = useCallback(async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data);
      
      // Stocker les tokens
      await tokenStorage.setTokens(response.accessToken, response.refreshToken);
      
      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });

      showToast.success({
        title: t('toast.success'),
        message: t('home.welcomeBack', { name: response.user.name }),
      });
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
      
      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });

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
      
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const updateUser = useCallback(async (data: { name?: string }) => {
    try {
      const updatedUser = await authApi.updateProfile(data);
      
      setState((prev) => ({
        ...prev,
        user: updatedUser,
      }));

      showToast.success({
        title: t('toast.success'),
        message: t('toast.updated'),
      });
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
      setState((prev) => ({
        ...prev,
        user,
      }));
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      login,
      register,
      logout,
      updateUser,
      refreshUser,
    }),
    [state, login, register, logout, updateUser, refreshUser]
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
