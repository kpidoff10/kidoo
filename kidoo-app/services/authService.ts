/**
 * Service d'authentification
 * Gère les appels API pour l'authentification
 */

import { apiGet, apiPost, ApiException } from './api';
import { API_CONFIG } from '@/config/api';
import type {
  RegisterInput,
  RegisterResponse,
  RegisterError,
  CheckEmailResponse,
  LoginInput,
  LoginResponse,
  LoginError,
} from '@/shared';

// Réexporter les types pour compatibilité
export type { RegisterInput, RegisterResponse, RegisterError, CheckEmailResponse, LoginInput, LoginResponse, LoginError };

/**
 * Enregistre un nouvel utilisateur
 */
export async function registerUser(data: RegisterInput): Promise<RegisterResponse | RegisterError> {
  try {
    console.log('Tentative d\'inscription via API:', API_CONFIG.endpoints.auth.register);
    
    const result = await apiPost<RegisterResponse>(
      API_CONFIG.endpoints.auth.register,
      data
    );

    console.log('Inscription réussie:', result);
    return result;
  } catch (error) {
    console.error('Exception lors de l\'inscription:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
        field: error.field,
      } as RegisterError;
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la création du compte',
      } as RegisterError;
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la création du compte',
    } as RegisterError;
  }
}

/**
 * Vérifie si un email est disponible
 */
export async function checkEmailAvailability(email: string): Promise<CheckEmailResponse> {
  try {
    return await apiGet<CheckEmailResponse>(
      `${API_CONFIG.endpoints.auth.checkEmail}?email=${encodeURIComponent(email)}`
    );
  } catch (error) {
    if (error instanceof ApiException) {
      throw {
        success: false,
        error: error.message,
      };
    }
    throw {
      success: false,
      error: 'Une erreur est survenue lors de la vérification',
    };
  }
}

/**
 * Connecte un utilisateur avec email et mot de passe
 * Utilise l'API mobile-friendly qui retourne les informations utilisateur
 */
export async function loginUser(data: LoginInput): Promise<LoginResponse | LoginError> {
  try {
    console.log('Tentative de connexion via API:', '/api/auth/mobile/login');
    
    const result = await apiPost<LoginResponse>(
      '/api/auth/mobile/login',
      data
    );

    console.log('Connexion réussie:', result);
    return result;
  } catch (error) {
    console.error('Exception lors de la connexion:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
        field: error.field || 'credentials',
      } as LoginError;
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la connexion',
      } as LoginError;
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la connexion',
    } as LoginError;
  }
}

/**
 * Déconnecte l'utilisateur
 */
export async function logoutUser(): Promise<void> {
  try {
    await apiPost('/api/auth/mobile/logout');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
}
