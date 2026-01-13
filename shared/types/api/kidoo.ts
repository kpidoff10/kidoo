/**
 * Types API pour les Kidoos
 */

import type { ApiError, ApiSuccess } from './common';
import type { Kidoo } from '../kidoo';

/**
 * Réponse pour récupérer tous les kidoos
 */
export interface GetKidoosResponse extends ApiSuccess<Kidoo[]> {
  data: Kidoo[];
  message?: string;
}

/**
 * Réponse d'erreur pour récupérer les kidoos
 */
export interface GetKidoosError extends ApiError {}

/**
 * Réponse pour récupérer un kidoo spécifique
 */
export interface GetKidooResponse extends ApiSuccess<Kidoo> {
  data: Kidoo;
}

/**
 * Réponse d'erreur pour récupérer un kidoo
 */
export interface GetKidooError extends ApiError {}

/**
 * Réponse pour créer un kidoo
 */
export interface CreateKidooResponse extends ApiSuccess<Kidoo> {
  data: Kidoo;
  message?: string;
}

/**
 * Réponse d'erreur pour créer un kidoo
 */
export interface CreateKidooError extends ApiError {
  field?: 'name' | 'deviceId' | 'userId';
}

/**
 * Réponse pour mettre à jour un kidoo
 */
export interface UpdateKidooResponse extends ApiSuccess<Kidoo> {
  data: Kidoo;
  message?: string;
}

/**
 * Réponse d'erreur pour mettre à jour un kidoo
 */
export interface UpdateKidooError extends ApiError {
  field?: 'name' | 'macAddress' | 'wifiSSID';
}

/**
 * Réponse pour supprimer un kidoo
 */
export interface DeleteKidooResponse extends ApiSuccess<null> {
  data: null;
  message?: string;
}

/**
 * Réponse d'erreur pour supprimer un kidoo
 */
export interface DeleteKidooError extends ApiError {}
