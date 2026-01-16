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

// Types d'événements NFC
enum NFCEventType {
  NFC_EVENT_TAG_PLACED,    // Un tag vient d'être posé
  NFC_EVENT_TAG_REMOVED,   // Un tag vient d'être retiré
  NFC_EVENT_TAG_CHANGED    // Un tag différent a été posé (remplacement)
};

// Structure pour les événements NFC
struct NFCEvent {
  NFCEventType type;
  String uid;              // UID du tag concerné
};

// Type de callback pour les événements NFC
typedef void (*NFCEventCallback)(const NFCEvent& event);

// Fonction pour démarrer la détection continue de tags
// Appelle le callback à chaque changement d'état (tag posé, retiré, changé)
void startNFCDetection(NFCEventCallback callback);

// Fonction pour arrêter la détection continue
void stopNFCDetection();

// Fonction pour mettre en pause la détection continue (sans perdre l'état)
void pauseNFCDetection();

// Fonction pour reprendre la détection continue après une pause
void resumeNFCDetection();

// Fonction pour mettre à jour la détection (à appeler dans loop())
void updateNFCDetection();

#endif // NFC_MANAGER_H
