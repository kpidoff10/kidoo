/**
 * Service pour gérer les Kidoos
 * Gère les appels API pour les opérations sur les Kidoos
 * Invalide automatiquement le cache React Query après les mutations
 */

import { apiPost, apiGet, apiPut, apiDelete, ApiException, type ApiResponse } from './api';
import { API_CONFIG } from '@/config/api';
import { queryClient } from '@/providers/QueryProvider';
import type { CreateKidooInput, UpdateKidooInput } from '@/types/shared';

// Query keys hiérarchiques pour les Kidoos (défini ici pour éviter la dépendance circulaire)
export const kidooKeys = {
  all: ['kidoos'] as const,
  lists: () => [...kidooKeys.all, 'list'] as const,
  details: () => [...kidooKeys.all, 'detail'] as const,
  detail: (kidooId: string) => [...kidooKeys.details(), kidooId] as const,
};

/**
 * Type pour un Kidoo retourné par l'API
 */
export interface Kidoo {
  id: string;
  name: string;
  model: string; // Modèle du Kidoo (classic, mini, pro, etc.)
  macAddress: string | null;
  deviceId: string;
  firmwareVersion: string | null;
  lastConnected: string | null;
  isConnected: boolean;
  wifiSSID: string | null;
  userId: string | null;
  isSynced: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Réponse de création d'un Kidoo
 */
export interface CreateKidooResponse {
  success: true;
  data: Kidoo;
  message: string;
}

/**
 * Erreur de création d'un Kidoo
 */
export interface CreateKidooError {
  success: false;
  error: string;
  field?: string;
}

/**
 * Crée un nouveau Kidoo pour l'utilisateur connecté
 * @param data - Données du Kidoo à créer
 * @param userId - ID de l'utilisateur connecté (pour l'authentification)
 * @returns Le Kidoo créé ou une erreur
 */
export async function createKidoo(
  data: CreateKidooInput,
  userId: string
): Promise<CreateKidooResponse | CreateKidooError> {
  try {
    console.log('[KidooService] Tentative de création d\'un nouveau Kidoo:', API_CONFIG.endpoints.kidoos);
    
    const result = await apiPost<CreateKidooResponse>(
      API_CONFIG.endpoints.kidoos,
      data,
      {
        headers: {
          'X-User-Id': userId, // Header pour l'authentification mobile
        },
      }
    );

    console.log('[KidooService] Création réussie:', result);
    
    // Invalider le cache React Query pour re-fetch la liste des Kidoos
    if (result.success) {
      queryClient.invalidateQueries({
        queryKey: kidooKeys.lists(),
      });
    }
    
    return result;
  } catch (error) {
    console.log('[KidooService] Exception lors de la création du Kidoo (gérée):', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
        field: error.field,
      } as CreateKidooError;
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la création du Kidoo',
      } as CreateKidooError;
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la création du Kidoo',
    } as CreateKidooError;
  }
}

/**
 * Récupère un Kidoo par son ID
 * @param kidooId - ID du Kidoo à récupérer
 * @param userId - ID de l'utilisateur connecté
 * @returns Le Kidoo ou une erreur
 */
export async function getKidooById(
  kidooId: string,
  userId: string
): Promise<ApiResponse<Kidoo>> {
  try {
    const result = await apiGet<ApiResponse<Kidoo>>(
      `${API_CONFIG.endpoints.kidoos}/${kidooId}`,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    return result;
  } catch (error) {
    console.log('[KidooService] Exception lors de la récupération du Kidoo (gérée):', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la récupération du Kidoo',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la récupération du Kidoo',
    };
  }
}

/**
 * Récupère tous les Kidoos de l'utilisateur connecté
 * @param userId - ID de l'utilisateur connecté
 * @returns Liste des Kidoos ou une erreur
 */
export async function getKidoos(userId: string): Promise<ApiResponse<Kidoo[]>> {
  try {
    console.log('[KidooService] Tentative de récupération des Kidoos:', API_CONFIG.endpoints.kidoos);
    
    const result = await apiGet<ApiResponse<Kidoo[]>>(
      API_CONFIG.endpoints.kidoos,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    console.log('[KidooService] Récupération réussie:', result);
    return result;
  } catch (error) {
    console.error('[KidooService] Exception lors de la récupération des Kidoos:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la récupération des Kidoos',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la récupération des Kidoos',
    };
  }
}

/**
 * Met à jour un Kidoo
 * @param kidooId - ID du Kidoo à mettre à jour
 * @param data - Données à mettre à jour
 * @param userId - ID de l'utilisateur connecté
 * @returns Le Kidoo mis à jour ou une erreur
 */
export async function updateKidoo(
  kidooId: string,
  data: UpdateKidooInput,
  userId: string
): Promise<ApiResponse<Kidoo>> {
  try {
    console.log('[KidooService] Tentative de mise à jour du Kidoo:', kidooId);
    
    const result = await apiPut<ApiResponse<Kidoo>>(
      `${API_CONFIG.endpoints.kidoos}/${kidooId}`,
      data,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    console.log('[KidooService] Mise à jour réussie:', result);
    
    // Invalider le cache React Query après mise à jour
    if (result.success && result.data) {
      // Invalider le Kidoo spécifique
      queryClient.invalidateQueries({
        queryKey: kidooKeys.detail(result.data.id),
      });
      // Invalider la liste des Kidoos
      queryClient.invalidateQueries({
        queryKey: kidooKeys.lists(),
      });
    }
    
    return result;
  } catch (error) {
    console.error('[KidooService] Exception lors de la mise à jour du Kidoo:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la mise à jour du Kidoo',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la mise à jour du Kidoo',
    };
  }
}

/**
 * Supprime un Kidoo
 * @param kidooId - ID du Kidoo à supprimer
 * @param userId - ID de l'utilisateur connecté
 * @returns Succès ou erreur
 */
export async function deleteKidoo(
  kidooId: string,
  userId: string
): Promise<ApiResponse<null>> {
  try {
    console.log('[KidooService] Tentative de suppression du Kidoo:', kidooId);
    
    const result = await apiDelete<ApiResponse<null>>(
      `${API_CONFIG.endpoints.kidoos}/${kidooId}`,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    console.log('[KidooService] Suppression réussie:', result);
    
    // Invalider le cache React Query après suppression
    if (result.success) {
      // Invalider le Kidoo spécifique
      queryClient.invalidateQueries({
        queryKey: kidooKeys.detail(kidooId),
      });
      // Invalider la liste des Kidoos
      queryClient.invalidateQueries({
        queryKey: kidooKeys.lists(),
      });
    }
    
    return result;
  } catch (error) {
    console.error('[KidooService] Exception lors de la suppression du Kidoo:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la suppression du Kidoo',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la suppression du Kidoo',
    };
  }
}
