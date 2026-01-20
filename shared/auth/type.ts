/**
 * Types API pour l'authentification
 */

import type { ApiError } from '../types/common';

/**
 * Réponse d'inscription réussie
 */
export interface RegisterResponse {
  success: true;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
  };
}

/**
 * Réponse d'inscription en erreur
 */
export interface RegisterError extends ApiError {
  field?: 'email' | 'password' | 'name';
}

/**
 * Réponse de connexion réussie
 */
export interface LoginResponse {
  success: true;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  token?: string; // Token JWT si fourni par l'API
}

/**
 * Réponse de connexion en erreur
 */
export interface LoginError extends ApiError {
  field?: 'email' | 'password' | 'credentials';
}

/**
 * Réponse de vérification d'email
 */
export interface CheckEmailResponse {
  success: true;
  available: boolean;
  message: string;
}

/**
 * Type pour les informations utilisateur de session
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
}
