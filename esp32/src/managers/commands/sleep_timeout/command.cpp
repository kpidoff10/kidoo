#include "command.h"
#include "../../ble_manager.h"
#include "../../config_manager.h"
#include "../../../core/task_manager.h"

bool handleSleepTimeoutCommand(JsonDocument& doc) {
  Serial.println("[BLE] Commande SLEEP_TIMEOUT (JSON) recue");
  
  unsigned long timeout = doc["timeout"] | 30000; // Valeur par défaut 30 secondes
  
  // Valider la valeur (5000-300000 ms)
  if (timeout < 5000) {
    timeout = 5000;
    Serial.println("[BLE] Timeout sommeil trop faible, ajuste a 5000 ms");
  }
  if (timeout > 300000) {
    timeout = 300000;
    Serial.println("[BLE] Timeout sommeil trop eleve, ajuste a 300000 ms");
  }
  
  Serial.print("[BLE] Definition du timeout sommeil a ");
  Serial.print(timeout);
  Serial.println(" ms");
  
  // Sauvegarder dans la configuration
  setConfigSleepTimeout(timeout);
  
  // Demander une sauvegarde asynchrone de la configuration (non bloquant)
  requestConfigSave();
  Serial.println("[BLE] Demande de sauvegarde de configuration ajoutee a la queue");
  
  // Créer la réponse JSON
  JsonDocument responseDoc;
  responseDoc["status"] = "success";
  responseDoc["message"] = "SLEEP_TIMEOUT_SET";
  responseDoc["timeout"] = timeout;
  responseDoc["configSaved"] = true; // La sauvegarde sera effectuée de manière asynchrone
  
  String response;
  serializeJson(responseDoc, response);
  sendBLEData(response.c_str());
  Serial.print("[BLE] Reponse envoyee: SLEEP_TIMEOUT_SET (");
  Serial.print(timeout);
  Serial.println(" ms)");
  
  return true;
}

bool handleGetSleepTimeoutCommand(JsonDocument& doc) {
  Serial.println("[BLE] Commande GET_SLEEP_TIMEOUT recue");
  
  // Obtenir le timeout depuis la configuration
  unsigned long timeout = getConfigSleepTimeout();
  
  // Créer la réponse JSON
  JsonDocument responseDoc;
  responseDoc["status"] = "success";
  responseDoc["message"] = "SLEEP_TIMEOUT_GET";
  responseDoc["timeout"] = timeout;
  
  String response;
  serializeJson(responseDoc, response);
  sendBLEData(response.c_str());
  Serial.print("[BLE] Reponse envoyee: GET_SLEEP_TIMEOUT (");
  Serial.print(timeout);
  Serial.println(" ms)");
  
  return true;
}
