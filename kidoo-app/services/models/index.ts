/**
 * Point d'entrée principal pour tous les services liés aux modèles de Kidoo
 * 
 * Ce fichier centralise tous les exports des différents modèles (common, basic, etc.)
 * pour faciliter les imports dans l'application.
 * 
 * Usage:
 * ```tsx
 * // Importer depuis le point d'entrée principal
 * import { createKidoo, getKidooById } from '@/services/models';
 * import { BasicKidooActions } from '@/services/models';
 * import { useBasicKidoo } from '@/services/models';
 * ```
 */

// ============================================================================
// COMMON - Fonctionnalités communes à tous les modèles
// ============================================================================

// API communes
export * from './common/api';

// Commandes communes
export * from './common/command';

// Contextes communs
export { KidooProvider, useKidoo, type KidooContextValue } from './common/contexts/KidooContext';

// Hooks communs
export * from './common/hooks/useKidoos';

// ============================================================================
// BASIC - Fonctionnalités spécifiques au modèle Basic
// ============================================================================

// API Basic
export * from './basic/api';

// Commandes Basic
export * from './basic/command';

// Contextes Basic
export { BasicKidooProvider, useBasicKidoo } from './basic/contexts/BasicKidooContext';

// Hooks Basic
export * from './basic/hooks/use-basic-get-storage';
export * from './basic/hooks/use-basic-multimedia';

// ============================================================================
// TYPES - Types partagés pour les mappings de synchronisation
// ============================================================================

export * from './types';

