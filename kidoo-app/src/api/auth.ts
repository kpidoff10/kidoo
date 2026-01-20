/**
 * Auth API
 * Endpoints d'authentification
 */

import { apiClient } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const authApi = {
  /**
   * Connexion
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/mobile/login', data);
    return response.data;
  },

  /**
   * Inscription
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    await apiClient.post('/api/auth/mobile/logout');
  },

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/api/auth/mobile/me');
    return response.data;
  },

  /**
   * Mettre à jour le profil
   */
  async updateProfile(data: { name?: string }): Promise<User> {
    const response = await apiClient.patch<User>('/api/auth/mobile/me', data);
    return response.data;
  },

  /**
   * Rafraîchir le token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post('/api/auth/mobile/refresh', { refreshToken });
    return response.data;
  },
};
