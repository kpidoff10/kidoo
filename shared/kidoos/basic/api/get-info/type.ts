/**
 * Types de réponse get-info spécifiques au modèle Basic
 */

import { KidooInfoResponse } from '../../../common/api/get-info/type';

/**
 * Champs spécifiques au Kidoo Basic
 */
export interface KidooBasicInfoExtension {
  brightness: number;
  sleepTimeout: number;
  storage: {
    total: number;
    free: number;
    used: number;
  };
  nfc: {
    available: boolean;
  };
}

/**
 * Réponse complète pour un Kidoo Basic
 */
export type KidooBasicInfoResponse = KidooInfoResponse<KidooBasicInfoExtension>;
