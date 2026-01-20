/**
 * Kidoos API
 * Endpoints pour la gestion des Kidoos
 */

import { apiClient } from './client';

export interface Kidoo {
  id: string;
  name: string;
  macAddress: string | null;
  deviceId: string;
  model: string;
  isConnected: boolean;
  lastConnected: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Response wrapper du serveur
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateKidooRequest {
  name: string;
  macAddress: string;
  model: 'BASIC' | 'MINI';
}

export interface UpdateKidooRequest {
  name?: string;
}

export const kidoosApi = {
  /**
   * Récupérer tous les Kidoos de l'utilisateur
   */
  async getAll(): Promise<Kidoo[]> {
    const response = await apiClient.get<ApiResponse<Kidoo[]>>('/api/kidoos');
    return response.data.data || [];
  },

  /**
   * Récupérer un Kidoo par ID
   */
  async getById(id: string): Promise<Kidoo> {
    const response = await apiClient.get<ApiResponse<Kidoo>>(`/api/kidoos/${id}`);
    return response.data.data;
  },

  /**
   * Créer un nouveau Kidoo
   */
  async create(data: CreateKidooRequest): Promise<Kidoo> {
    const response = await apiClient.post<ApiResponse<Kidoo>>('/api/kidoos', data);
    return response.data.data;
  },

  /**
   * Mettre à jour un Kidoo
   */
  async update(id: string, data: UpdateKidooRequest): Promise<Kidoo> {
    const response = await apiClient.patch<ApiResponse<Kidoo>>(`/api/kidoos/${id}`, data);
    return response.data.data;
  },

  /**
   * Supprimer un Kidoo
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/kidoos/${id}`);
  },

  /**
   * Envoyer une commande à un Kidoo
   */
  async sendCommand(id: string, command: string, params?: Record<string, unknown>): Promise<void> {
    await apiClient.post(`/api/kidoos/${id}/command`, { command, params });
  },
};
