#include "command.h"
#include "../../ble_manager.h"
#include "../../wifi_manager.h"
#include "../../config_manager.h"
#include "../../../core/state_manager.h"
#include "../../../core/task_manager.h"
#include "../../../effects/led_effects.h"
#include "../../../core/led_controller.h"
#include "../../../config/version.h"
#include "../../../config/config.h"

bool handleSetupCommand(JsonDocument& doc) {
  Serial.println("[BLE] Commande SETUP (JSON) recue");
  
  String ssid = doc["ssid"] | "";
  String password = doc["password"] | "";
  
  if (ssid.length() == 0) {
    // SSID manquant
    JsonDocument errorDoc;
    errorDoc["status"] = "error";
    errorDoc["message"] = "WIFI_ERROR";
    errorDoc["error"] = "SSID manquant";
    String errorResponse;
    serializeJson(errorDoc, errorResponse);
    sendBLEData(errorResponse.c_str());
    return false;
  }
  
  Serial.print("[BLE] Configuration WiFi - SSID: ");
  Serial.print(ssid);
  Serial.print(", Password: ");
  Serial.println(password.length() > 0 ? "***" : "(vide)");
  
  // Activer le mode rainbow pendant le setup
  StateManager::resetForceModes();
  StateManager::setForceRainbowMode(true);
  
  // Appliquer immédiatement le mode rainbow
  CRGB* leds = LEDController::getLeds();
  int numLeds = LEDController::getNumLeds();
  setRainbow(leds, numLeds);
  
  // Se connecter au WiFi (la LED reste en rainbow pendant ce temps)
  bool success = connectToWiFi(ssid.c_str(), password.c_str());
  
  // Créer la réponse JSON
  JsonDocument responseDoc;
  
  if (success) {
    // Sauvegarder les identifiants WiFi dans la configuration globale
    setConfigWiFiSSID(ssid.c_str());
    setConfigWiFiPassword(password.c_str());
    
    // Demander une sauvegarde asynchrone de la configuration (non bloquant)
    requestConfigSave();
    Serial.println("[BLE] Demande de sauvegarde de configuration ajoutee a la queue");
    
    // Mettre à jour le flag de configuration chargée dans StateManager
    StateManager::setConfigLoaded(true);
    
    // Réinitialiser les modes forcés pour permettre au mode green progressif de s'activer
    StateManager::resetForceModes();
    
    // Le mode green progressif sera appliqué automatiquement par le ModeManager
    
    responseDoc["status"] = "success";
    responseDoc["message"] = "WIFI_OK";
    responseDoc["configSaved"] = true; // La sauvegarde sera effectuée de manière asynchrone
    responseDoc["firmwareVersion"] = FIRMWARE_VERSION_STRING;
    responseDoc["model"] = KIDOO_MODEL;
    
    String response;
    serializeJson(responseDoc, response);
    sendBLEData(response.c_str());
    Serial.println("[BLE] Reponse envoyee: WIFI_OK (JSON)");
    Serial.println("[BLE] Setup termine - LED passe au vert");
  } else {
    // En cas d'erreur WiFi, passer la LED au rouge
    StateManager::resetForceModes();
    StateManager::setForceManualMode(true);
    
    // Appliquer immédiatement le mode red
    setColor(leds, numLeds, CRGB::Red);
    
    // Obtenir le message d'erreur descriptif
    wl_status_t wifiStatus = WiFi.status();
    String errorMessage = getWiFiStatusMessage(wifiStatus);
    
    responseDoc["status"] = "error";
    responseDoc["message"] = "WIFI_ERROR";
    responseDoc["error"] = errorMessage;
    responseDoc["errorCode"] = (int)wifiStatus;
    
    String response;
    serializeJson(responseDoc, response);
    sendBLEData(response.c_str());
    Serial.println("[BLE] Reponse envoyee: WIFI_ERROR (JSON)");
    Serial.println("[BLE] Erreur WiFi - LED passe au rouge");
  }
  
  return true;
}
