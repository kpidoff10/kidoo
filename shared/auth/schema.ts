/**
 * Schémas de validation pour l'authentification
 */

import { z } from 'zod';

/**
 * Schéma de validation pour l'email
 */
export const emailSchema = z.string().email('Email invalide');

/**
 * Schéma de validation pour le mot de passe
 */
export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères');

/**
 * Schéma de validation pour l'inscription
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Schéma de validation pour le changement de mot de passe
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: passwordSchema,
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
