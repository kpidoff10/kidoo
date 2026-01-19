#include "nfc_manager.h"
#include "../config/pins.h"
#include <Adafruit_PN532.h>
#include <Wire.h>

// Instance du lecteur NFC PN532 en mode I2C
// Pour ESP32, Adafruit_PN532 peut utiliser les pins directement dans le constructeur
// ou utiliser TwoWire avec des pins personnalisées
Adafruit_PN532 nfc(NFC_SDA_PIN, NFC_SCL_PIN);

// Variable pour la gestion de la disponibilité du NFC
// Une seule vérification à l'initialisation : soit il marche, soit il ne marche pas
static bool nfcInitialized = false; // Flag indiquant si le NFC a été initialisé avec succès

bool initNFC() {
  Serial.println("[NFC] Initialisation du module NFC (PN532 I2C)...");
  Serial.print("[NFC] Pins configures - SDA: GPIO");
  Serial.print(NFC_SDA_PIN);
  Serial.print(", SCL: GPIO");
  Serial.println(NFC_SCL_PIN);
  
  // Initialiser le bus I2C avec les pins spécifiées
  // Sur ESP32, Wire.begin() peut prendre les pins SDA et SCL
  Wire.begin(NFC_SDA_PIN, NFC_SCL_PIN);
  
  // Configurer un timeout I2C pour éviter les blocages infinis
  // Sur ESP32, Wire.setTimeout() définit le timeout pour les opérations I2C
  Wire.setTimeout(500); // Timeout de 500ms pour les opérations I2C
  
  delay(100); // Petit délai pour stabiliser I2C
  
  Serial.println("[NFC] I2C initialise, tentative de communication avec le PN532...");
  Serial.println("[NFC] ATTENTION: Verifiez que le module est en mode I2C");
  Serial.println("[NFC] Adresse I2C par defaut: 0x24");
  Serial.println("[NFC] Timeout I2C configure: 500ms");
  
  // Initialiser le module PN532
  nfc.begin();
  delay(200); // Délai pour laisser le module répondre
  
  // Vérifier si le module est détecté (une seule tentative)
  uint32_t versiondata = nfc.getFirmwareVersion();
  
  if (!versiondata) {
    Serial.println("[NFC] ERREUR: Module NFC non detecte !");
    Serial.println("[NFC] Verifications a effectuer:");
    Serial.println("[NFC]   1. Module PN532 alimente en 3.3V");
    Serial.println("[NFC]   2. Module configure en mode I2C (commutateurs DIP)");
    Serial.println("[NFC]   3. SDA du module -> GPIO21");
    Serial.println("[NFC]   4. SCL du module -> GPIO22");
    Serial.println("[NFC]   5. GND connecte");
    Serial.println("[NFC]   6. Adresse I2C: 0x24 (par defaut)");
    Serial.println("[NFC] NOTE: Le module sera considere comme indisponible");
    Serial.println("[NFC]       mais le systeme continuera de fonctionner normalement");
    Serial.println("[NFC]       Aucune verification ulterieure ne sera effectuee");
    
    // Marquer comme non initialisé (indisponible)
    nfcInitialized = false;
    
    return false;
  }
  
  Serial.print("[NFC] Module NFC detecte - Version: ");
  Serial.print((versiondata >> 24) & 0xFF, DEC);
  Serial.print('.');
  Serial.println((versiondata >> 16) & 0xFF, DEC);
  
  // Configurer le PN532 pour lire les tags RFID
  nfc.SAMConfig();
  
  // Marquer comme initialisé (disponible)
  nfcInitialized = true;
  
  Serial.println("[NFC] Module NFC initialise avec succes");
  return true;
}

bool isNFCAvailable() {
  // Retourner le résultat de l'initialisation (vérifiée une seule fois au démarrage)
  // Pas de vérification périodique : soit il marche, soit il ne marche pas
  return nfcInitialized;
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

// Variables pour la détection continue
static NFCEventCallback nfcEventCallback = nullptr;
static bool nfcDetectionActive = false;
static bool nfcDetectionPaused = false; // Flag pour la pause (sans perdre l'état)
static String lastDetectedUID = "";
static unsigned long lastNFCCheckTime = 0;
static const unsigned long NFC_CHECK_INTERVAL = 300; // Vérifier toutes les 300ms
static int noTagCount = 0; // Compteur pour confirmer la disparition d'un tag
static const int NO_TAG_CONFIRM_COUNT = 3; // Confirmer après 3 lectures consécutives sans tag

void startNFCDetection(NFCEventCallback callback) {
  nfcEventCallback = callback;
  nfcDetectionActive = true;
  nfcDetectionPaused = false;
  lastDetectedUID = "";
  lastNFCCheckTime = 0;
  noTagCount = 0;
  Serial.println("[NFC] Detection continue de tags demarree");
}

void stopNFCDetection() {
  nfcDetectionActive = false;
  nfcDetectionPaused = false;
  lastDetectedUID = "";
  noTagCount = 0;
  Serial.println("[NFC] Detection continue de tags arretee");
}

void pauseNFCDetection() {
  if (nfcDetectionActive && !nfcDetectionPaused) {
    nfcDetectionPaused = true;
    Serial.println("[NFC] Detection continue de tags mise en pause");
  } else if (!nfcDetectionActive) {
    Serial.println("[NFC] ATTENTION: Tentative de pause mais detection non active");
  } else if (nfcDetectionPaused) {
    Serial.println("[NFC] ATTENTION: Detection deja en pause");
  }
}

void resumeNFCDetection() {
  if (nfcDetectionActive && nfcDetectionPaused) {
    nfcDetectionPaused = false;
    // Réinitialiser l'état pour éviter de déclencher des événements immédiats
    // après une opération d'écriture/lecture (le tag peut avoir été retiré pendant l'opération)
    lastDetectedUID = "";
    noTagCount = 0;
    lastNFCCheckTime = millis(); // Réinitialiser le timer pour éviter une lecture immédiate
    Serial.println("[NFC] Detection continue de tags reprise (etat reinitialise)");
  }
}

void updateNFCDetection() {
  // Vérifier si la détection est active et non en pause
  // Vérification en premier pour éviter toute opération NFC si en pause
  if (nfcDetectionPaused) {
    return; // En pause, ne rien faire
  }
  
  if (!nfcDetectionActive || !nfcEventCallback) {
    return;
  }
  
  // Vérifier si le module NFC est disponible (utilise le cache, donc rapide)
  if (!isNFCAvailable()) {
    // Si le cache indique que le NFC est indisponible, ne rien faire
    // La vérification périodique se fera automatiquement
    return;
  }
  
  // Vérifier si on doit faire une lecture (toutes les 300ms)
  unsigned long currentTime = millis();
  if (currentTime - lastNFCCheckTime < NFC_CHECK_INTERVAL) {
    return;
  }
  lastNFCCheckTime = currentTime;
  
  // Essayer de lire un tag (timeout court de 100ms pour ne pas bloquer)
  // Cette opération peut bloquer jusqu'à 100ms, mais c'est acceptable
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  uint8_t success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 100);
  
  // Si la lecture échoue de manière répétée, cela pourrait indiquer que le module ne répond plus
  // On laisse isNFCAvailable() gérer cela lors de sa prochaine vérification périodique
  
  String currentUID = "";
  if (success && uidLength > 0) {
    // Formater l'UID
    currentUID = formatUID(uid, uidLength);
  }
  
  // Détecter les transitions d'état
  if (currentUID.length() > 0) {
    // Un tag est présent
    if (lastDetectedUID.length() == 0) {
      // Transition : aucun tag -> tag présent (TAG_PLACED)
      NFCEvent event;
      event.type = NFC_EVENT_TAG_PLACED;
      event.uid = currentUID;
      
      Serial.print("[NFC] Tag pose - UID: ");
      Serial.println(currentUID);
      
      nfcEventCallback(event);
      lastDetectedUID = currentUID;
      noTagCount = 0;
    } else if (lastDetectedUID != currentUID) {
      // Transition : tag différent (TAG_CHANGED)
      NFCEvent event;
      event.type = NFC_EVENT_TAG_CHANGED;
      event.uid = currentUID;
      
      Serial.print("[NFC] Tag change - Ancien UID: ");
      Serial.print(lastDetectedUID);
      Serial.print(" -> Nouveau UID: ");
      Serial.println(currentUID);
      
      nfcEventCallback(event);
      lastDetectedUID = currentUID;
      noTagCount = 0;
    }
    // Si le même tag est toujours présent, ne rien faire
  } else {
    // Aucun tag détecté
    if (lastDetectedUID.length() > 0) {
      // Un tag était présent avant, incrémenter le compteur
      noTagCount++;
      
      // Confirmer la disparition après plusieurs lectures consécutives
      if (noTagCount >= NO_TAG_CONFIRM_COUNT) {
        // Transition : tag présent -> aucun tag (TAG_REMOVED)
        NFCEvent event;
        event.type = NFC_EVENT_TAG_REMOVED;
        event.uid = lastDetectedUID;
        
        Serial.print("[NFC] Tag retire - UID: ");
        Serial.println(lastDetectedUID);
        
        nfcEventCallback(event);
        lastDetectedUID = "";
        noTagCount = 0;
      }
    }
  }
}
