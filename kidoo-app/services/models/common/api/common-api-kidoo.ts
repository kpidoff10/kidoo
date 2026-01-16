/**
 * API commune pour gérer les Kidoos
 * Disponible pour tous les modèles de Kidoo
 * 
 * Gère les opérations CRUD communes :
 * - create: Créer un Kidoo
 * - get: Récupérer un ou plusieurs Kidoos
 * - update: Mettre à jour un Kidoo
 * - delete: Supprimer un Kidoo
 */

import { apiPost, apiGet, apiPut, apiDelete, ApiException, type ApiResponse } from '@/services/api';
import { API_CONFIG } from '@/config/api';
import { queryClient } from '@/providers/QueryProvider';
import { kidooKeys } from './common-api-keys';
import type { CreateKidooInput, UpdateKidooInput, Kidoo } from '@/types/shared';

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
    console.log('[CommonApiKidoo] Tentative de création d\'un nouveau Kidoo:', API_CONFIG.endpoints.kidoos);
    
    const result = await apiPost<CreateKidooResponse>(
      API_CONFIG.endpoints.kidoos,
      data,
      {
        headers: {
          'X-User-Id': userId, // Header pour l'authentification mobile
        },
      }
    );

    console.log('[CommonApiKidoo] Création réussie:', result);
    
    // Invalider le cache React Query pour re-fetch la liste des Kidoos
    if (result.success) {
      queryClient.invalidateQueries({
        queryKey: kidooKeys.lists(),
      });
    }
    
    return result;
  } catch (error) {
    console.log('[CommonApiKidoo] Exception lors de la création du Kidoo (gérée):', error);
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
    console.log('[CommonApiKidoo] Exception lors de la récupération du Kidoo (gérée):', error);
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
    console.log('[CommonApiKidoo] Tentative de récupération des Kidoos:', API_CONFIG.endpoints.kidoos);
    
    const result = await apiGet<ApiResponse<Kidoo[]>>(
      API_CONFIG.endpoints.kidoos,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    console.log('[CommonApiKidoo] Récupération réussie:', result);
    return result;
  } catch (error) {
    console.error('[CommonApiKidoo] Exception lors de la récupération des Kidoos:', error);
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
    console.log('[CommonApiKidoo] Tentative de mise à jour du Kidoo:', kidooId);
    
    const result = await apiPut<ApiResponse<Kidoo>>(
      `${API_CONFIG.endpoints.kidoos}/${kidooId}`,
      data,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    console.log('[CommonApiKidoo] Mise à jour réussie:', result);
    
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
    console.error('[CommonApiKidoo] Exception lors de la mise à jour du Kidoo:', error);
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
    console.log('[CommonApiKidoo] Tentative de suppression du Kidoo:', kidooId);
    
    const result = await apiDelete<ApiResponse<null>>(
      `${API_CONFIG.endpoints.kidoos}/${kidooId}`,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    console.log('[CommonApiKidoo] Suppression réussie:', result);
    
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
    console.error('[CommonApiKidoo] Exception lors de la suppression du Kidoo:', error);
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
