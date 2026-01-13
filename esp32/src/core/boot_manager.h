#ifndef BOOT_MANAGER_H
#define BOOT_MANAGER_H

#include <Arduino.h>

class BootManager {
public:
  // Effectuer toutes les initialisations au démarrage
  // Retourne true si la configuration a été chargée avec succès
  static bool boot();
  
private:
  // Initialiser la communication série
  static void initSerial();
  
  // Initialiser les systèmes de base (LED, StateManager)
  static void initCoreSystems();
  
  // Initialiser et vérifier la carte SD
  // Retourne true si la carte SD est disponible
  static bool initSDCard();
  
  // Charger la configuration depuis la carte SD
  // Retourne true si la configuration a été chargée avec succès
  static bool loadConfiguration();
  
  // Initialiser les systèmes réseau (WiFi, BLE)
  static void initNetworkSystems();
};

#endif // BOOT_MANAGER_H
