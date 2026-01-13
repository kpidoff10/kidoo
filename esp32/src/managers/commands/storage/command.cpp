#include "command.h"
#include "../../ble_manager.h"
#include "../../sd_manager.h"
#include <ArduinoJson.h>

bool handleGetStorageCommand(JsonDocument& doc) {
  Serial.println("[BLE] Commande GET_STORAGE recue");
  
  // Vérifier si la carte SD est disponible
  if (!isSDCardAvailable()) {
    JsonDocument errorDoc;
    errorDoc["status"] = "error";
    errorDoc["message"] = "STORAGE_ERROR";
    errorDoc["error"] = "Carte SD non disponible";
    String errorResponse;
    serializeJson(errorDoc, errorResponse);
    sendBLEData(errorResponse.c_str());
    Serial.println("[BLE] Erreur: Carte SD non disponible");
    return false;
  }
  
  // Récupérer l'espace total et libre
  uint64_t totalSpace = getSDCardTotalSpace();
  uint64_t freeSpace = getSDCardFreeSpace();
  uint64_t usedSpace = totalSpace - freeSpace;
  
  // Calculer les pourcentages
  uint8_t freePercent = 0;
  uint8_t usedPercent = 0;
  if (totalSpace > 0) {
    freePercent = (uint8_t)((freeSpace * 100) / totalSpace);
    usedPercent = (uint8_t)((usedSpace * 100) / totalSpace);
  }
  
  Serial.print("[BLE] Espace total: ");
  Serial.print(totalSpace / (1024 * 1024));
  Serial.println(" MB");
  
  Serial.print("[BLE] Espace libre: ");
  Serial.print(freeSpace / (1024 * 1024));
  Serial.println(" MB");
  
  Serial.print("[BLE] Espace utilise: ");
  Serial.print(usedSpace / (1024 * 1024));
  Serial.println(" MB");
  
  // Créer la réponse JSON
  JsonDocument responseDoc;
  responseDoc["status"] = "success";
  responseDoc["message"] = "STORAGE_GET";
  responseDoc["totalBytes"] = totalSpace;
  responseDoc["freeBytes"] = freeSpace;
  responseDoc["usedBytes"] = usedSpace;
  responseDoc["totalMB"] = totalSpace / (1024 * 1024);
  responseDoc["freeMB"] = freeSpace / (1024 * 1024);
  responseDoc["usedMB"] = usedSpace / (1024 * 1024);
  responseDoc["freePercent"] = freePercent;
  responseDoc["usedPercent"] = usedPercent;
  
  String response;
  serializeJson(responseDoc, response);
  sendBLEData(response.c_str());
  
  Serial.println("[BLE] Reponse envoyee: STORAGE_GET");
  
  return true;
}
