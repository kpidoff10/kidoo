#include <Arduino.h>
#include "models/common/managers/init/init_manager.h"
#include "models/common/managers/serial/serial_commands.h"
#include "models/common/managers/pubnub/pubnub_manager.h"
#include "models/common/managers/potentiometer/potentiometer_manager.h"
#include "models/model_config.h"
#include "models/common/config/core_config.h"

#ifdef HAS_WIFI
#include "models/common/managers/wifi/wifi_manager.h"
#endif

#ifdef HAS_BLE
#include "models/common/managers/ble_config/ble_config_manager.h"
#endif

// Handler NFC spécifique au modèle Basic uniquement
#ifdef KIDOO_MODEL_BASIC
#include "models/basic/nfc/nfc_tag_handler.h"
#endif

/**
 * Architecture multi-cœurs ESP32 (auto-détectée)
 * ==============================================
 * 
 * La configuration s'adapte automatiquement au type de chip :
 * 
 * ESP32-S3 (Basic) : Dual-core + PSRAM
 * - Core 0 : WiFi stack, PubNub, WiFi retry
 * - Core 1 : loop(), LEDManager, BLE
 * - PSRAM pour les buffers
 * 
 * ESP32-C3 (Mini) : Single-core RISC-V
 * - Core 0 : Tout (seul cœur disponible)
 * - Priorités ajustées pour éviter les conflits
 * - Pas de PSRAM
 * 
 * Voir core_config.h pour la configuration complète.
 */

void setup() {
  // Forcer la fréquence CPU maximale pour de meilleures performances
  // ESP32-S3 : 240MHz, ESP32-C3 : 160MHz max
  #if IS_SINGLE_CORE
  setCpuFrequencyMhz(160);  // ESP32-C3 max = 160MHz
  #else
  setCpuFrequencyMhz(240);  // ESP32-S3 max = 240MHz
  #endif
  
  Serial.print("[MAIN] CPU Frequency: ");
  Serial.print(getCpuFrequencyMhz());
  Serial.println(" MHz");
  
  // Afficher l'architecture CPU détectée (depuis core_config.h)
  printCoreArchitecture();
  
  // Afficher les statistiques mémoire (depuis core_config.h)
  printMemoryStats();
  
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
  // ====================================================================
  // loop() Arduino - Core dépend du chip
  // ====================================================================
  // - ESP32-S3 (Basic) : Core 1 (APP_CPU)
  // - ESP32-C3 (Mini)  : Core 0 (seul cœur)
  // Les threads FreeRTOS gèrent les tâches temps-réel indépendamment.
  // ====================================================================
  
  // Traiter les commandes Serial en attente
  SerialCommands::update();
  
  #ifdef HAS_PUBNUB
  // Note: PubNubManager::loop() ne fait plus rien - le thread gère tout
  // On garde l'appel pour compatibilité mais il est vide
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
  
  // Mettre à jour le gestionnaire de tags NFC (détection retrait tag)
  #ifdef KIDOO_MODEL_BASIC
  NFCTagHandler::update();
  #endif
  
  // Mettre à jour le gestionnaire BLE Config (détection appui bouton)
  #ifdef HAS_BLE
  if (HAS_BLE) {
    #ifdef BLE_CONFIG_BUTTON_PIN
    BLEConfigManager::update();
    #endif
  }
  #endif
  
  // ====================================================================
  // Threads indépendants (gérés par FreeRTOS, ne pas appeler ici) :
  // - LEDManager   : CORE_LED, PRIORITY_LED, animations temps-réel
  // - AudioManager : CORE_AUDIO, PRIORITY_AUDIO, lecture I2S temps-réel
  // - PubNubManager: CORE_PUBNUB, PRIORITY_PUBNUB, HTTP polling
  // - WiFi retry   : CORE_WIFI_RETRY, PRIORITY_WIFI_RETRY, reconnexion
  // (voir core_config.h pour les valeurs selon le chip)
  // ====================================================================
  
  // Petite pause pour éviter de surcharger le CPU
  delay(10);
}