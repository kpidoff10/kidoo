/**
 * Schéma pour la commande get-info
 * Demande au Kidoo d'envoyer ses informations système
 * 
 * Cette commande n'a pas de paramètres.
 */

import { z } from 'zod';

export const getInfoCommandSchema = z.object({}).optional();

export type GetInfoCommandInput = z.infer<typeof getInfoCommandSchema>;
