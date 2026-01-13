/**
 * Types pour les utilisateurs partagés entre le client et le serveur
 */

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  emailVerified?: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  createdAt: number; // Timestamp pour compatibilité mobile
  updatedAt: number; // Timestamp pour compatibilité mobile
}
