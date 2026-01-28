/**
 * Schémas de validation pour les Kidoos (CRUD)
 */

import { z } from 'zod';

/**
 * Schéma pour créer un Kidoo
 */
export const createKidooInputSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Nom trop long'),
  model: z.string().min(1, 'Le modèle est requis'),
  macAddress: z.string().optional(), // Adresse MAC WiFi (renvoyée par l'ESP32 lors du setup)
  bluetoothMacAddress: z.string().optional(), // Adresse MAC Bluetooth (pour comparer lors des scans automatiques)
  deviceId: z.string().uuid(),
  wifiSSID: z.string().optional(),
  firmwareVersion: z.string().optional(),
  brightness: z.number().int().min(0).max(100).optional(), // Brightness en pourcentage (0-100)
  sleepTimeout: z.number().int().min(0).optional(), // Sleep timeout en millisecondes
});

export type CreateKidooInput = z.infer<typeof createKidooInputSchema>;

/**
 * Schéma pour le nom du Kidoo (utilisé dans le formulaire d'ajout - step 1)
 * Extrait du schéma de création complet
 */
export const kidooNameSchema = createKidooInputSchema.pick({ name: true });

export type KidooNameInput = z.infer<typeof kidooNameSchema>;

/**
 * Schéma pour les identifiants WiFi (utilisé dans le formulaire d'ajout - step 2)
 * Extrait du schéma de création complet avec ajout du mot de passe
 * Le SSID est obligatoire, le mot de passe est optionnel
 */
export const kidooWiFiSchema = createKidooInputSchema.pick({ wifiSSID: true }).extend({
  wifiSSID: z.string().min(1, 'Le SSID WiFi est requis').max(64, 'SSID trop long'),
  wifiPassword: z.string().max(128, 'Mot de passe trop long').optional(),
});

export type KidooWiFiInput = z.infer<typeof kidooWiFiSchema>;

/**
 * Schéma pour mettre à jour un Kidoo
 */
export const updateKidooInputSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Nom trop long').optional(),
  model: z.string().optional(),
  macAddress: z.string().optional(),
  bluetoothMacAddress: z.string().optional(),
  wifiSSID: z.string().optional(),
});

export type UpdateKidooInput = z.infer<typeof updateKidooInputSchema>;
