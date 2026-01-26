/**
 * Routeur de commandes BLE
 * Route les commandes vers les handlers appropriés
 */

import { Device } from 'react-native-ble-plx';
import { sendSetupCommand, SetupCommandOptions, SetupCommandResult } from './setup/setupCommand';

/**
 * Enum des commandes BLE disponibles
 */
export enum BLECommand {
  SETUP = 'setup',
  // Ajouter d'autres commandes ici au fur et à mesure
  // PING = 'ping',
  // STATUS = 'status',
}

/**
 * Type pour les résultats de commandes
 */
export type CommandResult = SetupCommandResult;

/**
 * Options pour l'exécution d'une commande
 */
export interface CommandOptions {
  [key: string]: unknown;
  timeoutMs?: number;
}

/**
 * Routeur de commandes BLE
 * Exécute la commande appropriée selon le nom de la commande
 * 
 * @param device Device BLE connecté
 * @param command Commande à exécuter (enum BLECommand)
 * @param options Options de la commande (données et timeout)
 * @returns Résultat de la commande
 * 
 * @example
 * ```ts
 * // Commande setup avec données WiFi
 * const result = await routeCommand(device, BLECommand.SETUP, {
 *   ssid: 'MyWiFi',
 *   password: 'password123',
 *   timeoutMs: 30000
 * });
 * 
 * // Commande setup sans données
 * const result = await routeCommand(device, BLECommand.SETUP, {
 *   timeoutMs: 30000
 * });
 * ```
 */
export async function routeCommand(
  device: Device,
  command: BLECommand | string,
  options: CommandOptions = {}
): Promise<CommandResult> {
  const { timeoutMs, ...commandData } = options;
  
  // Normaliser la commande en string (pour supporter l'enum ou une string)
  const commandStr = typeof command === 'string' ? command.toLowerCase() : String(command).toLowerCase();

  switch (commandStr) {
    case BLECommand.SETUP:
    case 'setup': {
      const setupOptions: SetupCommandOptions = {
        params: commandData.ssid
          ? {
              ssid: commandData.ssid as string,
              password: commandData.password as string | undefined,
            }
          : undefined,
        timeoutMs: timeoutMs as number | undefined,
      };
      return await sendSetupCommand(device, setupOptions);
    }

    default:
      throw new Error(`Commande inconnue: ${command}`);
  }
}
