#include "command.h"
#include "../../nfc_manager.h"
#include "../../ble_manager.h"
#include <ArduinoJson.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>

// Structure pour passer les données de commande NFC à la tâche
struct NFCCommandData {
  NFCWriteData writeData;
  bool isValid;
};

// Queue pour les commandes NFC
static QueueHandle_t nfcCommandQueue = nullptr;
static TaskHandle_t nfcTaskHandle = nullptr;

// Tâche FreeRTOS pour traiter les commandes NFC de manière asynchrone
void nfcTask(void* parameter) {
  NFCCommandData cmdData;
  
  Serial.println("[NFC] Tâche NFC démarrée");
  
  while (true) {
    // Attendre une commande dans la queue (timeout infini)
    if (xQueueReceive(nfcCommandQueue, &cmdData, portMAX_DELAY) == pdTRUE) {
      if (!cmdData.isValid) {
        continue;
      }
      
      Serial.print("[NFC] Traitement de la commande d'écriture - Bloc ");
      Serial.println(cmdData.writeData.blockNumber);
      
      // Écrire sur le tag (cette opération peut prendre jusqu'à 15 secondes)
      NFCTagData tagData;
      bool success = writeNFCTag(cmdData.writeData, tagData);
      
      // Envoyer la réponse
      if (!success) {
        JsonDocument errorDoc;
        errorDoc["status"] = "error";
        errorDoc["message"] = "NFC_WRITE_ERROR";
        errorDoc["error"] = "Erreur lors de l'ecriture sur le tag";
        String errorResponse;
        serializeJson(errorDoc, errorResponse);
        sendBLEData(errorResponse.c_str());
        Serial.println("[BLE] Erreur: Echec de l'ecriture");
      } else {
        // Créer la réponse JSON
        JsonDocument responseDoc;
        responseDoc["status"] = "success";
        responseDoc["message"] = "NFC_TAG_WRITTEN";
        responseDoc["uid"] = tagData.uidString;
        responseDoc["blockNumber"] = cmdData.writeData.blockNumber;
        
        String response;
        serializeJson(responseDoc, response);
        sendBLEData(response.c_str());
        
        Serial.print("[BLE] Tag NFC ecrit avec succes - UID: ");
        Serial.println(tagData.uidString);
      }
    }
  }
}

// Initialiser la tâche NFC (à appeler dans setup)
void initNFCTask() {
  // Créer la queue pour les commandes NFC (taille 1 car on traite une commande à la fois)
  nfcCommandQueue = xQueueCreate(1, sizeof(NFCCommandData));
  
  if (nfcCommandQueue == nullptr) {
    Serial.println("[NFC] ERREUR: Impossible de créer la queue NFC");
    return;
  }
  
  // Créer la tâche NFC
  xTaskCreate(
    nfcTask,           // Fonction de la tâche
    "NFC_Task",        // Nom de la tâche
    4096,              // Stack size (4KB)
    nullptr,           // Paramètres
    2,                 // Priorité (moyenne)
    &nfcTaskHandle     // Handle de la tâche
  );
  
  if (nfcTaskHandle == nullptr) {
    Serial.println("[NFC] ERREUR: Impossible de créer la tâche NFC");
  } else {
    Serial.println("[NFC] Tâche NFC créée avec succès");
  }
}

bool handleReadNFCTagCommand(JsonDocument& doc) {
  Serial.println("[BLE] Commande READ_NFC_TAG recue");
  
  // Vérifier si le module NFC est disponible
  if (!isNFCAvailable()) {
    JsonDocument errorDoc;
    errorDoc["status"] = "error";
    errorDoc["message"] = "NFC_ERROR";
    errorDoc["error"] = "Module NFC non disponible";
    String errorResponse;
    serializeJson(errorDoc, errorResponse);
    sendBLEData(errorResponse.c_str());
    Serial.println("[BLE] Erreur: Module NFC non disponible");
    return false;
  }
  
  // Attendre un peu pour permettre la détection
  delay(100);
  
  // Lire le tag
  NFCTagData tagData;
  bool success = readNFCTag(tagData);
  
  if (!success) {
    JsonDocument errorDoc;
    errorDoc["status"] = "error";
    errorDoc["message"] = "NFC_READ_ERROR";
    errorDoc["error"] = "Aucun tag detecte ou erreur de lecture";
    String errorResponse;
    serializeJson(errorDoc, errorResponse);
    sendBLEData(errorResponse.c_str());
    Serial.println("[BLE] Erreur: Aucun tag detecte");
    return false;
  }
  
  // Créer la réponse JSON avec l'UID
  JsonDocument responseDoc;
  responseDoc["status"] = "success";
  responseDoc["message"] = "NFC_TAG_READ";
  responseDoc["uid"] = tagData.uidString;
  responseDoc["uidLength"] = tagData.uidLength;
  
  // Ajouter l'UID en tableau d'octets
  JsonArray uidArray = responseDoc["uidBytes"].to<JsonArray>();
  for (uint8_t i = 0; i < tagData.uidLength; i++) {
    uidArray.add(tagData.uid[i]);
  }
  
  String response;
  serializeJson(responseDoc, response);
  sendBLEData(response.c_str());
  
  Serial.print("[BLE] Tag NFC lu avec succes - UID: ");
  Serial.println(tagData.uidString);
  
  return true;
}

bool handleWriteNFCTagCommand(JsonDocument& doc) {
  Serial.println("[BLE] Commande WRITE_NFC_TAG recue");
  
  // Vérifier si le module NFC est disponible
  if (!isNFCAvailable()) {
    JsonDocument errorDoc;
    errorDoc["status"] = "error";
    errorDoc["message"] = "NFC_ERROR";
    errorDoc["error"] = "Module NFC non disponible";
    String errorResponse;
    serializeJson(errorDoc, errorResponse);
    sendBLEData(errorResponse.c_str());
    Serial.println("[BLE] Erreur: Module NFC non disponible");
    return false;
  }
  
  // Extraire les paramètres de la commande
  if (!doc.containsKey("data") || !doc.containsKey("blockNumber")) {
    JsonDocument errorDoc;
    errorDoc["status"] = "error";
    errorDoc["message"] = "NFC_WRITE_ERROR";
    errorDoc["error"] = "Parametres manquants (data ou blockNumber)";
    String errorResponse;
    serializeJson(errorDoc, errorResponse);
    sendBLEData(errorResponse.c_str());
    Serial.println("[BLE] Erreur: Parametres manquants");
    return false;
  }
  
  // Préparer les données à écrire
  NFCWriteData writeData;
  memset(&writeData, 0, sizeof(writeData));
  
  writeData.blockNumber = doc["blockNumber"] | 0;
  
  // Extraire les données depuis le JSON
  JsonArray dataArray = doc["data"].as<JsonArray>();
  if (dataArray.isNull() || dataArray.size() == 0) {
    JsonDocument errorDoc;
    errorDoc["status"] = "error";
    errorDoc["message"] = "NFC_WRITE_ERROR";
    errorDoc["error"] = "Tableau de donnees vide";
    String errorResponse;
    serializeJson(errorDoc, errorResponse);
    sendBLEData(errorResponse.c_str());
    Serial.println("[BLE] Erreur: Tableau de donnees vide");
    return false;
  }
  
  writeData.dataLength = dataArray.size();
  if (writeData.dataLength > 16) {
    writeData.dataLength = 16; // Limiter à 16 bytes
  }
  
  for (uint8_t i = 0; i < writeData.dataLength; i++) {
    writeData.data[i] = dataArray[i] | 0;
  }
  
  Serial.print("[BLE] Ecriture sur le bloc ");
  Serial.print(writeData.blockNumber);
  Serial.print(" avec ");
  Serial.print(writeData.dataLength);
  Serial.println(" bytes");
  
  // Vérifier que la tâche NFC est initialisée
  if (nfcCommandQueue == nullptr || nfcTaskHandle == nullptr) {
    Serial.println("[BLE] ERREUR: Tâche NFC non initialisée");
    JsonDocument errorDoc;
    errorDoc["status"] = "error";
    errorDoc["message"] = "NFC_WRITE_ERROR";
    errorDoc["error"] = "Systeme NFC non initialise";
    String errorResponse;
    serializeJson(errorDoc, errorResponse);
    sendBLEData(errorResponse.c_str());
    return false;
  }
  
  // Préparer les données de commande
  NFCCommandData cmdData;
  cmdData.writeData = writeData;
  cmdData.isValid = true;
  
  // Envoyer la commande à la tâche NFC (non-bloquant)
  if (xQueueSend(nfcCommandQueue, &cmdData, 0) != pdTRUE) {
    Serial.println("[BLE] ERREUR: Impossible d'envoyer la commande à la queue NFC");
    JsonDocument errorDoc;
    errorDoc["status"] = "error";
    errorDoc["message"] = "NFC_WRITE_ERROR";
    errorDoc["error"] = "Queue NFC pleine";
    String errorResponse;
    serializeJson(errorDoc, errorResponse);
    sendBLEData(errorResponse.c_str());
    return false;
  }
  
  Serial.println("[BLE] Commande NFC envoyee a la tache (traitement asynchrone)");
  
  // Retourner true immédiatement car le traitement est asynchrone
  // La réponse sera envoyée par la tâche NFC
  return true;
}
