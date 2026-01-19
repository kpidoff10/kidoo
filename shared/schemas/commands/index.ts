/**
 * Schémas de validation pour les commandes Kidoo
 * 
 * Ces schémas sont partagés entre le serveur et l'app mobile
 * pour valider les données avant envoi/réception.
 * 
 * Structure:
 * - common/ : Commandes disponibles pour tous les modèles
 * - basic/  : Commandes spécifiques au modèle Basic
 */

import { z } from 'zod';

// Export des commandes par catégorie
export * from './common';
export * from './basic';

// ============================================
// Schéma générique pour POST /commands
// ============================================

/**
 * Schéma pour la route POST /api/kidoos/[id]/commands
 * Utilisé quand on passe par le dispatcher avec action
 */
export const commandRequestSchema = z.object({
  action: z.string().min(1, 'Action requise'),
}).passthrough(); // Permet les paramètres additionnels selon l'action

export type CommandRequestInput = z.infer<typeof commandRequestSchema>;
