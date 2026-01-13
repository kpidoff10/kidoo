#include "state_manager.h"
#include "../config/config.h"
#include "../managers/config_manager.h"

Mode StateManager::currentMode = MODE_RED;
Mode StateManager::previousMode = MODE_RED;
bool StateManager::forceManualMode = false;
bool StateManager::forceGlossyMode = false;
bool StateManager::forceRainbowMode = false;
bool StateManager::forcePulseMode = false;
bool StateManager::wifiConnected = false;
bool StateManager::bleConnected = false;
int StateManager::wifiAPClients = 0;
bool StateManager::configLoaded = false;
unsigned long StateManager::lastActivityTime = 0;
bool StateManager::inSleepTransition = false;
bool StateManager::isInitializing = true;  // Par défaut, on est en initialisation
unsigned long StateManager::bootEndTime = 0;  // Timestamp de fin du boot

void StateManager::init() {
  currentMode = MODE_RED;
  previousMode = MODE_RED;
  forceManualMode = false;
  forceGlossyMode = false;
  forceRainbowMode = false;
  forcePulseMode = false;
  wifiConnected = false;
  bleConnected = false;
  wifiAPClients = 0;
  configLoaded = false;
  lastActivityTime = millis();
  inSleepTransition = false;
  // Ne pas toucher à isInitializing ici - il est géré par BootManager
}

Mode StateManager::getCurrentMode() {
  return currentMode;
}

Mode StateManager::getPreviousMode() {
  return previousMode;
}

void StateManager::setMode(Mode mode) {
  previousMode = currentMode;
  currentMode = mode;
}

const char* StateManager::getModeName(Mode mode) {
  switch (mode) {
    case MODE_MANUAL: return "MANUEL";
    case MODE_GLOSSY: return "GLOSSY";
    case MODE_RAINBOW: return "RAINBOW";
    case MODE_PULSE: return "PULSE";
    case MODE_RED: return "ROUGE";
    case MODE_BLUE: return "BLEU";
    case MODE_GREEN: return "VERT";
    case MODE_SLEEP_TRANSITION: return "TRANSITION_SOMMEIL";
    case MODE_SLEEP: return "SOMMEIL";
    default: return "INCONNU";
  }
}

bool StateManager::hasModeChanged() {
  return currentMode != previousMode;
}

void StateManager::setForceManualMode(bool enabled) {
  forceManualMode = enabled;
}

void StateManager::setForceGlossyMode(bool enabled) {
  forceGlossyMode = enabled;
}

void StateManager::setForceRainbowMode(bool enabled) {
  forceRainbowMode = enabled;
}

void StateManager::setForcePulseMode(bool enabled) {
  forcePulseMode = enabled;
}

bool StateManager::isForceManualMode() {
  return forceManualMode;
}

bool StateManager::isForceGlossyMode() {
  return forceGlossyMode;
}

bool StateManager::isForceRainbowMode() {
  return forceRainbowMode;
}

bool StateManager::isForcePulseMode() {
  return forcePulseMode;
}

void StateManager::setWiFiConnected(bool connected) {
  wifiConnected = connected;
}

void StateManager::setBLEConnected(bool connected) {
  bleConnected = connected;
}

void StateManager::setWiFiAPClients(int count) {
  wifiAPClients = count;
}

bool StateManager::isWiFiConnected() {
  return wifiConnected;
}

bool StateManager::isBLEConnected() {
  return bleConnected;
}

int StateManager::getWiFiAPClients() {
  return wifiAPClients;
}

void StateManager::setConfigLoaded(bool loaded) {
  configLoaded = loaded;
}

bool StateManager::isConfigLoaded() {
  return configLoaded;
}

void StateManager::resetForceModes() {
  forceManualMode = false;
  forceGlossyMode = false;
  forceRainbowMode = false;
  forcePulseMode = false;
}

void StateManager::resetSleepTimer(bool forceWake) {
  // Ne pas réinitialiser le timer pendant l'initialisation
  if (isInitializing) {
    return;
  }
  
  // Si forceWake est true (activité réelle comme connexion Bluetooth), toujours réinitialiser
  // Sinon, ne pas réinitialiser si on est déjà en mode sommeil (évite les boucles)
  if (!forceWake) {
    Mode currentMode = getCurrentMode();
    if (currentMode == MODE_SLEEP || currentMode == MODE_SLEEP_TRANSITION) {
      // Ne pas réinitialiser si on est déjà en sommeil et que ce n'est pas une activité forcée
      return;
    }
  }
  
  lastActivityTime = millis();
  inSleepTransition = false;
}

void StateManager::setInitializing(bool initializing) {
  isInitializing = initializing;
  if (!initializing) {
    // Quand l'initialisation est terminée, réinitialiser le timer pour démarrer le compteur
    unsigned long currentTime = millis();
    lastActivityTime = currentTime;
    bootEndTime = currentTime;  // Enregistrer le moment de fin du boot
    inSleepTransition = false;
  }
}

void StateManager::updateSleepTimer() {
  // Ne pas mettre à jour le timer pendant l'initialisation
  if (isInitializing) {
    inSleepTransition = false;
    return;
  }
  
  unsigned long currentTime = millis();
  
  // Délai de grâce après le boot : attendre au moins 5 secondes après la fin du boot
  // avant de permettre le mode sommeil
  const unsigned long BOOT_GRACE_PERIOD_MS = 5000;  // 5 secondes de grâce après le boot
  if (bootEndTime > 0 && (currentTime - bootEndTime) < BOOT_GRACE_PERIOD_MS) {
    // Encore dans la période de grâce après le boot, ne pas activer le mode sommeil
    inSleepTransition = false;
    // Réinitialiser le timer pour qu'il démarre après la période de grâce
    lastActivityTime = currentTime;
    return;
  }
  
  unsigned long inactivityDuration = currentTime - lastActivityTime;
  
  // Utiliser la valeur configurable depuis config_manager
  unsigned long sleepTimeout = getConfigSleepTimeout();
  unsigned long sleepTransitionStart = sleepTimeout * 0.8; // 80% du timeout pour la transition
  
  if (inactivityDuration >= sleepTimeout) {
    // En mode sommeil complet
    inSleepTransition = false;
  } else if (inactivityDuration >= sleepTransitionStart) {
    // En transition vers le sommeil
    inSleepTransition = true;
  } else {
    // Activité récente, pas de sommeil
    inSleepTransition = false;
  }
}

bool StateManager::isSleeping() {
  // Ne jamais être en mode sommeil pendant l'initialisation
  if (isInitializing) {
    return false;
  }
  
  unsigned long currentTime = millis();
  
  // Délai de grâce après le boot : attendre au moins 5 secondes après la fin du boot
  const unsigned long BOOT_GRACE_PERIOD_MS = 5000;
  if (bootEndTime > 0 && (currentTime - bootEndTime) < BOOT_GRACE_PERIOD_MS) {
    return false;  // Encore dans la période de grâce
  }
  
  unsigned long inactivityDuration = currentTime - lastActivityTime;
  unsigned long sleepTimeout = getConfigSleepTimeout();
  return inactivityDuration >= sleepTimeout;
}

bool StateManager::isInSleepTransition() {
  // Ne jamais être en transition vers le sommeil pendant l'initialisation
  if (isInitializing) {
    return false;
  }
  return inSleepTransition;
}
