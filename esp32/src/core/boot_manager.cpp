#include <Arduino.h>
#include "boot_manager.h"
#include "led_controller.h"
#include "state_manager.h"
#include "task_manager.h"
#include "../managers/sd_manager.h"
#include "../managers/config_manager.h"
#include "../managers/wifi_manager.h"
#include "../managers/ble_manager.h"
#include "../managers/nfc_manager.h"
#include "../managers/commands/nfc/command.h"
#include "../effects/led_effects.h"
#include "../config/config.h"
#include <string.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/semphr.h>

// Handle de la tâche orange de boot
static TaskHandle_t orangeBootTaskHandle = nullptr;
static bool orangeBootTaskRunning = false;

// Tâche pour maintenir l'effet orange rotatif pendant tout le boot
// Cette tâche doit avoir une priorité élevée pour continuer même pendant les opérations bloquantes
void orangeBootTask(void* parameter) {
  CRGB* leds = LEDController::getLeds();
  int numLeds = LEDController::getNumLeds();
  
  Serial.println("[BOOT] Tâche orange démarrée");
  
  // Boucle principale - continue jusqu'à ce que orangeBootTaskRunning soit false
  while (orangeBootTaskRunning) {
    // Appliquer l'effet orange rotatif
    setOrangeProgressCircle(leds, numLeds);
    
    // Utiliser vTaskDelay pour permettre au scheduler de fonctionner
    // Délai court pour animation fluide mais permet au scheduler de gérer d'autres tâches
    vTaskDelay(pdMS_TO_TICKS(30));
    
    // Forcer un yield périodique pour garantir que le scheduler peut gérer d'autres tâches
    // même si certaines opérations sont bloquantes
    portYIELD();
  }
  
  Serial.println("[BOOT] Tâche orange terminée");
  
  // Supprimer la tâche quand elle se termine
  vTaskDelete(nullptr);
}

void BootManager::initSerial() {
  // Initialiser la communication série pour le débogage
  Serial.begin(SERIAL_BAUD_RATE);
  unsigned long startTime = millis();
  while (!Serial && (millis() - startTime) < SERIAL_TIMEOUT_MS) {
    // Attendre que le Serial soit prêt (max 3 secondes)
    // Utiliser vTaskDelay pour permettre au scheduler de fonctionner
    vTaskDelay(pdMS_TO_TICKS(10));
  }
  vTaskDelay(pdMS_TO_TICKS(1000));  // Attendre un peu plus pour stabiliser
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
  } else {
    // Démarrer la tâche orange rotatif pour tout le démarrage
    // Priorité très élevée (5) et core 1 pour garantir qu'elle continue pendant tous les tests
    orangeBootTaskRunning = true;
    xTaskCreatePinnedToCore(
      orangeBootTask,
      "OrangeBootTask",
      2048, // Stack size
      nullptr,
      5, // Priorité très élevée pour garantir l'exécution continue
      &orangeBootTaskHandle,
      1  // Core 1 pour éviter les conflits avec WiFi/BLE sur core 0
    );
    Serial.println("[BOOT] Effet orange rotatif demarre (demarrage en cours)");
    // Petit délai pour s'assurer que la tâche démarre avant de continuer
    vTaskDelay(pdMS_TO_TICKS(50));
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
    
    // L'effet orange continue via la tâche orangeBootTask
    // Le mode final sera appliqué à la fin du boot
    
    return true;
  } else {
    Serial.println("[BOOT] Aucune configuration trouvee");
    StateManager::setConfigLoaded(false);
    
    // Utiliser la luminosité par défaut (100%)
    LEDController::setBrightnessPercent(100);
    Serial.println("[BOOT] Luminosite par defaut appliquee: 100%");
    
    // L'effet orange continue via la tâche orangeBootTask
    // Le mode final sera appliqué à la fin du boot
    
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
  
  // 3. Initialiser la carte SD (effet orange continue via la tâche)
  bool sdAvailable = initSDCard();
  
  // 4. Charger la configuration si la carte SD est disponible (effet orange continue via la tâche)
  bool configLoaded = false;
  if (sdAvailable) {
    configLoaded = loadConfiguration();
  } else {
    // Si pas de carte SD, utiliser la luminosité par défaut
    LEDController::setBrightnessPercent(100);
    Serial.println("[BOOT] Luminosite par defaut appliquee: 100% (carte SD non disponible)");
    StateManager::setConfigLoaded(false);
  }
  
  // 5. Initialiser les systèmes réseau (effet orange continue via la tâche)
  initNetworkSystems();
  
  // 6. Initialiser le gestionnaire de tâches FreeRTOS
  if (!initTaskManager()) {
    Serial.println("[BOOT] ERREUR: Impossible d'initialiser le gestionnaire de tâches");
  } else {
    // Démarrer les tâches (LED et sauvegarde SD)
    startTaskManager();
    Serial.println("[BOOT] Tâches FreeRTOS démarrées");
  }
  
  // 7. Arrêter la tâche orange de boot (le démarrage est terminé)
  orangeBootTaskRunning = false;
  // Attendre un peu pour que la tâche se termine proprement
  vTaskDelay(pdMS_TO_TICKS(200));
  
  // 8. Appliquer le mode final selon la configuration chargée AVANT de terminer l'initialisation
  if (configLoaded) {
    // Mode VERT si config chargée
    StateManager::setMode(MODE_GREEN);
    Serial.println("[BOOT] Mode final applique: VERT");
  } else {
    // Mode ROUGE si pas de config
    StateManager::setMode(MODE_RED);
    Serial.println("[BOOT] Mode final applique: ROUGE");
  }
  
  // 9. Indiquer que l'initialisation est terminée (permet au mode sommeil de fonctionner)
  // Cela permet à la tâche LED de commencer à appliquer le mode final
  StateManager::setInitializing(false);
  
  // 10. Logger l'état final
  if (configLoaded) {
    Serial.println("[BOOT] Demarrage termine - Configuration chargee (VERT)");
  } else {
    Serial.println("[BOOT] Demarrage termine - Aucune configuration (ROUGE)");
  }
  
  return configLoaded;
}
