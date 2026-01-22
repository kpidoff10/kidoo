#include "model_serial_commands.h"
#include "../../model_config.h"
#include <Arduino.h>

/**
 * Commandes Serial spécifiques au modèle Kidoo Dream
 */

bool ModelDreamSerialCommands::processCommand(const String& command) {
  // Séparer la commande et les arguments
  int spaceIndex = command.indexOf(' ');
  String cmd = command;
  String args = "";
  
  if (spaceIndex > 0) {
    cmd = command.substring(0, spaceIndex);
    args = command.substring(spaceIndex + 1);
  }
  
  cmd.toLowerCase();
  cmd.trim();
  args.trim();
  
  // Traiter les commandes spécifiques au Dream
  if (cmd == "dream-info") {
    Serial.println("[DREAM] Informations specifiques au modele Dream");
    Serial.println("[DREAM] Nombre de LEDs: 40");
    Serial.println("[DREAM] Modele: Kidoo Dream");
    Serial.println("[DREAM] NFC: Non disponible");
    return true;
  }
  
  return false; // Commande non reconnue
}

void ModelDreamSerialCommands::printHelp() {
  Serial.println("");
  Serial.println("========================================");
  Serial.println("  COMMANDES SPECIFIQUES DREAM");
  Serial.println("========================================");
  Serial.println("  dream-info     - Afficher les infos du modele Dream");
  Serial.println("========================================");
  Serial.println("");
}
