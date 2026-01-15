/**
 * Point d'entrée principal pour les schémas et types partagés
 * Exporte tous les schémas et types depuis un seul endroit
 */

// Schémas
export * from './schemas/auth';
export * from './schemas/kidoo';
export * from './schemas/multimedia';
export * from './schemas/tag';

// Types
export * from './types/api'; // Exporte depuis types/api/index.ts qui gère tous les exports
export * from './types/kidoo';
export * from './types/tag';
export * from './types/user';
