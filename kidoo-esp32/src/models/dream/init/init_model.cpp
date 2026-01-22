#include "init_model.h"
#include "../../common/managers/init/init_manager.h"

/**
 * Initialisation spécifique au modèle Kidoo Dream
 */

bool InitModelDream::configure() {
  // Configuration spécifique au Dream avant l'initialisation
  Serial.println("[INIT] Configuration modele Dream");
  
  return true;
}

bool InitModelDream::init() {
  // Initialisation spécifique au Dream après l'initialisation des composants communs
  Serial.println("");
  Serial.println("========================================");
  Serial.println("[INIT-DREAM] Initialisation modele Dream");
  Serial.println("========================================");
  
  // Note: Dream n'a pas de NFC, donc pas d'initialisation du handler NFC
  
  return true;
}
