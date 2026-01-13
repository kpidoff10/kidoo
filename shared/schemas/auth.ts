import { z } from 'zod';

/**
 * Schéma de validation pour l'inscription d'un nouvel utilisateur
 */
export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom est trop long'),
});

/**
 * Type TypeScript dérivé du schéma d'inscription
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Schéma de validation pour la connexion (credentials)
 */
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

/**
 * Type TypeScript dérivé du schéma de connexion
 */
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Schéma de validation pour l'email uniquement
 */
export const emailSchema = z.string().email('Email invalide');

/**
 * Type TypeScript pour un email validé
 */
export type EmailInput = z.infer<typeof emailSchema>;

/**
 * Schéma de validation pour la mise à jour du profil utilisateur
 */
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom est trop long').optional(),
  avatar: z.string().url('URL invalide').optional().or(z.literal('')),
});

/**
 * Type TypeScript dérivé du schéma de mise à jour du profil
 */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
