#ifndef SERIAL_COMMANDS_H
#define SERIAL_COMMANDS_H

#include <Arduino.h>

/**
 * Commandes Serial communes à tous les modèles
 * 
 * Ce fichier contient les commandes Serial de base
 * qui sont disponibles sur tous les modèles
 */

class SerialCommands {
public:
  /**
   * Initialiser le système de commandes Serial
   */
  static void init();
  
  /**
   * Traiter une commande reçue via Serial
   * @param command La commande à traiter
   */
  static void processCommand(const String& command);
  
  /**
   * Afficher l'aide des commandes disponibles
   */
  static void printHelp();
  
  /**
   * Vérifier et traiter les commandes en attente
   * À appeler régulièrement dans loop()
   */
  static void update();

private:
  // Commandes communes
  static void cmdHelp();
  static void cmdReboot(const String& args);
  static void cmdInfo();
  static void cmdMemory();
  static void cmdClear();
  static void cmdBrightness(const String& args);
  static void cmdSleep(const String& args);
  static void cmdBLE();
  
  static bool initialized;
  static String inputBuffer;
};

#endif // SERIAL_COMMANDS_H
