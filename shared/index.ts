/**
 * Exports principaux du module shared
 * Utilisé pour les imports directs depuis '@/shared'
 */

// Auth
export * from './auth/schema';
export * from './auth/type';

// Kidoos - CRUD schemas
export * from './kidoos/schemas';

// Kidoos - Config (persistant)
export * from './kidoos/config/brightness';
export * from './kidoos/config/sleep-timeout';
export * from './kidoos/config/name';
export * from './kidoos/config/dream-bedtime';

// Kidoos - Commands (temps réel)
export * from './kidoos/commands/get-info';
export * from './kidoos/commands/reboot';
