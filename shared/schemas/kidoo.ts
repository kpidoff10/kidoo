/**
 * Schémas de validation pour les Kidoos
 */

import { z } from 'zod';

/**
 * Schéma de validation pour créer un nouveau kidoo
 */
export const createKidooInputSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  model: z.string().min(1, 'Le modèle est requis').max(50, 'Le modèle est trop long').default('classic'),
  deviceId: z.string().min(1, 'Le deviceId est requis').max(100, 'Le deviceId est trop long'),
  macAddress: z.string().optional(),
  firmwareVersion: z.string().optional().nullable(),
});

/**
 * Type TypeScript dérivé du schéma de création de kidoo
 */
export type CreateKidooInput = z.infer<typeof createKidooInputSchema>;

/**
 * Schéma de validation pour mettre à jour un kidoo
 */
export const updateKidooInputSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long').optional(),
  macAddress: z.string().optional().nullable(),
  wifiSSID: z.string().optional().nullable(),
  isConnected: z.boolean().optional(),
  lastConnected: z.string().datetime().optional().nullable(),
});

/**
 * Type TypeScript dérivé du schéma de mise à jour de kidoo
 */
export type UpdateKidooInput = z.infer<typeof updateKidooInputSchema>;

/**
 * Schéma de validation pour le setup d'un Kidoo (étape 1 : nom)
 */
export const kidooSetupStep1Schema = z.object({
  deviceName: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
});

/**
 * Schéma de validation pour le setup d'un Kidoo (étape 2 : WiFi)
 */
export const kidooSetupStep2Schema = z.object({
  wifiSSID: z.string().min(1, 'Le SSID WiFi est requis').max(100, 'Le SSID est trop long'),
  wifiPassword: z.string().optional(),
});

/**
 * Schéma de validation complet pour le setup d'un Kidoo
 */
export const kidooSetupSchema = z.object({
  deviceName: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  wifiSSID: z.string().min(1, 'Le SSID WiFi est requis').max(100, 'Le SSID est trop long'),
  wifiPassword: z.string().optional(),
});

/**
 * Types TypeScript dérivés des schémas de setup
 */
export type KidooSetupStep1Input = z.infer<typeof kidooSetupStep1Schema>;
export type KidooSetupStep2Input = z.infer<typeof kidooSetupStep2Schema>;
export type KidooSetupInput = z.infer<typeof kidooSetupSchema>;