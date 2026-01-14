#ifndef STATE_MANAGER_H
#define STATE_MANAGER_H

#include <Arduino.h>

// Enum pour les différents modes
enum Mode {
  MODE_MANUAL,  // Mode manuel (contrôle via Bluetooth/app)
  MODE_GLOSSY,
  MODE_RAINBOW, // Effet arc-en-ciel
  MODE_PULSE,   // Effet pulsation
  MODE_RED,
  MODE_BLUE,
  MODE_GREEN,
  MODE_SLEEP_TRANSITION,  // Transition avant le sommeil (effet lumineux)
  MODE_SLEEP,   // Mode sommeil (LEDs éteintes)
  MODE_COUNT  // Nombre total de modes
};

class StateManager {
public:
  // Initialiser le gestionnaire d'état
  static void init();
  
  // Gestion du mode
  static Mode getCurrentMode();
  static Mode getPreviousMode();
  static void setMode(Mode mode);
  static const char* getModeName(Mode mode);
  static bool hasModeChanged();
  
  // Gestion des flags de mode forcé
  static void setForceManualMode(bool enabled);
  static void setForceGlossyMode(bool enabled);
  static void setForceRainbowMode(bool enabled);
  static void setForcePulseMode(bool enabled);
  
  static bool isForceManualMode();
  static bool isForceGlossyMode();
  static bool isForceRainbowMode();
  static bool isForcePulseMode();
  
  // Gestion des connexions
  static void setWiFiConnected(bool connected);
  static void setBLEConnected(bool connected);
  static void setWiFiAPClients(int count);
  
  static bool isWiFiConnected();
  static bool isBLEConnected();
  static int getWiFiAPClients();
  
  // Gestion de la configuration
  static void setConfigLoaded(bool loaded);
  static bool isConfigLoaded();
  
  // Gestion du mode sommeil
  static void resetSleepTimer(bool forceWake = false);  // Réinitialiser le timer d'inactivité (forceWake=true pour forcer le réveil)
  static void updateSleepTimer(); // Mettre à jour le timer (à appeler dans loop)
  static bool isSleeping();
  static bool isInSleepTransition();
  static void setInitializing(bool initializing); // Indiquer que l'initialisation est en cours
  static bool isInitializing(); // Vérifier si l'initialisation est en cours
  
  // Réinitialiser tous les flags de mode forcé
  static void resetForceModes();

private:
  static Mode currentMode;
  static Mode previousMode;
  static bool forceManualMode;
  static bool forceGlossyMode;
  static bool forceRainbowMode;
  static bool forcePulseMode;
  static bool wifiConnected;
  static bool bleConnected;
  static int wifiAPClients;
  static bool configLoaded;
  static unsigned long lastActivityTime;  // Dernière activité détectée
  static bool inSleepTransition;          // En transition vers le sommeil
  static bool _isInitializing;            // Flag pour indiquer que l'initialisation est en cours
  static unsigned long bootEndTime;      // Timestamp de fin du boot (pour délai de grâce)
};

#endif // STATE_MANAGER_H
