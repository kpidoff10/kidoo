#include "ble_manager.h"
#include "commands/commands.h"
#include "../effects/led_effects.h"
#include "../core/led_controller.h"
#include "../core/state_manager.h"
#include <ArduinoJson.h>

BLEServer* pServer = nullptr;
BLECharacteristic* pTxCharacteristic = nullptr;
BLECharacteristic* pRxCharacteristic = nullptr;
bool deviceConnected = false;
bool oldDeviceConnected = false;
String bleBuffer = "";
unsigned long lastBLEWriteTime = 0;

// Callback pour les événements de connexion
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("[BLE] Client connecte !");
      // Négocier un MTU plus grand (512 bytes) pour éviter la fragmentation
      BLEDevice::setMTU(512);
      Serial.println("[BLE] MTU negocie: 512 bytes");
    }

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("[BLE] Client deconnecte");
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
        Serial.print("[BLE] Paquet recu (");
        Serial.print(rxValue.length());
        Serial.print(" bytes), buffer total: ");
        Serial.print(bleBuffer.length());
        Serial.print(" - Derniers chars: ");
        if (bleBuffer.length() > 20) {
          Serial.println(bleBuffer.substring(bleBuffer.length() - 20));
        } else {
          Serial.println(bleBuffer);
        }
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
  if (deviceConnected && pTxCharacteristic) {
    pTxCharacteristic->setValue(data);
    pTxCharacteristic->notify();
    Serial.print("[BLE] Donnees envoyees: ");
    Serial.println(data);
  }
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

// Fonction pour traiter les commandes reçues via BLE
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
  
  // Traiter le buffer si des données sont disponibles
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
    
    // Réinitialiser le timer de sommeil et forcer le réveil car on a reçu une activité BLE
    StateManager::resetSleepTimer(true);  // forceWake=true pour réveiller le système
    
    Serial.print("[BLE] Commande recue (complete, ");
    Serial.print(bleBuffer.length());
    Serial.print(" bytes): ");
    Serial.println(bleBuffer);
    
    // Parser JSON uniquement
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, bleBuffer);
    
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
      bleBuffer = "";
      return;
    }
    
    // Traiter la commande via le système de commandes
    processBLECommand(doc, bleBuffer);
  }
}
