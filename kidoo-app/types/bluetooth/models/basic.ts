/**
 * Types Bluetooth spécifiques au modèle Basic
 * Étend les types de base de bluetooth.ts
 */

import {
  BluetoothCommandType as DefaultBluetoothCommandType,
  BluetoothMessage as DefaultBluetoothMessage,
  BluetoothCommand,
  BluetoothResponse,
  TypedBluetoothCommand as DefaultTypedBluetoothCommand,
  CommandToResponseMap as DefaultCommandToResponseMap,
  CommandResponse as DefaultCommandResponse,
  COMMAND_TO_MESSAGE as DEFAULT_COMMAND_TO_MESSAGE,
  MESSAGE_TO_ERROR as DEFAULT_MESSAGE_TO_ERROR,
} from '../default';

/**
 * Messages Bluetooth spécifiques au modèle Basic
 */
export enum BasicBluetoothMessage {
  /** Luminosité définie avec succès */
  BRIGHTNESS_SET = 'BRIGHTNESS_SET',
  /** Luminosité récupérée avec succès */
  BRIGHTNESS_GET = 'BRIGHTNESS_GET',
  /** Couleur définie avec succès */
  COLOR_SET = 'COLOR_SET',
  /** Effet LED défini avec succès */
  EFFECT_SET = 'EFFECT_SET',
  /** Timeout de sommeil défini avec succès */
  SLEEP_TIMEOUT_SET = 'SLEEP_TIMEOUT_SET',
  /** Timeout de sommeil récupéré avec succès */
  SLEEP_TIMEOUT_GET = 'SLEEP_TIMEOUT_GET',
  /** Mode sommeil configuré avec succès */
  SLEEP_CONFIG_SET = 'SLEEP_CONFIG_SET',
}

/**
 * Commandes Bluetooth spécifiques au modèle Basic
 */
export enum BasicBluetoothCommandType {
  /** Définir la luminosité */
  BRIGHTNESS = 'BRIGHTNESS',
  /** Obtenir la luminosité */
  GET_BRIGHTNESS = 'GET_BRIGHTNESS',
  /** Définir une couleur RGB */
  COLOR = 'COLOR',
  /** Définir un effet LED */
  EFFECT = 'EFFECT',
  /** Définir le timeout de sommeil */
  SLEEP_TIMEOUT = 'SLEEP_TIMEOUT',
  /** Obtenir le timeout de sommeil */
  GET_SLEEP_TIMEOUT = 'GET_SLEEP_TIMEOUT',
  /** Configurer le mode sommeil */
  SLEEP_CONFIG = 'SLEEP_CONFIG',
}

/**
 * Union de tous les messages Bluetooth (default + Basic)
 * Note: Ce type est réexporté depuis index.ts pour éviter les conflits
 */
export type BasicBluetoothMessageUnion = DefaultBluetoothMessage | BasicBluetoothMessage;

/**
 * Union de toutes les commandes Bluetooth (default + Basic)
 * Note: Ce type est réexporté depuis index.ts pour éviter les conflits
 */
export type BasicBluetoothCommandTypeUnion = DefaultBluetoothCommandType | BasicBluetoothCommandType;

/**
 * Commande pour définir la luminosité
 */
export interface BrightnessCommand extends BluetoothCommand {
  command: BasicBluetoothCommandType.BRIGHTNESS;
  percent: number;
}

/**
 * Commande pour obtenir la luminosité
 */
export interface GetBrightnessCommand extends BluetoothCommand {
  command: BasicBluetoothCommandType.GET_BRIGHTNESS;
}

/**
 * Commande pour définir une couleur RGB
 */
export interface ColorCommand extends BluetoothCommand {
  command: BasicBluetoothCommandType.COLOR;
  r: number;
  g: number;
  b: number;
}

/**
 * Commande pour définir un effet LED
 */
export interface EffectCommand extends BluetoothCommand {
  command: BasicBluetoothCommandType.EFFECT;
  effect: 'rainbow' | 'pulse' | 'glossy' | 'manual';
}

/**
 * Commande pour définir le timeout de sommeil
 */
export interface SleepTimeoutCommand extends BluetoothCommand {
  command: BasicBluetoothCommandType.SLEEP_TIMEOUT;
  timeout: number;
}

/**
 * Commande pour obtenir le timeout de sommeil
 */
export interface GetSleepTimeoutCommand extends BluetoothCommand {
  command: BasicBluetoothCommandType.GET_SLEEP_TIMEOUT;
}

/**
 * Commande pour configurer le mode sommeil
 */
export interface SleepConfigCommand extends BluetoothCommand {
  command: BasicBluetoothCommandType.SLEEP_CONFIG;
  timeoutMs: number;
  transitionMs: number;
}

/**
 * Union de toutes les commandes typées (default + Basic)
 */
export type TypedBluetoothCommand = DefaultTypedBluetoothCommand | 
  BrightnessCommand | 
  GetBrightnessCommand | 
  ColorCommand | 
  EffectCommand | 
  SleepTimeoutCommand | 
  GetSleepTimeoutCommand | 
  SleepConfigCommand;

/**
 * Réponse pour la commande BRIGHTNESS (setBrightness)
 */
export interface BrightnessSetResponse extends BluetoothResponse {
  status: 'success';
  message: BasicBluetoothMessage.BRIGHTNESS_SET;
  brightness: number;
  configSaved?: boolean;
}

/**
 * Réponse pour la commande GET_BRIGHTNESS (getBrightness)
 */
export interface BrightnessGetResponse extends BluetoothResponse {
  status: 'success';
  message: BasicBluetoothMessage.BRIGHTNESS_GET;
  brightness: number;
}

/**
 * Réponse pour la commande COLOR (setColor)
 */
export interface ColorSetResponse extends BluetoothResponse {
  status: 'success';
  message: BasicBluetoothMessage.COLOR_SET;
  r: number;
  g: number;
  b: number;
}

/**
 * Réponse pour la commande EFFECT (setEffect)
 */
export interface EffectSetResponse extends BluetoothResponse {
  status: 'success';
  message: BasicBluetoothMessage.EFFECT_SET;
  effect: 'rainbow' | 'pulse' | 'glossy' | 'manual';
}

/**
 * Réponse pour la commande SLEEP_TIMEOUT (setSleepTimeout)
 */
export interface SleepTimeoutSetResponse extends BluetoothResponse {
  status: 'success';
  message: BasicBluetoothMessage.SLEEP_TIMEOUT_SET;
  timeout: number;
  configSaved?: boolean;
}

/**
 * Réponse pour la commande GET_SLEEP_TIMEOUT (getSleepTimeout)
 */
export interface SleepTimeoutGetResponse extends BluetoothResponse {
  status: 'success';
  message: BasicBluetoothMessage.SLEEP_TIMEOUT_GET;
  timeout: number;
}

/**
 * Réponse pour la commande SLEEP_CONFIG (configureSleepMode)
 */
export interface SleepConfigSetResponse extends BluetoothResponse {
  status: 'success';
  message: BasicBluetoothMessage.SLEEP_CONFIG_SET;
  timeoutMs: number;
  transitionMs: number;
}

/**
 * Mapping entre commande et message attendu (default + Basic)
 */
export const COMMAND_TO_MESSAGE: Record<BasicBluetoothCommandTypeUnion, BasicBluetoothMessageUnion> = {
  ...DEFAULT_COMMAND_TO_MESSAGE as any,
  [BasicBluetoothCommandType.BRIGHTNESS]: BasicBluetoothMessage.BRIGHTNESS_SET,
  [BasicBluetoothCommandType.GET_BRIGHTNESS]: BasicBluetoothMessage.BRIGHTNESS_GET,
  [BasicBluetoothCommandType.COLOR]: BasicBluetoothMessage.COLOR_SET,
  [BasicBluetoothCommandType.EFFECT]: BasicBluetoothMessage.EFFECT_SET,
  [BasicBluetoothCommandType.SLEEP_TIMEOUT]: BasicBluetoothMessage.SLEEP_TIMEOUT_SET,
  [BasicBluetoothCommandType.GET_SLEEP_TIMEOUT]: BasicBluetoothMessage.SLEEP_TIMEOUT_GET,
  [BasicBluetoothCommandType.SLEEP_CONFIG]: BasicBluetoothMessage.SLEEP_CONFIG_SET,
};

/**
 * Mapping entre message de succès et message d'erreur correspondant (default + Basic)
 */
export const MESSAGE_TO_ERROR: Record<BasicBluetoothMessageUnion, BasicBluetoothMessageUnion> = {
  ...DEFAULT_MESSAGE_TO_ERROR as any,
  [BasicBluetoothMessage.BRIGHTNESS_SET]: BasicBluetoothMessage.BRIGHTNESS_SET, // Pas de message d'erreur spécifique
  [BasicBluetoothMessage.BRIGHTNESS_GET]: BasicBluetoothMessage.BRIGHTNESS_GET, // Pas de message d'erreur spécifique
  [BasicBluetoothMessage.COLOR_SET]: BasicBluetoothMessage.COLOR_SET, // Pas de message d'erreur spécifique
  [BasicBluetoothMessage.EFFECT_SET]: BasicBluetoothMessage.EFFECT_SET, // Pas de message d'erreur spécifique
  [BasicBluetoothMessage.SLEEP_TIMEOUT_SET]: BasicBluetoothMessage.SLEEP_TIMEOUT_SET, // Pas de message d'erreur spécifique
  [BasicBluetoothMessage.SLEEP_TIMEOUT_GET]: BasicBluetoothMessage.SLEEP_TIMEOUT_GET, // Pas de message d'erreur spécifique
  [BasicBluetoothMessage.SLEEP_CONFIG_SET]: BasicBluetoothMessage.SLEEP_CONFIG_SET, // Pas de message d'erreur spécifique
};

/**
 * Mapping entre les types de commandes et leurs réponses correspondantes (default + Basic)
 */
export type CommandToResponseMap = DefaultCommandToResponseMap & {
  [BasicBluetoothCommandType.BRIGHTNESS]: BrightnessSetResponse;
  [BasicBluetoothCommandType.GET_BRIGHTNESS]: BrightnessGetResponse;
  [BasicBluetoothCommandType.COLOR]: ColorSetResponse;
  [BasicBluetoothCommandType.EFFECT]: EffectSetResponse;
  [BasicBluetoothCommandType.SLEEP_TIMEOUT]: SleepTimeoutSetResponse;
  [BasicBluetoothCommandType.GET_SLEEP_TIMEOUT]: SleepTimeoutGetResponse;
  [BasicBluetoothCommandType.SLEEP_CONFIG]: SleepConfigSetResponse;
};

/**
 * Type helper pour extraire le type de réponse selon le type de commande (default + Basic)
 */
export type CommandResponse<T extends TypedBluetoothCommand> = 
  T extends BrightnessCommand ? BrightnessSetResponse :
  T extends GetBrightnessCommand ? BrightnessGetResponse :
  T extends ColorCommand ? ColorSetResponse :
  T extends EffectCommand ? EffectSetResponse :
  T extends SleepTimeoutCommand ? SleepTimeoutSetResponse :
  T extends GetSleepTimeoutCommand ? SleepTimeoutGetResponse :
  T extends SleepConfigCommand ? SleepConfigSetResponse :
  // Fallback vers les types par défaut
  T extends DefaultTypedBluetoothCommand ? DefaultCommandResponse<T> :
  BluetoothResponse;
