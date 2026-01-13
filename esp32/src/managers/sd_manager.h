#ifndef SD_MANAGER_H
#define SD_MANAGER_H

#include <Arduino.h>

// Fonction pour initialiser la carte SD
bool initSDCard();

// Fonction pour vérifier si la carte SD est disponible
bool isSDCardAvailable();

// Fonction pour obtenir l'espace libre sur la carte SD (en octets)
uint64_t getSDCardFreeSpace();

// Fonction pour obtenir l'espace total de la carte SD (en octets)
uint64_t getSDCardTotalSpace();

// Fonction pour lister les fichiers dans un dossier
void listSDCardFiles(const char* dirPath = "/");

// Fonction pour créer un dossier
bool createSDCardDirectory(const char* dirPath);

// Fonction pour écrire un fichier sur la carte SD
bool writeSDCardFile(const char* filePath, const uint8_t* data, size_t dataSize);

// Fonction pour écrire un fichier de manière atomique (évite la corruption en cas de coupure)
// Écrit dans un fichier temporaire, puis le renomme pour remplacer l'original
bool writeSDCardFileAtomic(const char* filePath, const uint8_t* data, size_t dataSize);

// Fonction pour lire un fichier depuis la carte SD
bool readSDCardFile(const char* filePath, uint8_t* buffer, size_t bufferSize);

// Fonction pour supprimer un fichier
bool deleteSDCardFile(const char* filePath);

// Fonction pour vérifier si un fichier existe
bool sdCardFileExists(const char* filePath);

// Fonction pour obtenir la taille d'un fichier (en octets, retourne 0 si erreur)
uint32_t getSDCardFileSize(const char* filePath);

#endif // SD_MANAGER_H
