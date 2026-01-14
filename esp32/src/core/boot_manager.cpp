#include <Arduino.h>
#include "boot_manager.h"
#include "led_controller.h"
#include "state_manager.h"
#include "../managers/sd_manager.h"
#include "../managers/config_manager.h"
#include "../managers/wifi_manager.h"
#include "../managers/ble_manager.h"
#include "../managers/nfc_manager.h"
#include "../managers/commands/nfc/command.h"
#include "../effects/led_effects.h"
#include "../config/config.h"
#include <string.h>

void BootManager::initSerial() {
  // Initialiser la communication série pour le débogage
  Serial.begin(SERIAL_BAUD_RATE);
  while (!Serial && millis() < SERIAL_TIMEOUT_MS) {
    // Attendre que le Serial soit prêt (max 3 secondes)
    delay(10);
  }
  delay(1000);  // Attendre un peu plus pour stabiliser
  Serial.println();
  Serial.println();
  Serial.println("=== KIDOO DEMARRAGE ===");
  Serial.println();
}

void BootManager::initCoreSystems() {
  // Marquer que l'initialisation commence AVANT d'initialiser les systèmes
  StateManager::setInitializing(true);
  
  // Initialiser le gestionnaire d'état
  StateManager::init();
  
  // Initialiser le contrôleur LED
  if (!LEDController::init()) {
    Serial.println("[BOOT] ERREUR: Impossible d'initialiser le contrôleur LED");
  }
}

bool BootManager::initSDCard() {
  Serial.println("[BOOT] Initialisation de la carte SD...");
  
  if (!::initSDCard()) {
    Serial.println("[BOOT] La carte SD ne sera pas disponible");
    return false;
  }
  
  // Écrire un fichier "ok" au démarrage (seulement s'il n'existe pas déjà)
  // Ce fichier sert juste à vérifier que la carte SD est accessible
  if (!sdCardFileExists("/startup.txt")) {
    const char* okMessage = "ok";
    if (writeSDCardFile("/startup.txt", (const uint8_t*)okMessage, strlen(okMessage))) {
      Serial.println("[BOOT] Fichier startup.txt cree avec succes");
    } else {
      Serial.println("[BOOT] Erreur lors de la creation du fichier startup.txt");
    }
  } else {
    Serial.println("[BOOT] Fichier startup.txt existe deja, pas besoin de le recreer");
  }
  
  // Lister les fichiers existants
  listSDCardFiles("/");
  
  // Lister le dossier /music s'il existe
  if (sdCardFileExists("/music")) {
    listSDCardFiles("/music");
  } else {
    Serial.println("[BOOT] Le dossier /music n'existe pas encore (sera cree automatiquement si necessaire)");
  }
  
  return true;
}

bool BootManager::loadConfiguration() {
  Serial.println("[BOOT] Chargement de la configuration...");
  
  bool configLoaded = loadKidooConfigFromSD();
  if (configLoaded) {
    Serial.println("[BOOT] Configuration chargee avec succes");
    StateManager::setConfigLoaded(true);
    
    // Appliquer la luminosité sauvegardée
    uint8_t savedBrightness = getConfigBrightness();
    LEDController::setBrightnessPercent(savedBrightness);
    Serial.print("[BOOT] Luminosite appliquee depuis la configuration: ");
    Serial.print(savedBrightness);
    Serial.println("%");
    
    // Afficher le cercle vert qui tourne pour indiquer que la config est chargée
    CRGB* leds = LEDController::getLeds();
    int numLeds = LEDController::getNumLeds();
    setGreenProgressCircle(leds, numLeds);
    
    return true;
  } else {
    Serial.println("[BOOT] Aucune configuration trouvee");
    StateManager::setConfigLoaded(false);
    
    // Utiliser la luminosité par défaut (100%)
    LEDController::setBrightnessPercent(100);
    Serial.println("[BOOT] Luminosite par defaut appliquee: 100%");
    
    // Afficher le rouge pour indiquer qu'aucune config n'a été trouvée
    CRGB* leds = LEDController::getLeds();
    int numLeds = LEDController::getNumLeds();
    setRed(leds, numLeds);
    
    return false;
  }
}

void BootManager::initNetworkSystems() {
  // Initialiser le WiFi en mode Access Point
  initWiFiAP(WIFI_SSID);
  
  // Essayer de se connecter automatiquement au WiFi depuis la configuration sauvegardee
  String savedSSID = getConfigWiFiSSID();
  String savedPassword = getConfigWiFiPassword();
  if (savedSSID.length() > 0) {
    Serial.println("[BOOT] Tentative de connexion automatique au WiFi depuis la configuration sauvegardee...");
    bool autoConnectSuccess = connectToWiFi(savedSSID.c_str(), savedPassword.c_str());
    if (autoConnectSuccess) {
      Serial.println("[BOOT] Connexion automatique reussie !");
    } else {
      Serial.println("[BOOT] Echec de la connexion automatique, l'AP reste disponible pour configuration");
    }
  } else {
    Serial.println("[BOOT] Aucune configuration WiFi sauvegardee, l'AP reste disponible pour configuration");
  }
  
  // Initialiser le BLE (Bluetooth Low Energy)
  initBLE(BLUETOOTH_NAME);
  
  // Initialiser le module NFC
  initNFC();
  
  // Initialiser la tâche NFC pour le traitement asynchrone
  initNFCTask();
}

bool BootManager::boot() {
  // 1. Initialiser la communication série
  initSerial();
  
  // 2. Initialiser les systèmes de base
  initCoreSystems();
  
  // 3. Initialiser la carte SD
  bool sdAvailable = initSDCard();
  
  // 4. Charger la configuration si la carte SD est disponible
  bool configLoaded = false;
  if (sdAvailable) {
    configLoaded = loadConfiguration();
  } else {
    // Si pas de carte SD, utiliser la luminosité par défaut
    LEDController::setBrightnessPercent(100);
    Serial.println("[BOOT] Luminosite par defaut appliquee: 100% (carte SD non disponible)");
    
    // Afficher le rouge pour indiquer qu'aucune config n'est disponible
    CRGB* leds = LEDController::getLeds();
    int numLeds = LEDController::getNumLeds();
    setRed(leds, numLeds);
    StateManager::setConfigLoaded(false);
    Serial.println("[BOOT] Mode initial: ROUGE (carte SD non disponible)");
  }
  
  // 5. Initialiser les systèmes réseau
  initNetworkSystems();
  
  // 6. Indiquer que l'initialisation est terminée (permet au mode sommeil de fonctionner)
  StateManager::setInitializing(false);
  
  // 7. Logger l'état final
  if (configLoaded) {
    Serial.println("[BOOT] Demarrage termine - Configuration chargee (VERT)");
  } else {
    Serial.println("[BOOT] Demarrage termine - Aucune configuration (ROUGE)");
  }
  
  return configLoaded;
}
