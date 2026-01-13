/**
 * Types API communs partagés entre toutes les fonctionnalités
 */

/**
 * Réponse d'erreur API standard
 */
export interface ApiError {
  success: false;
  error: string;
  field?: string;
}

/**
 * Réponse de succès API standard
 */
export interface ApiSuccess<T> {
  success: true;
  data?: T;
  message?: string;
}

/**
 * Réponse API générique (union type)
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
