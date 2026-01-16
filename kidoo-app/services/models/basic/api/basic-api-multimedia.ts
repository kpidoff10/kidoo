/**
 * Service pour gérer les fichiers multimédias
 * Gère les appels API pour les opérations sur les fichiers multimédias
 */

import { apiGet, apiPut, apiDelete, apiPatch, type ApiResponse } from '../../../api';

// Type pour un fichier multimédia
export interface MultimediaFile {
  id: string;
  url: string;
  path: string;
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  tagId: string; // UUID du tag
  order: number; // Ordre d'affichage dans la liste
  disabled?: boolean; // Indique si le fichier est désactivé (en pause)
  createdAt: string;
  updatedAt: string;
}

// Query keys hiérarchiques pour les multimédias
export const multimediaKeys = {
  all: ['multimedia'] as const,
  lists: () => [...multimediaKeys.all, 'list'] as const,
  byTag: (tagId: string) => [...multimediaKeys.lists(), 'tag', tagId] as const,
};

/**
 * Récupère tous les fichiers multimédias d'un tag
 * @param tagId - ID du tag (UUID)
 * @param userId - ID de l'utilisateur connecté
 * @returns Liste des fichiers multimédias ou une erreur
 */
export async function getMultimediaByTag(
  tagId: string,
  userId: string
): Promise<ApiResponse<MultimediaFile[]>> {
  try {
    const result = await apiGet<ApiResponse<MultimediaFile[]>>(
      `/api/multimedia?tagId=${encodeURIComponent(tagId)}`,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    return result;
  } catch (error) {
    console.error('[MultimediaService] Exception lors de la récupération des fichiers multimédias:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la récupération des fichiers multimédias',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la récupération des fichiers multimédias',
    };
  }
}

/**
 * Réorganise l'ordre des fichiers multimédias d'un tag
 * @param tagId - ID du tag (UUID)
 * @param fileIds - Liste des IDs dans le nouvel ordre
 * @param userId - ID de l'utilisateur connecté
 * @returns Succès ou erreur
 */
export async function reorderMultimediaFiles(
  tagId: string,
  fileIds: string[],
  userId: string
): Promise<ApiResponse<null>> {
  try {
    const result = await apiPut<ApiResponse<null>>(
      '/api/multimedia/reorder',
      {
        tagId,
        fileIds,
      },
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    return result;
  } catch (error) {
    console.error('[MultimediaService] Exception lors de la réorganisation des fichiers multimédias:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la réorganisation des fichiers multimédias',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la réorganisation des fichiers multimédias',
    };
  }
}

/**
 * Met à jour le statut d'un fichier multimédia (activer/désactiver)
 * @param fileId - ID du fichier multimédia
 * @param disabled - Statut disabled (true = désactivé, false = activé)
 * @param userId - ID de l'utilisateur connecté
 * @returns Succès ou erreur
 */
export async function updateMultimediaFileStatus(
  fileId: string,
  disabled: boolean,
  userId: string
): Promise<ApiResponse<MultimediaFile>> {
  try {
    const result = await apiPatch<ApiResponse<MultimediaFile>>(
      `/api/multimedia/${encodeURIComponent(fileId)}`,
      { disabled },
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    return result;
  } catch (error) {
    console.error('[MultimediaService] Exception lors de la mise à jour du statut du fichier multimédia:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la mise à jour du statut',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la mise à jour du statut',
    };
  }
}

/**
 * Supprime un fichier multimédia
 * @param fileId - ID du fichier multimédia
 * @param userId - ID de l'utilisateur connecté
 * @returns Succès ou erreur
 */
export async function deleteMultimediaFile(
  fileId: string,
  userId: string
): Promise<ApiResponse<null>> {
  try {
    const result = await apiDelete<ApiResponse<null>>(
      `/api/multimedia/${encodeURIComponent(fileId)}`,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    );

    return result;
  } catch (error) {
    console.error('[MultimediaService] Exception lors de la suppression du fichier multimédia:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la suppression du fichier multimédia',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur est survenue lors de la suppression du fichier multimédia',
    };
  }
}
