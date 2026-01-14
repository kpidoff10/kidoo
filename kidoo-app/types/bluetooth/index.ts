/**
 * Point d'entrée pour tous les types Bluetooth
 * Exporte les types de base et les types spécifiques aux modèles
 */

// Imports des types par défaut (communs à tous les modèles)
import {
  BluetoothMessage as DefaultBluetoothMessage,
  BluetoothCommandType as DefaultBluetoothCommandType,
  COMMAND_TO_MESSAGE as DEFAULT_COMMAND_TO_MESSAGE,
  MESSAGE_TO_ERROR as DEFAULT_MESSAGE_TO_ERROR,
  BluetoothResponse,
  BluetoothCommand,
  SetupCommand,
  WriteNFCTagCommand,
  ReadNFCTagCommand,
  TagAddSuccessCommand,
  GetStorageCommand,
  TypedBluetoothCommand as DefaultTypedBluetoothCommand,
  CommandToResponseMap as DefaultCommandToResponseMap,
  CommandResponse as DefaultCommandResponse,
  WifiSetupResponse,
  NFCTagReadResponse,
  NFCTagWriteResponse,
  TagAddSuccessResponse,
  SystemInfoResponse,
  StorageGetResponse,
} from './default';

// Imports des types Basic
import {
  BasicBluetoothMessage,
  BasicBluetoothCommandType,
  COMMAND_TO_MESSAGE as BASIC_COMMAND_TO_MESSAGE,
  MESSAGE_TO_ERROR as BASIC_MESSAGE_TO_ERROR,
  BrightnessCommand,
  GetBrightnessCommand,
  ColorCommand,
  EffectCommand,
  SleepTimeoutCommand,
  GetSleepTimeoutCommand,
  SleepConfigCommand,
  BrightnessSetResponse,
  BrightnessGetResponse,
  ColorSetResponse,
  EffectSetResponse,
  SleepTimeoutSetResponse,
  SleepTimeoutGetResponse,
  SleepConfigSetResponse,
  TypedBluetoothCommand as BasicTypedBluetoothCommand,
  CommandToResponseMap as BasicCommandToResponseMap,
} from './models/basic';

// Réexporter les types par défaut (communs à tous les modèles)
export {
  DefaultBluetoothMessage as BluetoothMessage,
  DefaultBluetoothCommandType as BluetoothCommandType,
  BluetoothResponse,
  BluetoothCommand,
  SetupCommand,
  WriteNFCTagCommand,
  ReadNFCTagCommand,
  TagAddSuccessCommand,
  GetStorageCommand,
  WifiSetupResponse,
  NFCTagReadResponse,
  NFCTagWriteResponse,
  TagAddSuccessResponse,
  SystemInfoResponse,
  StorageGetResponse,
};

// Réexporter les types Basic
export {
  BasicBluetoothMessage,
  BasicBluetoothCommandType,
  BrightnessCommand,
  GetBrightnessCommand,
  ColorCommand,
  EffectCommand,
  SleepTimeoutCommand,
  GetSleepTimeoutCommand,
  SleepConfigCommand,
  BrightnessSetResponse,
  BrightnessGetResponse,
  ColorSetResponse,
  EffectSetResponse,
  SleepTimeoutSetResponse,
  SleepTimeoutGetResponse,
  SleepConfigSetResponse,
};

/**
 * Union de tous les messages Bluetooth (default + Basic)
 */
export type BluetoothMessageUnion = DefaultBluetoothMessage | BasicBluetoothMessage;

/**
 * Union de toutes les commandes Bluetooth (default + Basic)
 */
export type BluetoothCommandTypeUnion = DefaultBluetoothCommandType | BasicBluetoothCommandType;

/**
 * Union de toutes les commandes typées (default + Basic)
 */
export type TypedBluetoothCommand = DefaultTypedBluetoothCommand | BasicTypedBluetoothCommand;

/**
 * Mapping combiné entre les types de commandes et leurs réponses (default + Basic)
 */
export type CommandToResponseMap = DefaultCommandToResponseMap & BasicCommandToResponseMap;

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
  T extends TagAddSuccessCommand ? TagAddSuccessResponse :
  T extends DefaultTypedBluetoothCommand ? DefaultCommandResponse<T> :
  BluetoothResponse;

/**
 * Mapping combiné entre commande et message attendu (default + Basic)
 */
export const COMMAND_TO_MESSAGE: Record<BluetoothCommandTypeUnion, BluetoothMessageUnion> = {
  ...DEFAULT_COMMAND_TO_MESSAGE,
  ...BASIC_COMMAND_TO_MESSAGE,
} as Record<BluetoothCommandTypeUnion, BluetoothMessageUnion>;

/**
 * Mapping combiné entre message de succès et message d'erreur (default + Basic)
 */
export const MESSAGE_TO_ERROR: Record<BluetoothMessageUnion, BluetoothMessageUnion> = {
  ...DEFAULT_MESSAGE_TO_ERROR,
  ...BASIC_MESSAGE_TO_ERROR,
} as Record<BluetoothMessageUnion, BluetoothMessageUnion>;
