#include "../managers/init/init_manager.h"
#include "../managers/ble/ble_manager.h"
#include "../../model_config.h"

bool InitManager::initBLE() {
  systemStatus.ble = INIT_IN_PROGRESS;
  
#ifndef HAS_BLE
  systemStatus.ble = INIT_NOT_STARTED;
  Serial.println("[INIT] BLE non disponible sur ce modèle");
  return false;
#else
  // Construire le nom du device avec le modèle
  String deviceName = "KIDOO-";
  deviceName += KIDOO_MODEL_NAME;
  
  if (!BLEManager::init(deviceName.c_str())) {
    systemStatus.ble = INIT_FAILED;
    Serial.println("[INIT] ERREUR: Echec initialisation BLE");
    return false;
  }
  
  if (!BLEManager::isAvailable()) {
    systemStatus.ble = INIT_FAILED;
    Serial.println("[INIT] WARNING: BLE non disponible");
    return false;
  }
  
  // Démarrer l'advertising
  BLEManager::startAdvertising();
  
  systemStatus.ble = INIT_SUCCESS;
  Serial.println("[INIT] BLE operationnel");
  
  return true;
#endif
}