/**
 * Schémas de validation pour le contenu multimédia
 */

import { z } from 'zod';

/**
 * Schéma de validation pour l'étape 1 du formulaire multimédia
 * L'utilisateur doit accepter les conditions d'utilisation
 */
export const multimediaFormSchema = z.object({
  // Acceptation des conditions d'utilisation (requis pour passer à l'étape suivante)
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter les conditions pour continuer',
  }),
  // Fichier audio sélectionné (requis pour passer à l'étape suivante)
  audioFile: z
    .object({
      uri: z.string(),
      name: z.string(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
    })
    .optional()
    .refine((val) => val !== undefined, {
      message: 'Vous devez sélectionner un fichier audio',
    }),
  // Informations de découpage (optionnel, si l'utilisateur veut couper l'audio)
  trimStart: z.number().min(0).optional(),
  trimEnd: z.number().min(0).optional(),
  // TODO: Ajouter les champs selon les besoins (titre, etc.)
  title: z.string().optional(),
});

/**
 * Type TypeScript dérivé du schéma de formulaire multimédia
 */
export type MultimediaFormData = z.infer<typeof multimediaFormSchema>;
