/**
 * Service pour gérer les Tags NFC
 * Gère les appels API pour les opérations sur les Tags
 */

import { apiPost, apiGet, apiPut, apiDelete, ApiException, type ApiResponse } from './api';
import { API_CONFIG } from '@/config/api';
import type { CreateTagInput, UpdateTagInput } from '@/types/shared';

/**
 * Type pour un Tag retourné par l'API
 */
export interface Tag {
  id: string; // Identifiant unique écrit sur le tag NFC (UUID généré par Prisma)
  uid: string; // UID du tag NFC (lecture seule, identifiant matériel du tag physique)
  name: string | null;
  kidooId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

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
    return result;
  } catch (error) {
    console.log('[TagService] Exception lors de la création du Tag (gérée):', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
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

    return result;
  } catch (error) {
    console.error('[TagService] Exception lors de la mise à jour du Tag:', error);
    if (error instanceof ApiException) {
      return {
        success: false,
        error: error.message,
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
