#include <Arduino.h>
#include "models/common/managers/init/init_manager.h"
#include "models/common/managers/serial/serial_commands.h"

void setup() {
  // Initialiser tous les composants du système via le gestionnaire d'initialisation
  if (!InitManager::init()) {
    Serial.println("[MAIN] ERREUR: Echec de l'initialisation du systeme");
    // Le système peut continuer avec des composants partiellement initialisés
  }
  
  // Initialiser le système de commandes Serial
  SerialCommands::init();
  
  // Afficher le statut final
  InitManager::printStatus();
}

void loop() {
  // Traiter les commandes Serial en attente
  SerialCommands::update();
  
  // Le thread LED gère tout de manière indépendante
  // Ici on peut mettre d'autres logiques (BLE, WiFi, etc.)
  
  // Petite pause pour éviter de surcharger
  delay(10);
}