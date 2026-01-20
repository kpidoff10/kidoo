/**
 * Types communs pour les réponses API
 */

/**
 * Réponse API en erreur
 */
export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

/**
 * Réponse API réussie générique
 */
export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

/**
 * Réponse API générique
 */
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
