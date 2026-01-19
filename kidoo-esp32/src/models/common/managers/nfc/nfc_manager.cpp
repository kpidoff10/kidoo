#include "nfc_manager.h"
#include "../../../model_config.h"
#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_PN532.h>
#include <string.h>

// Instance statique du PN532 (créée lors de l'initialisation)
static Adafruit_PN532* nfcInstance = nullptr;

// Variables statiques
bool NFCManager::initialized = false;
bool NFCManager::available = false;
uint32_t NFCManager::firmwareVersion = 0;

bool NFCManager::init() {
  if (initialized) {
    return available;
  }
  
  initialized = true;
  available = false;
  firmwareVersion = 0;
  
  // Tester le hardware NFC
  available = testHardware();
  
  if (available) {
    // Le NFC est opérationnel et initialisé
    // Le hardware a été testé et la version du firmware a été lue
  } else {
    // Le NFC n'est pas opérationnel
    // Un warning sera affiché dans InitManager
  }
  
  return available;
}

bool NFCManager::isAvailable() {
  return initialized && available;
}

bool NFCManager::isInitialized() {
  return initialized;
}

uint32_t NFCManager::getFirmwareVersion() {
  return firmwareVersion;
}

bool NFCManager::testHardware() {
  // Vérifier si le modèle supporte le NFC
  #ifndef HAS_NFC
    return false;
  #endif
  
  #if !HAS_NFC
    return false;
  #endif
  
  // Initialiser le bus I2C si pas déjà fait
  // Wire.begin() peut être appelé plusieurs fois sans problème
  Wire.begin(NFC_SDA_PIN, NFC_SCL_PIN);
  Wire.setTimeout(500); // Timeout de 500ms pour les opérations I2C
  delay(100); // Petit délai pour stabiliser le bus I2C
  
  // Créer une instance temporaire du PN532 pour le test
  // Adafruit_PN532 peut utiliser les pins directement dans le constructeur
  Adafruit_PN532 nfc(NFC_SDA_PIN, NFC_SCL_PIN);
  
  // Initialiser le module PN532
  nfc.begin();
  delay(200); // Délai pour laisser le module répondre
  
  // Tenter de lire la version du firmware
  // Si getFirmwareVersion() retourne 0, le module n'est pas détecté
  uint32_t versiondata = nfc.getFirmwareVersion();
  
  if (!versiondata) {
    // Le module NFC n'est pas détecté
    firmwareVersion = 0;
    return false;
  }
  
  // Le module est détecté, stocker la version du firmware
  firmwareVersion = versiondata;
  
  // Configurer le PN532 pour lire les tags RFID
  nfc.SAMConfig();
  
  // Créer l'instance statique pour les opérations futures
  if (nfcInstance == nullptr) {
    nfcInstance = new Adafruit_PN532(NFC_SDA_PIN, NFC_SCL_PIN);
    nfcInstance->begin();
    nfcInstance->SAMConfig();
  }
  
  return true;
}

bool NFCManager::readTagUID(uint8_t* uid, uint8_t* uidLength, uint32_t timeoutMs) {
  if (!isAvailable() || nfcInstance == nullptr) {
    return false;
  }
  
  unsigned long startTime = millis();
  uint8_t success = 0;
  
  // Boucle de détection avec timeout
  while (millis() - startTime < timeoutMs) {
    // Essayer de détecter un tag (timeout de 500ms par tentative)
    success = nfcInstance->readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, uidLength, 500);
    
    if (success) {
      // Limiter la longueur à 10 bytes max
      if (*uidLength > 10) {
        *uidLength = 10;
      }
      return true;
    }
    
    // Attendre un peu avant de réessayer
    delay(200);
  }
  
  return false;
}

bool NFCManager::readBlock(uint8_t blockNumber, uint8_t* data, uint8_t* uid, uint8_t uidLength) {
  if (!isAvailable() || nfcInstance == nullptr) {
    return false;
  }
  
  if (blockNumber > 63) {
    return false;
  }
  
  // Authentifier avec la clé par défaut (FF FF FF FF FF FF)
  uint8_t keyA[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
  
  uint8_t success = nfcInstance->mifareclassic_AuthenticateBlock(uid, uidLength, blockNumber, 0, keyA);
  
  if (!success) {
    return false;
  }
  
  // Lire le bloc
  success = nfcInstance->mifareclassic_ReadDataBlock(blockNumber, data);
  
  return (success > 0);
}

bool NFCManager::writeBlock(uint8_t blockNumber, uint8_t* data, uint8_t* uid, uint8_t uidLength) {
  if (!isAvailable() || nfcInstance == nullptr) {
    return false;
  }
  
  if (blockNumber > 63) {
    return false;
  }
  
  // Authentifier avec la clé par défaut (FF FF FF FF FF FF)
  uint8_t keyA[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
  
  uint8_t success = nfcInstance->mifareclassic_AuthenticateBlock(uid, uidLength, blockNumber, 0, keyA);
  
  if (!success) {
    return false;
  }
  
  // Écrire le bloc
  success = nfcInstance->mifareclassic_WriteDataBlock(blockNumber, data);
  
  return (success > 0);
}
