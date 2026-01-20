#include <Arduino.h>
#include <esp_psram.h>
#include "models/common/managers/init/init_manager.h"
#include "models/common/managers/serial/serial_commands.h"
#include "models/common/managers/pubnub/pubnub_manager.h"
#include "models/common/managers/potentiometer/potentiometer_manager.h"
#include "models/common/managers/audio/audio_manager.h"
#include "models/model_config.h"

#ifdef HAS_WIFI
#include "models/common/managers/wifi/wifi_manager.h"
#endif

void setup() {
  // Forcer la fréquence CPU à 240MHz pour de meilleures performances audio
  // Par défaut, l'ESP32 peut tourner à 160MHz ou 80MHz selon la configuration
  setCpuFrequencyMhz(240);
  Serial.print("[MAIN] CPU Frequency: ");
  Serial.print(getCpuFrequencyMhz());
  Serial.println(" MHz");
  
  // Initialiser et afficher les infos PSRAM (8MB OPI sur DevKitC-1-N16R8)
  if (psramFound()) {
    Serial.println("[MAIN] PSRAM detectee!");
    Serial.print("[MAIN] PSRAM Size: ");
    Serial.print(ESP.getPsramSize() / 1024 / 1024);
    Serial.println(" MB");
    Serial.print("[MAIN] PSRAM Free: ");
    Serial.print(ESP.getFreePsram() / 1024 / 1024);
    Serial.println(" MB");
  } else {
    Serial.println("[MAIN] WARNING: PSRAM non detectee!");
  }
  
  // Afficher la mémoire interne
  Serial.print("[MAIN] Heap Size: ");
  Serial.print(ESP.getHeapSize() / 1024);
  Serial.println(" KB");
  Serial.print("[MAIN] Heap Free: ");
  Serial.print(ESP.getFreeHeap() / 1024);
  Serial.println(" KB");
  
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
  
  // Vérifier si PubNub doit se connecter automatiquement quand le WiFi devient disponible
  // (si PubNub est initialisé mais pas connecté, et que le WiFi est maintenant connecté)
  if (PubNubManager::isInitialized() && !PubNubManager::isConnected()) {
    #ifdef HAS_WIFI
    if (WiFiManager::isConnected()) {
      // WiFi est connecté, tenter de connecter PubNub
      PubNubManager::connect();
    }
    #endif
  }
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