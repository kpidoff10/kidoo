#include "init_manager.h"
#include "../led/led_manager.h"
#include "../sd/sd_manager.h"
#include "../serial/serial_manager.h"
#include "../log/log_manager.h"
#include "../nfc/nfc_manager.h"
#include "../ble/ble_manager.h"
#include "../wifi/wifi_manager.h"
#include "../../../model_config.h"
#include "../../../../../color/colors.h"
#include "../../../model_init.h"

// Variables statiques
SystemStatus InitManager::systemStatus = {
  INIT_NOT_STARTED,  // serial
  INIT_NOT_STARTED,  // led
  INIT_NOT_STARTED,  // sd
  INIT_NOT_STARTED,  // nfc
  INIT_NOT_STARTED,  // ble
  INIT_NOT_STARTED   // wifi
};
bool InitManager::initialized = false;
SDConfig* InitManager::globalConfig = nullptr;

bool InitManager::init() {
  // 1. Initialiser la communication série EN PREMIER (priorité absolue)
  // On ne peut pas utiliser Serial.println avant !
  if (!initSerial()) {
    // Si Serial échoue, on ne peut pas afficher de message
    // Le système continuera mais sans debug série
    return false;
  }
  
  // Initialiser le SerialManager après que Serial soit prêt
  SerialManager::init();
  
  // Initialiser le LogManager après que Serial et SD soient prêts
  LogManager::init();
  
  // Maintenant on peut utiliser Serial
  if (initialized) {
    return true;
  }
  
  Serial.println("");
  Serial.println("========================================");
  Serial.print("     KIDOO ESP32 ");
  Serial.print(KIDOO_MODEL_NAME);
  Serial.println(" - DEMARRAGE");
  Serial.println("========================================");
  Serial.println("");
  
  // Configuration spécifique au modèle (avant l'initialisation des composants)
  if (!InitModel::configure()) {
    Serial.println("[INIT] ERREUR: Configuration modele echouee");
    return false;
  }
  
  bool allSuccess = true;
  
  // ÉTAPE 1 : Initialiser la carte SD et récupérer la configuration (CRITIQUE)
  if (!initSD()) {
    Serial.println("[INIT] ERREUR: Carte SD non disponible");
    
    // Initialiser les LEDs en mode d'erreur (respiration rouge)
    if (initLED()) {
      LEDManager::setColor(COLOR_ERROR);
      LEDManager::setEffect(LED_EFFECT_PULSE);
    }
    
    initialized = true;
    return false;
  }
  delay(100);
  
  // ÉTAPE 2 : Initialiser le gestionnaire LED
  if (!initLED()) {
    Serial.println("[INIT] ERREUR: Echec LED");
    allSuccess = false;
  }
  delay(100);
  
  // ÉTAPE 3 : Initialiser le gestionnaire NFC (optionnel)
  initNFC();  // Affiche un WARNING si non opérationnel, mais n'empêche pas l'initialisation
  delay(100);
  
  // Initialisation spécifique au modèle (après l'initialisation des composants communs)
  if (!InitModel::init()) {
    Serial.println("[INIT] ERREUR: Initialisation modele echouee");
    allSuccess = false;
  }
  delay(100);
  
  // ÉTAPE 4 : Initialiser le BLE (après l'init complète)
  initBLE();  // Affiche un WARNING si non opérationnel, mais n'empêche pas l'initialisation
  delay(100);
  
  // ÉTAPE 5 : Initialiser le WiFi et se connecter si configuré
  initWiFi();  // Tente de se connecter au WiFi configuré dans config.json
  
  initialized = true;
  
  if (allSuccess) {
    Serial.println("[INIT] OK");
    // Mettre les LEDs en vert qui tourne pour indiquer que tout est OK
    if (systemStatus.led == INIT_SUCCESS) {
      LEDManager::setColor(COLOR_SUCCESS);
      LEDManager::setEffect(LED_EFFECT_ROTATE);
    }
  } else {
    Serial.println("[INIT] ERREUR");
    printStatus();
  }
  
  return allSuccess;
}

// Les fonctions d'initialisation communes sont dans models/common/init/
// models/common/init/init_serial.cpp, models/common/init/init_sd.cpp, models/common/init/init_led.cpp, models/common/init/init_nfc.cpp, models/common/init/init_ble.cpp, models/common/init/init_wifi.cpp

SystemStatus InitManager::getStatus() {
  return systemStatus;
}

bool InitManager::isSystemReady() {
  return systemStatus.isFullyInitialized();
}

InitStatus InitManager::getComponentStatus(const char* componentName) {
  if (strcmp(componentName, "serial") == 0) {
    return systemStatus.serial;
  } else if (strcmp(componentName, "led") == 0) {
    return systemStatus.led;
  } else if (strcmp(componentName, "sd") == 0) {
    return systemStatus.sd;
  } else if (strcmp(componentName, "nfc") == 0) {
    return systemStatus.nfc;
  } else if (strcmp(componentName, "ble") == 0) {
    return systemStatus.ble;
  } else if (strcmp(componentName, "wifi") == 0) {
    return systemStatus.wifi;
  }
  // Ajouter d'autres composants ici
  
  return INIT_NOT_STARTED;
}

void InitManager::printStatus() {
  Serial.println("[INIT] ========== Statut du systeme ==========");
  
  Serial.print("[INIT] Serial: ");
  switch (systemStatus.serial) {
    case INIT_NOT_STARTED:
      Serial.println("Non demarre");
      break;
    case INIT_IN_PROGRESS:
      Serial.println("En cours");
      break;
    case INIT_SUCCESS:
      Serial.println("OK");
      break;
    case INIT_FAILED:
      Serial.println("ERREUR");
      break;
  }
  
  Serial.print("[INIT] LED: ");
  switch (systemStatus.led) {
    case INIT_NOT_STARTED:
      Serial.println("Non demarre");
      break;
    case INIT_IN_PROGRESS:
      Serial.println("En cours");
      break;
    case INIT_SUCCESS:
      Serial.println("OK");
      break;
    case INIT_FAILED:
      Serial.println("ERREUR");
      break;
  }
  
  Serial.print("[INIT] SD: ");
  switch (systemStatus.sd) {
    case INIT_NOT_STARTED:
      Serial.println("Non demarre");
      break;
    case INIT_IN_PROGRESS:
      Serial.println("En cours");
      break;
    case INIT_SUCCESS:
      Serial.println("OK");
      break;
    case INIT_FAILED:
      Serial.println("ERREUR");
      break;
  }
  
  Serial.print("[INIT] NFC: ");
  switch (systemStatus.nfc) {
    case INIT_NOT_STARTED:
      Serial.println("Non demarre");
      break;
    case INIT_IN_PROGRESS:
      Serial.println("En cours");
      break;
    case INIT_SUCCESS:
      Serial.println("OK");
      break;
    case INIT_FAILED:
      Serial.println("WARNING");
      break;
  }
  
  Serial.print("[INIT] BLE: ");
  switch (systemStatus.ble) {
    case INIT_NOT_STARTED:
      Serial.println("Non demarre");
      break;
    case INIT_IN_PROGRESS:
      Serial.println("En cours");
      break;
    case INIT_SUCCESS:
      Serial.println("OK");
      break;
    case INIT_FAILED:
      Serial.println("ERREUR");
      break;
  }
  
  Serial.print("[INIT] WiFi: ");
  switch (systemStatus.wifi) {
    case INIT_NOT_STARTED:
      Serial.println("Non demarre");
      break;
    case INIT_IN_PROGRESS:
      Serial.println("En cours");
      break;
    case INIT_SUCCESS:
      Serial.println("OK");
      if (WiFiManager::isConnected()) {
        Serial.print("[INIT]   -> IP: ");
        Serial.println(WiFiManager::getLocalIP());
      }
      break;
    case INIT_FAILED:
      Serial.println("ERREUR");
      break;
  }
  
  // Ajouter d'autres composants ici
  
  Serial.print("[INIT] Systeme pret: ");
  Serial.println(isSystemReady() ? "OUI" : "NON");
  Serial.println("[INIT] ========================================");
}

const SDConfig& InitManager::getConfig() {
  static SDConfig defaultConfig;
  
  if (globalConfig == nullptr) {
    // Si pas de config globale, retourner une config par défaut
    SDManager::initDefaultConfig(&defaultConfig);
    return defaultConfig;
  }
  
  return *globalConfig;
}

bool InitManager::isConfigValid() {
  return globalConfig != nullptr && globalConfig->valid;
}

void InitManager::setGlobalConfig(SDConfig* config) {
  globalConfig = config;
}

bool InitManager::updateConfig(const SDConfig& config) {
  if (globalConfig == nullptr) {
    return false;
  }
  
  // Copier la nouvelle configuration
  *globalConfig = config;
  
  // Sauvegarder sur la SD
  if (SDManager::isAvailable()) {
    return SDManager::saveConfig(config);
  }
  
  return false;
}
