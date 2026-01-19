#include <Arduino.h>
#include "models/common/managers/init/init_manager.h"
#include "models/common/managers/serial/serial_commands.h"
#include "models/common/managers/pubnub/pubnub_manager.h"
#include "models/common/managers/potentiometer/potentiometer_manager.h"
#include "models/common/managers/audio/audio_manager.h"
#include "models/model_config.h"

void setup() {
  // Forcer la fréquence CPU à 240MHz pour de meilleures performances audio
  // Par défaut, l'ESP32 peut tourner à 160MHz ou 80MHz selon la configuration
  setCpuFrequencyMhz(240);
  Serial.print("[MAIN] CPU Frequency: ");
  Serial.print(getCpuFrequencyMhz());
  Serial.println(" MHz");
  
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
  // Le thread audio gère maintenant le traitement audio automatiquement
  // avec priorité élevée, donc on n'a plus besoin de l'appeler ici
  
  // Traiter les commandes Serial en attente
  SerialCommands::update();
  
  #ifdef HAS_PUBNUB
  // Maintenir la connexion PubNub et traiter les messages
  PubNubManager::loop();
  #endif
  
  // Mettre à jour le potentiomètre (détection de changement)
  #ifdef HAS_POTENTIOMETER
  PotentiometerManager::update();
  #endif
  
  // Le thread LED gère tout de manière indépendante
  // Le thread Audio gère maintenant l'audio de manière indépendante aussi
  // Ici on peut mettre d'autres logiques (BLE, WiFi, etc.)
  
  // Petite pause pour éviter de surcharger le CPU
  delay(10);
}