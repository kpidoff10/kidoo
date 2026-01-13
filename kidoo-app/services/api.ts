/**
 * Service API générique
 * Fournit des fonctions pour effectuer des requêtes HTTP
 */

import { API_CONFIG, getApiUrl } from '@/config/api';

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
  constructor(
    message: string,
    public status: number,
    public field?: string
  ) {
    super(message);
    this.name = 'ApiException';
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
        errorData.field
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
        errorData.field
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
        errorData.field
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
        errorData.field
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
