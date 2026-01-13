#ifndef NFC_MANAGER_H
#define NFC_MANAGER_H

#include <Arduino.h>

// Structure pour stocker les données d'un tag NFC
struct NFCTagData {
  uint8_t uid[10];        // UID du tag (max 10 bytes)
  uint8_t uidLength;     // Longueur de l'UID
  bool isValid;          // Indique si les données sont valides
  String uidString;       // UID formaté en string hexadécimal
};

// Structure pour les données à écrire sur un tag
struct NFCWriteData {
  uint8_t data[16];      // Données à écrire (16 bytes max par bloc)
  uint8_t dataLength;    // Longueur des données
  uint8_t blockNumber;   // Numéro du bloc à écrire (0-63 pour MIFARE Classic 1K)
};

// Fonction pour initialiser le module NFC
bool initNFC();

// Fonction pour vérifier si le module NFC est disponible
bool isNFCAvailable();

// Fonction pour lire un tag NFC
// Retourne true si un tag a été détecté et lu avec succès
bool readNFCTag(NFCTagData& tagData);

// Fonction pour écrire des données sur un tag NFC
// Retourne true si l'écriture a réussi
bool writeNFCTag(const NFCWriteData& writeData, NFCTagData& tagData);

// Fonction pour formater l'UID en string hexadécimal
String formatUID(const uint8_t* uid, uint8_t length);

// Fonction pour vérifier si un tag est présent
bool isTagPresent();

#endif // NFC_MANAGER_H
