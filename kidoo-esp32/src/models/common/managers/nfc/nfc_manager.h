#ifndef NFC_MANAGER_H
#define NFC_MANAGER_H

#include <Arduino.h>

/**
 * Gestionnaire NFC commun
 * 
 * Ce module gère l'initialisation et les opérations NFC
 * pour tous les modèles supportant le NFC
 */

class NFCManager {
public:
  /**
   * Initialiser le gestionnaire NFC
   * @return true si l'initialisation est réussie, false sinon
   */
  static bool init();
  
  /**
   * Vérifier si le NFC est disponible/opérationnel
   * @return true si le NFC est opérationnel, false sinon
   */
  static bool isAvailable();
  
  /**
   * Vérifier si le NFC est initialisé
   * @return true si le NFC est initialisé, false sinon
   */
  static bool isInitialized();
  
  /**
   * Obtenir la version du firmware du module NFC (si disponible)
   * @return Version du firmware (0 si indisponible)
   */
  static uint32_t getFirmwareVersion();
  
  /**
   * Lire l'UID d'un tag NFC
   * @param uid Buffer pour stocker l'UID (max 10 bytes)
   * @param uidLength Pointeur pour stocker la longueur de l'UID
   * @param timeoutMs Timeout en millisecondes (défaut: 5000)
   * @return true si un tag a été détecté et lu, false sinon
   */
  static bool readTagUID(uint8_t* uid, uint8_t* uidLength, uint32_t timeoutMs = 5000);
  
  /**
   * Lire un bloc de données d'un tag NFC MIFARE Classic
   * @param blockNumber Numéro du bloc à lire (0-63)
   * @param data Buffer pour stocker les données (16 bytes)
   * @param uid UID du tag (doit être lu au préalable)
   * @param uidLength Longueur de l'UID
   * @return true si la lecture a réussi, false sinon
   */
  static bool readBlock(uint8_t blockNumber, uint8_t* data, uint8_t* uid, uint8_t uidLength);
  
  /**
   * Écrire un bloc de données sur un tag NFC MIFARE Classic
   * @param blockNumber Numéro du bloc à écrire (0-63)
   * @param data Données à écrire (16 bytes)
   * @param uid UID du tag (doit être lu au préalable)
   * @param uidLength Longueur de l'UID
   * @return true si l'écriture a réussi, false sinon
   */
  static bool writeBlock(uint8_t blockNumber, uint8_t* data, uint8_t* uid, uint8_t uidLength);

private:
  /**
   * Tester le hardware NFC
   * @return true si le hardware répond, false sinon
   */
  static bool testHardware();
  
  // Variables statiques
  static bool initialized;
  static bool available;
  static uint32_t firmwareVersion;
};

#endif // NFC_MANAGER_H
