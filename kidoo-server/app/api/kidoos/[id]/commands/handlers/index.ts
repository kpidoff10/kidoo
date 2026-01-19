/**
 * Router des commandes - Dispatch vers les handlers appropriés
 * 
 * Structure similaire à l'ESP32:
 * - common/ : Commandes disponibles pour tous les modèles
 * - basic/  : Commandes spécifiques au modèle Basic
 */

import type { Kidoo, KidooConfigBasic } from '@prisma/client';
import * as commonHandlers from './common';
import * as basicHandlers from './basic';

// Type pour un Kidoo avec sa config
export type KidooWithConfig = Kidoo & {
  configBasic: KidooConfigBasic | null;
};

// Type pour le résultat d'une commande
export interface CommandResult {
  success: boolean;
  error?: string;
  message?: string;
  data?: unknown;
  status?: number;
}

// Type pour un handler de commande
export type CommandHandler = (
  kidoo: KidooWithConfig,
  params: Record<string, unknown>
) => Promise<CommandResult>;

// Type pour la définition d'une commande
export interface CommandDefinition {
  name: string;
  description: string;
  params?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    min?: number;
    max?: number;
  }[];
}

/**
 * Récupère les commandes disponibles pour un modèle
 */
export function getAvailableCommands(model: string): CommandDefinition[] {
  const commands: CommandDefinition[] = [];

  // Commandes communes à tous les modèles
  commands.push(...commonHandlers.definitions);

  // Commandes spécifiques au modèle
  const modelLower = model.toLowerCase();
  
  if (modelLower === 'basic') {
    commands.push(...basicHandlers.definitions);
  }
  // Ajouter d'autres modèles ici (mini, etc.)

  return commands;
}

/**
 * Traite une commande
 */
export async function processCommand(
  kidoo: KidooWithConfig,
  action: string,
  params: Record<string, unknown>
): Promise<CommandResult> {
  const actionLower = action.toLowerCase();
  const modelLower = kidoo.model.toLowerCase();

  // Chercher d'abord dans les commandes communes
  const commonHandler = commonHandlers.handlers[actionLower];
  if (commonHandler) {
    return commonHandler(kidoo, params);
  }

  // Chercher dans les commandes spécifiques au modèle
  if (modelLower === 'basic') {
    const basicHandler = basicHandlers.handlers[actionLower];
    if (basicHandler) {
      return basicHandler(kidoo, params);
    }
  }
  // Ajouter d'autres modèles ici

  // Commande non trouvée
  return {
    success: false,
    error: `Commande '${action}' non reconnue pour le modèle ${kidoo.model}`,
    status: 400,
  };
}
