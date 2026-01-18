#include "ble_manager.h"
#include "commands/commands.h"
#include "../effects/led_effects.h"
#include "../core/led_controller.h"
#include "../core/state_manager.h"
#include <ArduinoJson.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/queue.h>

BLEServer* pServer = nullptr;
BLECharacteristic* pTxCharacteristic = nullptr;
BLECharacteristic* pRxCharacteristic = nullptr;
bool deviceConnected = false;
bool oldDeviceConnected = false;
String bleBuffer = "";
unsigned long lastBLEWriteTime = 0;

// Structure pour passer les commandes BLE à la tâche
// On stocke la commande JSON complète comme String (max 247 bytes pour correspondre au MTU BLE standard)
struct BLECommandData {
  char commandJson[256];  // Buffer pour la commande JSON (256 bytes, < 247 MTU pour laisser de la marge)
  bool isValid;
};

// Queue pour les commandes BLE (taille 10 pour permettre plusieurs commandes en attente)
static QueueHandle_t bleCommandQueue = nullptr;
static TaskHandle_t bleTaskHandle = nullptr;

// Callback pour les événements de connexion
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("========================================");
      Serial.println("[BLE] Client connecte !");
      Serial.print("[BLE] Nombre de connexions: ");
      Serial.println(pServer->getConnId());
      Serial.println("[BLE] Note: La negociation MTU sera effectuee par le client (l'app)");
      Serial.println("========================================");
    }

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("========================================");
      Serial.println("[BLE] Client deconnecte");
      Serial.println("========================================");
    }
};

// Callback pour recevoir des données
class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string rxValue = pCharacteristic->getValue();

      if (rxValue.length() > 0) {
        // Accumuler les données dans le buffer (ce callback est appelé pour chaque paquet)
        for (int i = 0; i < rxValue.length(); i++) {
          bleBuffer += (char)rxValue[i];
        }
        lastBLEWriteTime = millis();
        // Log supprimé pour éviter la confusion : on log seulement la commande complète dans processBLECommands()
      }
    }
};

// Fonction pour initialiser le BLE
void initBLE(const char* deviceName) {
  Serial.println("[BLE] Initialisation du BLE...");
  Serial.print("[BLE] Nom du dispositif: ");
  Serial.println(deviceName);

  BLEDevice::init(deviceName);

  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  Serial.print("[BLE] Service UUID: ");
  Serial.println(SERVICE_UUID);

  pRxCharacteristic = pService->createCharacteristic(
                                       CHARACTERISTIC_UUID_RX,
                                       BLECharacteristic::PROPERTY_WRITE
                                     );
  pRxCharacteristic->setCallbacks(new MyCallbacks());

  pTxCharacteristic = pService->createCharacteristic(
                                       CHARACTERISTIC_UUID_TX,
                                       BLECharacteristic::PROPERTY_NOTIFY
                                     );
  pTxCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMaxPreferred(0x0C);
  BLEDevice::startAdvertising();
  delay(200);
  BLEDevice::startAdvertising();
  Serial.println("[BLE] Advertising demarre");
  delay(100);

  Serial.println("========================================");
  Serial.print("[BLE] BLE initialise avec succes !");
  Serial.println();
  Serial.print("[BLE] Nom du dispositif: ");
  Serial.println(deviceName);
  Serial.print("[BLE] Service UUID: ");
  Serial.println(SERVICE_UUID);
  Serial.println("[BLE] Le dispositif est maintenant visible pour le couplage.");
  Serial.println("[BLE] Recherchez 'Kidoo' dans votre application Bluetooth.");
  Serial.println("========================================");

  updateBLEState();
}

bool isBLEConnected() {
  return deviceConnected;
}

void sendBLEData(const char* data) {
  if (!deviceConnected) {
    Serial.println("[BLE] ATTENTION: Tentative d'envoi de donnees mais aucun client connecte");
    return;
  }
  
  if (!pTxCharacteristic) {
    Serial.println("[BLE] ERREUR: Caracteristique TX non initialisee");
    return;
  }
  
  pTxCharacteristic->setValue(data);
  pTxCharacteristic->notify();
  Serial.print("[BLE] Donnees envoyees: ");
  Serial.println(data);
}

// Fonction pour mettre à jour l'état dans StateManager
void updateBLEState() {
  static bool lastDeviceConnected = false;
  
  // Ne mettre à jour que si l'état a vraiment changé
  if (deviceConnected != lastDeviceConnected) {
    StateManager::setBLEConnected(deviceConnected);
    
    // Réinitialiser le timer et forcer le réveil si un client se connecte
    // (forceWake=true pour réveiller même si on est en mode sommeil)
    StateManager::resetSleepTimer(true);  // forceWake=true pour réveiller le système
    
    if (deviceConnected) {
      Serial.println("[BLE] Client connecte - Reveil du systeme");
    }
    
    lastDeviceConnected = deviceConnected;
  } else {
    // Mettre à jour quand même la valeur dans StateManager (au cas où)
    StateManager::setBLEConnected(deviceConnected);
  }
}

// Tâche FreeRTOS pour traiter les commandes BLE de manière asynchrone
void bleCommandTask(void* parameter) {
  BLECommandData cmdData;
  
  Serial.println("[BLE] Tâche de traitement des commandes démarrée");
  
  while (true) {
    // Attendre une commande dans la queue (timeout infini)
    if (xQueueReceive(bleCommandQueue, &cmdData, portMAX_DELAY) == pdTRUE) {
      if (!cmdData.isValid) {
        continue;
      }
      
      Serial.print("[BLE] Traitement de la commande (");
      Serial.print(strlen(cmdData.commandJson));
      Serial.print(" bytes): ");
      Serial.println(cmdData.commandJson);
      
      // Réinitialiser le timer de sommeil et forcer le réveil car on a reçu une activité BLE
      StateManager::resetSleepTimer(true);  // forceWake=true pour réveiller le système
      
      // Parser le JSON
      JsonDocument doc;
      DeserializationError error = deserializeJson(doc, cmdData.commandJson);
      
      if (error) {
        Serial.print("[BLE] Erreur de parsing JSON: ");
        Serial.println(error.c_str());
        // Format invalide : passer la LED au rouge
        StateManager::resetForceModes();
        StateManager::setForceManualMode(true);
        CRGB* leds = LEDController::getLeds();
        int numLeds = LEDController::getNumLeds();
        setColor(leds, numLeds, CRGB::Red);
        
        JsonDocument errorDoc;
        errorDoc["status"] = "error";
        errorDoc["message"] = "INVALID_FORMAT";
        errorDoc["error"] = "Format JSON invalide";
        String errorResponse;
        serializeJson(errorDoc, errorResponse);
        sendBLEData(errorResponse.c_str());
        continue;
      }
      
      // Traiter la commande via le système de commandes
      String buffer = String(cmdData.commandJson);
      processBLECommand(doc, buffer);
    }
  }
}

// Initialiser la tâche de traitement des commandes BLE (à appeler dans setup)
void initBLECommandTask() {
  // Créer la queue pour les commandes BLE (taille 10 pour permettre plusieurs commandes en attente)
  bleCommandQueue = xQueueCreate(10, sizeof(BLECommandData));
  
  if (bleCommandQueue == nullptr) {
    Serial.println("[BLE] ERREUR: Impossible de créer la queue de commandes BLE");
    return;
  }
  
  // Créer la tâche BLE
  xTaskCreate(
    bleCommandTask,      // Fonction de la tâche
    "BLE_CommandTask",   // Nom de la tâche
    8192,                // Stack size (8KB pour les commandes complexes comme SETUP)
    nullptr,             // Paramètres
    2,                   // Priorité (moyenne)
    &bleTaskHandle       // Handle de la tâche
  );
  
  if (bleTaskHandle == nullptr) {
    Serial.println("[BLE] ERREUR: Impossible de créer la tâche de traitement des commandes");
  } else {
    Serial.println("[BLE] Tâche de traitement des commandes créée avec succès");
  }
}

// Fonction pour traiter les commandes reçues via BLE (accumulation du buffer et envoi à la queue)
void processBLECommands() {
  // Gérer les déconnexions
  if (!deviceConnected && oldDeviceConnected) {
    delay(500); // donner le temps au Bluetooth de se terminer
    pServer->startAdvertising(); // redémarrer l'annonce
    Serial.println("[BLE] Redemarrage de l'annonce");
    oldDeviceConnected = deviceConnected;
    updateBLEState();
  }
  
  // Gérer les connexions
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
    updateBLEState();
  }
  
  // Vérifier si une commande complète est disponible dans le buffer
  if (bleBuffer.length() > 0) {
    // Vérifier si le JSON est complet (accolades équilibrées)
    int openBraces = 0;
    int closeBraces = 0;
    for (int i = 0; i < bleBuffer.length(); i++) {
      if (bleBuffer.charAt(i) == '{') openBraces++;
      if (bleBuffer.charAt(i) == '}') closeBraces++;
    }
    
    // Si les accolades ne sont pas équilibrées, attendre plus de données
    // Mais seulement si on a reçu des données récemment (dans les 200ms)
    if ((openBraces != closeBraces || openBraces == 0) && (millis() - lastBLEWriteTime < 200)) {
      return; // Attendre plus de données
    }
    
    bleBuffer.trim();
    
    // Vérifier que la queue existe
    if (bleCommandQueue == nullptr) {
      Serial.println("[BLE] ERREUR: Queue de commandes non initialisée");
      bleBuffer = "";
      return;
    }
    
    // Préparer les données de commande pour la queue
    BLECommandData cmdData;
    cmdData.isValid = false;
    
    // Copier la commande dans le buffer (limiter à 255 chars pour laisser place au \0)
    int cmdLength = bleBuffer.length();
    if (cmdLength >= 256) {
      Serial.println("[BLE] ERREUR: Commande trop longue (max 255 bytes)");
      // Envoyer une erreur
      JsonDocument errorDoc;
      errorDoc["status"] = "error";
      errorDoc["message"] = "INVALID_FORMAT";
      errorDoc["error"] = "Commande trop longue";
      String errorResponse;
      serializeJson(errorDoc, errorResponse);
      sendBLEData(errorResponse.c_str());
      bleBuffer = "";
      return;
    }
    
    // Copier la commande
    strncpy(cmdData.commandJson, bleBuffer.c_str(), 255);
    cmdData.commandJson[255] = '\0';  // S'assurer que la string est terminée
    cmdData.isValid = true;
    
    Serial.print("[BLE] Commande mise en queue (");
    Serial.print(cmdLength);
    Serial.print(" bytes): ");
    Serial.println(cmdData.commandJson);
    
    // Envoyer la commande à la queue (non-bloquant)
    if (xQueueSend(bleCommandQueue, &cmdData, 0) != pdTRUE) {
      Serial.println("[BLE] ERREUR: Queue pleine, commande perdue");
      // Envoyer une erreur
      JsonDocument errorDoc;
      errorDoc["status"] = "error";
      errorDoc["message"] = "QUEUE_FULL";
      errorDoc["error"] = "Queue de commandes pleine";
      String errorResponse;
      serializeJson(errorDoc, errorResponse);
      sendBLEData(errorResponse.c_str());
    }
    
    // Vider le buffer après avoir mis en queue
    bleBuffer = "";
  }
}
