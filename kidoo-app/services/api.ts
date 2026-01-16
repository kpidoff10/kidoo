/**
 * Service API générique
 * Fournit des fonctions pour effectuer des requêtes HTTP
 */

import { getApiUrl } from '@/config/api';

/**
 * Callback pour notifier les erreurs réseau
 * Sera défini par le NetworkErrorProvider
 */
let networkErrorCallback: ((error: { message: string; endpoint?: string; retry?: () => Promise<unknown> }) => void) | null = null;

/**
 * Définit le callback pour les erreurs réseau
 * @internal - Utilisé uniquement par NetworkErrorProvider
 */
export function setNetworkErrorCallback(
  callback: ((error: { message: string; endpoint?: string; retry?: () => Promise<unknown> }) => void) | null
) {
  networkErrorCallback = callback;
}

/**
 * Détecte si une erreur est une erreur réseau
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network request failed') ||
      message.includes('failed to fetch') ||
      message.includes('networkerror') ||
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('enotfound')
    );
  }
  return false;
}

export interface ApiError {
  success: false;
  error: string;
  errorCode?: string;
  field?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Classe d'erreur personnalisée pour les erreurs API
 */
export class ApiException extends Error {
  public errorCode?: string;

  constructor(
    message: string,
    public status: number,
    public field?: string,
    errorCode?: string
  ) {
    super(message);
    this.name = 'ApiException';
    this.errorCode = errorCode;
  }
}

/**
 * Effectue une requête GET
 */
export async function apiGet<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new ApiException(
        errorData.error || 'Une erreur est survenue',
        response.status,
        errorData.field,
        errorData.errorCode
      );
    }

    return response.json();
  } catch (error) {
    // Si c'est une erreur réseau, notifier le provider
    if (isNetworkError(error) && networkErrorCallback) {
      networkErrorCallback({
        message: error instanceof Error ? error.message : 'Erreur de connexion au serveur',
        endpoint,
        retry: () => apiGet<T>(endpoint, options),
      });
    }
    throw error;
  }
}

/**
 * Effectue une requête POST
 */
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new ApiException(
        errorData.error || 'Une erreur est survenue',
        response.status,
        errorData.field,
        errorData.errorCode
      );
    }

    return response.json();
  } catch (error) {
    // Si c'est une erreur réseau, notifier le provider
    if (isNetworkError(error) && networkErrorCallback) {
      networkErrorCallback({
        message: error instanceof Error ? error.message : 'Erreur de connexion au serveur',
        endpoint,
        retry: () => apiPost<T>(endpoint, data, options),
      });
    }
    throw error;
  }
}

/**
 * Effectue une requête PUT
 */
export async function apiPut<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new ApiException(
        errorData.error || 'Une erreur est survenue',
        response.status,
        errorData.field,
        errorData.errorCode
      );
    }

    return response.json();
  } catch (error) {
    // Si c'est une erreur réseau, notifier le provider
    if (isNetworkError(error) && networkErrorCallback) {
      networkErrorCallback({
        message: error instanceof Error ? error.message : 'Erreur de connexion au serveur',
        endpoint,
        retry: () => apiPut<T>(endpoint, data, options),
      });
    }
    throw error;
  }
}

/**
 * Effectue une requête PATCH
 */
export async function apiPatch<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new ApiException(
        errorData.error || 'Une erreur est survenue',
        response.status,
        errorData.field,
        errorData.errorCode
      );
    }

    return response.json();
  } catch (error) {
    // Si c'est une erreur réseau, notifier le provider
    if (isNetworkError(error) && networkErrorCallback) {
      networkErrorCallback({
        message: error instanceof Error ? error.message : 'Erreur de connexion au serveur',
        endpoint,
        retry: () => apiPatch<T>(endpoint, data, options),
      });
    }
    throw error;
  }
}

/**
 * Effectue une requête DELETE
 */
export async function apiDelete<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new ApiException(
        errorData.error || 'Une erreur est survenue',
        response.status,
        errorData.field,
        errorData.errorCode
      );
    }

    return response.json();
  } catch (error) {
    // Si c'est une erreur réseau, notifier le provider
    if (isNetworkError(error) && networkErrorCallback) {
      networkErrorCallback({
        message: error instanceof Error ? error.message : 'Erreur de connexion au serveur',
        endpoint,
        retry: () => apiDelete<T>(endpoint, options),
      });
    }
    throw error;
  }
}

/**
 * Interface pour le suivi de progression d'upload
 */
export interface UploadProgress {
  loaded: number; // Bytes uploadés
  total: number; // Taille totale du fichier
  percentage: number; // Pourcentage (0-100)
}

/**
 * Effectue un upload de fichier avec suivi de progression
 * @param endpoint - Endpoint API
 * @param fileUri - URI du fichier local (ex: file://...)
 * @param fileName - Nom du fichier
 * @param mimeType - Type MIME du fichier
 * @param userId - ID de l'utilisateur connecté (pour l'authentification)
 * @param additionalData - Données supplémentaires à envoyer (ex: { tagId: '...' })
 * @param onProgress - Callback appelé à chaque mise à jour de progression
 * @param fileSize - Taille réelle du fichier en bytes (optionnel, utilisé pour calculer le pourcentage correct)
 */
export async function apiUpload<T>(
  endpoint: string,
  fileUri: string,
  fileName: string,
  mimeType: string,
  userId: string,
  additionalData?: Record<string, string>,
  onProgress?: (progress: UploadProgress) => void,
  fileSize?: number
): Promise<T> {
  const url = getApiUrl(endpoint);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Suivre la progression
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        let percentage: number;
        let loaded: number;
        let total: number;
        
        if (fileSize && fileSize > 0) {
          // Utiliser la taille réelle du fichier pour calculer le pourcentage
          // event.total inclut le fichier + FormData, donc il est plus grand que fileSize
          // On estime la progression du fichier en utilisant le ratio de progression global
          const progressRatio = event.loaded / event.total;
          loaded = Math.min(fileSize, Math.round(progressRatio * fileSize));
          total = fileSize;
          percentage = Math.min(100, Math.round((loaded / fileSize) * 100));
        } else {
          // Fallback : utiliser event.total si fileSize n'est pas fourni
          loaded = event.loaded;
          total = event.total;
          percentage = Math.min(100, Math.round((event.loaded / event.total) * 100));
        }
        
        const progress: UploadProgress = {
          loaded,
          total,
          percentage,
        };
        onProgress(progress);
      }
    });

    // Gérer la réponse
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (_error) {
          reject(new Error('Réponse invalide du serveur'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          const apiError = new ApiException(
            errorData.error || 'Une erreur est survenue',
            xhr.status,
            errorData.field,
            errorData.errorCode
          );
          
          // Si c'est une erreur réseau, notifier le provider
          if (networkErrorCallback) {
            networkErrorCallback({
              message: apiError.message,
              endpoint,
              retry: () => apiUpload<T>(endpoint, fileUri, fileName, mimeType, userId, additionalData, onProgress),
            });
          }
          
          reject(apiError);
        } catch {
          const apiError = new ApiException(
            xhr.statusText || 'Une erreur est survenue',
            xhr.status
          );
          
          if (networkErrorCallback) {
            networkErrorCallback({
              message: apiError.message,
              endpoint,
              retry: () => apiUpload<T>(endpoint, fileUri, fileName, mimeType, userId, additionalData, onProgress),
            });
          }
          
          reject(apiError);
        }
      }
    });

    // Gérer les erreurs
    xhr.addEventListener('error', () => {
      const error = new Error('Erreur réseau lors de l\'upload');
      if (networkErrorCallback) {
        networkErrorCallback({
          message: error.message,
          endpoint,
          retry: () => apiUpload<T>(endpoint, fileUri, fileName, mimeType, userId, additionalData, onProgress),
        });
      }
      reject(error);
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload annulé'));
    });

    // Préparer la requête
    xhr.open('POST', url);

    // Ajouter les headers d'authentification
    xhr.setRequestHeader('X-User-Id', userId);

    // Créer le FormData
    const formData = new FormData();
    
    // Dans React Native, FormData accepte directement un objet avec uri, type, name
    formData.append('file', {
      uri: fileUri,
      type: mimeType,
      name: fileName,
    } as any);

    // Ajouter les données supplémentaires
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    // Envoyer la requête
    xhr.send(formData as any);
  });
}
