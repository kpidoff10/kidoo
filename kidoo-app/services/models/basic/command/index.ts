/**
 * Point d'entrée pour toutes les actions du modèle Basic
 * 
 * Ce fichier regroupe toutes les actions spécifiques au modèle Basic,
 * organisées par domaine (brightness, color, effects, sleep, storage, tag)
 */

import { BasicBrightnessAction } from './basic-command-brightness';
import { BasicColorAction } from './basic-command-color';
import { BasicEffectAction } from './basic-command-effects';
import { BasicSleepModeAction } from './basic-command-sleep-mode';
import { BasicStorageAction } from './basic-command-storage';
import { CommonKidooActions } from '../../common/command';

/**
 * Actions spécifiques au modèle Basic
 * Hérite des méthodes communes de CommonKidooActions
 * et regroupe toutes les actions spécifiques au modèle Basic
 */
export class BasicKidooActions extends CommonKidooActions {
  // Actions pour la luminosité
  static setBrightness = BasicBrightnessAction.setBrightness;
  static getBrightness = BasicBrightnessAction.getBrightness;

  // Actions pour les effets LED
  static setEffect = BasicEffectAction.setEffect;

  // Actions pour le mode sommeil
  static configureSleepMode = BasicSleepModeAction.configureSleepMode;
  static setSleepTimeout = BasicSleepModeAction.setSleepTimeout;
  static getSleepTimeout = BasicSleepModeAction.getSleepTimeout;

  // Actions pour le stockage
  static getStorage = BasicStorageAction.getStorage;

  // Actions pour la couleur
  static setColor = BasicColorAction.setColor;
}

// Réexporter les classes d'actions individuelles pour un accès direct si nécessaire
export { BasicBrightnessAction } from './basic-command-brightness';
export { BasicColorAction } from './basic-command-color';
export { BasicEffectAction } from './basic-command-effects';
export { BasicSleepModeAction } from './basic-command-sleep-mode';
export { BasicStorageAction } from './basic-command-storage';

// Réexporter les types pour faciliter les imports
export type {
  BrightnessOptions,
  ColorOptions,
  EffectOptions,
  SleepModeOptions,
  SleepTimeoutOptions,
} from './type';
