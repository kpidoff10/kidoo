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
