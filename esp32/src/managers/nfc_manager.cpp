#include "nfc_manager.h"
#include "../config/pins.h"
#include <Adafruit_PN532.h>
#include <Wire.h>

// Instance du lecteur NFC PN532 en mode I2C
// Pour ESP32, Adafruit_PN532 peut utiliser les pins directement dans le constructeur
// ou utiliser TwoWire avec des pins personnalisées
Adafruit_PN532 nfc(NFC_SDA_PIN, NFC_SCL_PIN);

bool initNFC() {
  Serial.println("[NFC] Initialisation du module NFC (PN532 I2C)...");
  Serial.print("[NFC] Pins configures - SDA: GPIO");
  Serial.print(NFC_SDA_PIN);
  Serial.print(", SCL: GPIO");
  Serial.println(NFC_SCL_PIN);
  
  // Initialiser le bus I2C avec les pins spécifiées
  // Sur ESP32, Wire.begin() peut prendre les pins SDA et SCL
  Wire.begin(NFC_SDA_PIN, NFC_SCL_PIN);
  delay(100); // Petit délai pour stabiliser I2C
  
  Serial.println("[NFC] I2C initialise, tentative de communication avec le PN532...");
  Serial.println("[NFC] ATTENTION: Verifiez que le module est en mode I2C");
  Serial.println("[NFC] Adresse I2C par defaut: 0x24");
  
  // Initialiser le module PN532
  nfc.begin();
  delay(200); // Délai pour laisser le module répondre
  
  // Vérifier si le module est détecté (plusieurs tentatives)
  uint32_t versiondata = 0;
  for (int i = 0; i < 3; i++) {
    versiondata = nfc.getFirmwareVersion();
    if (versiondata) {
      break;
    }
    Serial.print("[NFC] Tentative ");
    Serial.print(i + 1);
    Serial.println("/3 echouee, nouvelle tentative...");
    delay(200);
  }
  
  if (!versiondata) {
    Serial.println("[NFC] ERREUR: Module NFC non detecte apres 3 tentatives !");
    Serial.println("[NFC] Verifications a effectuer:");
    Serial.println("[NFC]   1. Module PN532 alimente en 3.3V");
    Serial.println("[NFC]   2. Module configure en mode I2C (commutateurs DIP)");
    Serial.println("[NFC]   3. SDA du module -> GPIO21");
    Serial.println("[NFC]   4. SCL du module -> GPIO22");
    Serial.println("[NFC]   5. GND connecte");
    Serial.println("[NFC]   6. Adresse I2C: 0x24 (par defaut)");
    return false;
  }
  
  Serial.print("[NFC] Module NFC detecte - Version: ");
  Serial.print((versiondata >> 24) & 0xFF, DEC);
  Serial.print('.');
  Serial.println((versiondata >> 16) & 0xFF, DEC);
  
  // Configurer le PN532 pour lire les tags RFID
  nfc.SAMConfig();
  
  Serial.println("[NFC] Module NFC initialise avec succes");
  return true;
}

bool isNFCAvailable() {
  // Vérifier si le module répond
  // Ne pas appeler getFirmwareVersion() à chaque fois car cela peut être lent
  // On suppose que si initNFC() a réussi, le module est disponible
  // Pour une vérification plus robuste, on pourrait stocker un flag
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("[NFC] ATTENTION: Module NFC ne repond plus");
    Serial.println("[NFC] Verifiez les connexions et l'alimentation");
  }
  return (versiondata != 0);
}

bool isTagPresent() {
  // Vérifier si un tag est présent
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 100);
  return (success > 0);
}

String formatUID(const uint8_t* uid, uint8_t length) {
  String uidString = "";
  for (uint8_t i = 0; i < length; i++) {
    if (uid[i] < 0x10) {
      uidString += "0";
    }
    uidString += String(uid[i], HEX);
    if (i < length - 1) {
      uidString += ":";
    }
  }
  uidString.toUpperCase();
  return uidString;
}

bool readNFCTag(NFCTagData& tagData) {
  // Réinitialiser la structure
  memset(&tagData, 0, sizeof(tagData));
  tagData.isValid = false;
  
  // Lire l'UID du tag
  // Attendre jusqu'à 15 secondes pour détecter un tag
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  unsigned long startTime = millis();
  const unsigned long timeout = 15000; // 15 secondes
  uint8_t success = 0;
  
  Serial.println("[NFC] Attente de detection d'un tag NFC (15 secondes max)...");
  
  // Boucle de détection avec timeout
  while (millis() - startTime < timeout) {
    // Essayer de détecter un tag (timeout de 500ms par tentative)
    success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 500);
    
    if (success) {
      Serial.println("[NFC] Tag detecte !");
      break;
    }
    
    // Attendre un peu avant de réessayer
    delay(200);
  }
  
  if (!success) {
    Serial.println("[NFC] ERREUR: Aucun tag detecte apres 15 secondes");
    return false;
  }
  
  // Copier l'UID
  if (uidLength > 10) {
    uidLength = 10; // Limiter à 10 bytes
  }
  
  tagData.uidLength = uidLength;
  memcpy(tagData.uid, uid, uidLength);
  tagData.uidString = formatUID(tagData.uid, uidLength);
  tagData.isValid = true;
  
  Serial.print("[NFC] Tag detecte - UID: ");
  Serial.println(tagData.uidString);
  
  return true;
}

bool writeNFCTag(const NFCWriteData& writeData, NFCTagData& tagData) {
  // Réinitialiser la structure
  memset(&tagData, 0, sizeof(tagData));
  tagData.isValid = false;
  
  // Lire l'UID du tag d'abord
  // Attendre jusqu'à 15 secondes pour détecter un tag
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  unsigned long startTime = millis();
  const unsigned long timeout = 15000; // 15 secondes
  uint8_t success = 0;
  
  Serial.println("[NFC] Attente de detection d'un tag NFC (15 secondes max)...");
  
  // Boucle de détection avec timeout
  while (millis() - startTime < timeout) {
    // Essayer de détecter un tag (timeout de 500ms par tentative)
    success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 500);
    
    if (success) {
      Serial.println("[NFC] Tag detecte !");
      break;
    }
    
    // Attendre un peu avant de réessayer
    delay(200);
  }
  
  if (!success) {
    Serial.println("[NFC] ERREUR: Aucun tag detecte apres 15 secondes");
    return false;
  }
  
  // Copier l'UID
  if (uidLength > 10) {
    uidLength = 10;
  }
  tagData.uidLength = uidLength;
  memcpy(tagData.uid, uid, uidLength);
  tagData.uidString = formatUID(tagData.uid, tagData.uidLength);
  
  // Vérifier que le numéro de bloc est valide
  if (writeData.blockNumber > 63) {
    Serial.println("[NFC] ERREUR: Numero de bloc invalide (0-63)");
    return false;
  }
  
  // Authentifier avec la clé par défaut (FF FF FF FF FF FF)
  uint8_t keyA[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
  
  success = nfc.mifareclassic_AuthenticateBlock(uid, uidLength, writeData.blockNumber, 0, keyA);
  
  if (!success) {
    Serial.println("[NFC] ERREUR: Authentification echouee");
    return false;
  }
  
  // Préparer les données à écrire (16 bytes)
  uint8_t data[16];
  memset(data, 0, sizeof(data));
  
  // Copier les données à écrire
  uint8_t dataLength = writeData.dataLength;
  if (dataLength > 16) {
    dataLength = 16; // Limiter à 16 bytes
  }
  memcpy(data, writeData.data, dataLength);
  
  // Écrire le bloc
  success = nfc.mifareclassic_WriteDataBlock(writeData.blockNumber, data);
  
  if (!success) {
    Serial.println("[NFC] ERREUR: Ecriture echouee");
    return false;
  }
  
  Serial.print("[NFC] Donnees ecrites avec succes sur le bloc ");
  Serial.println(writeData.blockNumber);
  
  tagData.isValid = true;
  
  return true;
}
