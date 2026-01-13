#include "command.h"
#include "../../ble_manager.h"
#include "../../config_manager.h"
#include "../../../core/led_controller.h"

bool handleBrightnessCommand(JsonDocument& doc) {
  Serial.println("[BLE] Commande BRIGHTNESS (JSON) recue");
  
  // Lire la valeur depuis le JSON (valeur par défaut: 100 si absente)
  uint8_t percent = 100;
  if (doc.containsKey("percent")) {
    percent = doc["percent"].as<uint8_t>();
  }
  
  // Valider la valeur (10-100)
  // Accepter exactement 10% comme valeur minimale valide
  if (percent < 10) {
    percent = 10;
    Serial.println("[BLE] Luminosite trop faible, ajustee a 10%");
  } else if (percent > 100) {
    percent = 100;
    Serial.println("[BLE] Luminosite trop elevee, ajustee a 100%");
  }
  
  Serial.print("[BLE] Definition de la luminosite a ");
  Serial.print(percent);
  Serial.println("%");
  
  // Sauvegarder dans la configuration
  setConfigBrightness(percent);
  
  // Appliquer immédiatement la luminosité
  LEDController::setBrightnessPercent(percent);
  
  // Sauvegarder la configuration sur la carte SD
  bool configSaved = saveKidooConfigToSD();
  if (configSaved) {
    Serial.println("[BLE] Configuration de luminosite sauvegardee avec succes sur la carte SD");
  } else {
    Serial.println("[BLE] ATTENTION: Impossible de sauvegarder la configuration sur la carte SD");
  }
  
  // Créer la réponse JSON
  JsonDocument responseDoc;
  responseDoc["status"] = "success";
  responseDoc["message"] = "BRIGHTNESS_SET";
  responseDoc["brightness"] = percent;
  responseDoc["configSaved"] = configSaved;
  
  String response;
  serializeJson(responseDoc, response);
  sendBLEData(response.c_str());
  Serial.print("[BLE] Reponse envoyee: BRIGHTNESS_SET (");
  Serial.print(percent);
  Serial.println("%)");
  
  return true;
}

bool handleGetBrightnessCommand(JsonDocument& doc) {
  Serial.println("[BLE] Commande GET_BRIGHTNESS recue");
  
  // Obtenir la luminosité depuis la configuration (qui reflète la valeur actuelle)
  uint8_t brightnessPercent = getConfigBrightness();
  
  // Créer la réponse JSON
  JsonDocument responseDoc;
  responseDoc["status"] = "success";
  responseDoc["message"] = "BRIGHTNESS_GET";
  responseDoc["brightness"] = brightnessPercent;
  
  String response;
  serializeJson(responseDoc, response);
  sendBLEData(response.c_str());
  Serial.print("[BLE] Reponse envoyee: BRIGHTNESS_GET (");
  Serial.print(brightnessPercent);
  Serial.println("%)");
  
  return true;
}
