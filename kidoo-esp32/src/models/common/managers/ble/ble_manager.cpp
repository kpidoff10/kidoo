#include "ble_manager.h"
#include "../../../model_config.h"

#ifdef HAS_BLE
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// UUIDs pour le service et les caractéristiques BLE
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_RX "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHARACTERISTIC_UUID_TX "beb5483e-36e1-4688-b7f5-ea07361b26a9"

// Variables statiques BLE (seulement si HAS_BLE est défini)
static BLEServer* pServer = nullptr;
static BLEService* pService = nullptr;
static BLECharacteristic* pTxCharacteristic = nullptr;

// Callbacks pour les événements de connexion/déconnexion
class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    Serial.println("[BLE] ========================================");
    Serial.println("[BLE] Client connecte !");
    Serial.print("[BLE] Nombre de connexions: ");
    Serial.println(pServer->getConnId());
    Serial.println("[BLE] ========================================");
  }

  void onDisconnect(BLEServer* pServer) {
    Serial.println("[BLE] ========================================");
    Serial.println("[BLE] Client deconnecte");
    Serial.println("[BLE] Redemarrage de l'advertising...");
    Serial.println("[BLE] ========================================");
    
    // Redémarrer l'advertising après une déconnexion
    delay(500); // Petit délai avant de redémarrer
    BLEDevice::startAdvertising();
    Serial.println("[BLE] Advertising redemarre");
  }
};
#endif

// Variables statiques communes
bool BLEManager::initialized = false;
bool BLEManager::available = false;
char* BLEManager::deviceName = nullptr;

bool BLEManager::init(const char* deviceName) {
  if (initialized) {
    return available;
  }
  
  initialized = true;
  available = false;
  
#ifndef HAS_BLE
  // BLE non disponible sur ce modèle
  Serial.println("[BLE] BLE non disponible sur ce modèle");
  return false;
#else
  // BLE disponible, initialiser
  Serial.println("[BLE] Initialisation du BLE...");
  Serial.print("[BLE] Nom du dispositif: ");
  Serial.println(deviceName);
  
  // Allouer et copier le nom du device
  if (BLEManager::deviceName != nullptr) {
    free(BLEManager::deviceName);
  }
  BLEManager::deviceName = (char*)malloc(strlen(deviceName) + 1);
  if (BLEManager::deviceName == nullptr) {
    Serial.println("[BLE] ERREUR: Impossible d'allouer la memoire pour le nom");
    return false;
  }
  strcpy(BLEManager::deviceName, deviceName);
  
  // Initialiser BLEDevice
  BLEDevice::init(deviceName);
  
  // Créer le serveur BLE
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());
  
  // Créer le service
  pService = pServer->createService(SERVICE_UUID);
  
  // Créer la caractéristique TX (notify)
  pTxCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID_TX,
    BLECharacteristic::PROPERTY_NOTIFY
  );
  pTxCharacteristic->addDescriptor(new BLE2902());
  
  // Créer la caractéristique RX (write)
  BLECharacteristic* pRxCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID_RX,
    BLECharacteristic::PROPERTY_WRITE
  );
  
  // Démarrer le service
  pService->start();
  
  // Configurer l'advertising
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMaxPreferred(0x0C);
  
  // Démarrer l'advertising immédiatement (double démarrage pour s'assurer qu'il démarre)
  BLEDevice::startAdvertising();
  delay(100);
  
  available = true;
  
  Serial.println("[BLE] ========================================");
  Serial.println("[BLE] BLE initialise avec succes !");
  Serial.print("[BLE] Nom du dispositif: ");
  Serial.println(deviceName);
  Serial.print("[BLE] Service UUID: ");
  Serial.println(SERVICE_UUID);
  Serial.println("[BLE] Le dispositif est maintenant visible pour le couplage");
  Serial.println("[BLE] Recherchez 'KIDOO-Basic' dans votre scan Bluetooth");
  Serial.println("[BLE] ========================================");
  
  return true;
#endif
}

bool BLEManager::isAvailable() {
  return initialized && available;
}

bool BLEManager::isInitialized() {
  return initialized;
}

void BLEManager::startAdvertising() {
#ifdef HAS_BLE
  if (!available || pServer == nullptr) {
    Serial.println("[BLE] ERREUR: Impossible de demarrer l'advertising (BLE non initialise)");
    return;
  }
  
  // Démarrer l'advertising (double démarrage pour s'assurer qu'il démarre bien)
  BLEDevice::startAdvertising();
  delay(200);
  BLEDevice::startAdvertising();
  Serial.println("[BLE] Advertising demarre");
  Serial.println("[BLE] Le dispositif est maintenant visible en Bluetooth");
#endif
}

void BLEManager::stopAdvertising() {
#ifdef HAS_BLE
  if (!available || pServer == nullptr) {
    return;
  }
  
  BLEDevice::stopAdvertising();
  Serial.println("[BLE] Advertising arrete");
#endif
}

bool BLEManager::isConnected() {
#ifdef HAS_BLE
  if (!available || pServer == nullptr) {
    return false;
  }
  
  // Vérifier si le serveur a des clients connectés
  return pServer->getConnectedCount() > 0;
#else
  return false;
#endif
}