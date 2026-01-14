/**
 * Service pour gérer les Tags NFC
 * Gère les appels API pour les opérations sur les Tags
 * Invalide automatiquement le cache React Query après les mutations
 */

import { apiPost, apiGet, apiPut, apiDelete, ApiException, type ApiResponse } from './api';
import { queryClient } from '@/providers/QueryProvider';
import type { CreateTagInput, UpdateTagInput, Tag } from '@/types/shared';

// Query keys hiérarchiques pour les tags (déplacé ici pour éviter la dépendance circulaire)
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  byKidoo: (kidooId: string) => [...tagKeys.lists(), 'kidoo', kidooId] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (tagId: string) => [...tagKeys.details(), tagId] as const,
};

/**
 * Réponse de création d'un Tag
 */
export interface CreateTagResponse {
  success: true;
  data: Tag;
  message: string;
}

/**
 * Erreur de création d'un Tag
 */
export interface CreateTagError {
  success: false;
  error: string;
  errorCode?: string;
  field?: string;
}

/**
 * Crée un nouveau Tag NFC pour un Kidoo
 * @param data - Données du Tag à créer
 * @param userId - ID de l'utilisateur connecté (pour l'authentification)
 * @returns Le Tag créé avec son id (UUID à écrire sur le tag NFC) ou une erreur
 */
export async function createTag(
  data: CreateTagInput,
  userId: string
): Promise<CreateTagResponse | CreateTagError> {
  try {
    console.log('[TagService] Tentative de création d\'un nouveau Tag:', data);
    
    const result = await apiPost<CreateTagResponse>(
      '/api/tags',
      data,
      {
        headers: {
          'X-User-Id': userId, // Header pour l'authentification mobile
        },
      }
    );

    console.log('[TagService] Création réussie:', result);
    
    // Invalider le cache React Query pour re-fetch les tags du Kidoo
    if (result.success) {
      queryClient.invalidateQueries({
        queryKey: tagKeys.byKidoo(data.kidooId),
      });
    }
    
    return result;
  } catch (error) {
    console.log('[TagService] Exception lors de la création du Tag (gérée):', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
        errorCode: error.errorCode,
        field: error.field,
      } as CreateTagError;
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la création du Tag',
      } as CreateTagError;
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la création du Tag',
    } as CreateTagError;
  }
}

/**
 * Récupère tous les tags d'un Kidoo
 * @param kidooId - ID du Kidoo
 * @param userId - ID de l'utilisateur connecté
 * @returns Liste des Tags ou une erreur
 */
export async function getTagsByKidoo(
  kidooId: string,
  userId: string
): Promise<ApiResponse<Tag[]>> {
  try {
    const result = await apiGet<ApiResponse<Tag[]>>(
      `/api/kidoos/${kidooId}/tags`,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    return result;
  } catch (error) {
    console.error('[TagService] Exception lors de la récupération des Tags:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la récupération des Tags',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la récupération des Tags',
    };
  }
}

/**
 * Met à jour un Tag
 * @param tagId - ID du Tag à mettre à jour
 * @param data - Données à mettre à jour
 * @param userId - ID de l'utilisateur connecté
 * @returns Le Tag mis à jour ou une erreur
 */
export async function updateTag(
  tagId: string,
  data: UpdateTagInput,
  userId: string
): Promise<ApiResponse<Tag>> {
  try {
    const result = await apiPut<ApiResponse<Tag>>(
      `/api/tags/${tagId}`,
      data,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    // Invalider le cache React Query après mise à jour
    if (result.success && result.data) {
      // Invalider le tag spécifique
      queryClient.invalidateQueries({
        queryKey: tagKeys.detail(result.data.id),
      });
      // Invalider toutes les listes (car le tag peut avoir changé de Kidoo)
      queryClient.invalidateQueries({
        queryKey: tagKeys.lists(),
      });
    }

    return result;
  } catch (error) {
    console.error('[TagService] Exception lors de la mise à jour du Tag:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
        errorCode: error.errorCode,
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la mise à jour du Tag',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la mise à jour du Tag',
    };
  }
}

/**
 * Réponse de vérification d'un Tag
 */
export interface CheckTagExistsResponse {
  success: true;
  tagIdExists: boolean;
  uidExists: boolean;
  errorCode?: string;
}

/**
 * Erreur de vérification d'un Tag
 */
export interface CheckTagExistsError {
  success: false;
  tagIdExists: boolean;
  uidExists: boolean;
  error: string;
  errorCode?: string;
}

/**
 * Vérifie si un tagId ou UID existe déjà
 * @param tagId - TagId à vérifier
 * @param uid - UID à vérifier (optionnel)
 * @param kidooId - ID du Kidoo pour vérifier l'UID (requis si uid fourni)
 * @param userId - ID de l'utilisateur connecté
 * @returns Résultat de la vérification
 */
export async function checkTagExists(
  tagId: string,
  userId: string,
  uid?: string,
  kidooId?: string
): Promise<CheckTagExistsResponse | CheckTagExistsError> {
  try {
    let url = `/api/tags/check?tagId=${encodeURIComponent(tagId)}`;
    if (uid && kidooId) {
      url += `&uid=${encodeURIComponent(uid)}&kidooId=${encodeURIComponent(kidooId)}`;
    }

    const result = await apiGet<
      ApiResponse<{ tagIdExists: boolean; uidExists: boolean; errorCode?: string }>
    >(url, {
      headers: {
        'X-User-Id': userId,
      },
    });

    if (result.success && result.data) {
      return {
        success: true,
        tagIdExists: result.data.tagIdExists,
        uidExists: result.data.uidExists,
        errorCode: result.data.errorCode,
      };
    }

    // Extraire errorCode si disponible dans la réponse d'erreur
    const errorResponse = result as ApiResponse<null>;
    const errorCode = 'errorCode' in errorResponse ? (errorResponse as any).errorCode : undefined;

    return {
      success: false,
      tagIdExists: false,
      uidExists: false,
      error: !result.success ? result.error : 'Erreur lors de la vérification du tag',
      errorCode,
    };
  } catch (error) {
    console.error('[TagService] Exception lors de la vérification du Tag:', error);
    return {
      success: false,
      tagIdExists: false,
      uidExists: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la vérification du Tag',
    };
  }
}

/**
 * Supprime un Tag
 * @param tagId - ID du Tag à supprimer
 * @param userId - ID de l'utilisateur connecté
 * @returns Succès ou erreur
 */
export async function deleteTag(
  tagId: string,
  userId: string
): Promise<ApiResponse<null>> {
  try {
    const result = await apiDelete<ApiResponse<null>>(
      `/api/tags/${tagId}`,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    // Invalider le cache React Query après suppression
    if (result.success) {
      // Invalider le tag spécifique
      queryClient.invalidateQueries({
        queryKey: tagKeys.detail(tagId),
      });
      // Invalider toutes les listes (car on ne sait pas de quel Kidoo il s'agissait)
      queryClient.invalidateQueries({
        queryKey: tagKeys.lists(),
      });
    }

    return result;
  } catch (error) {
    console.error('[TagService] Exception lors de la suppression du Tag:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la suppression du Tag',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la suppression du Tag',
    };
  }
}
