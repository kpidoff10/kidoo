#include "mode_manager.h"
#include "state_manager.h"
#include "led_controller.h"
#include "../effects/led_effects.h"

Mode ModeManager::determineMode() {
  // Priorité: Mode manuel > Effets forcés > Config chargée (VERT) > WiFi domestique > Client AP > Bluetooth > Rouge > Transition sommeil > Sommeil
  
  // Vérifier d'abord le mode sommeil (priorité la plus basse)
  if (StateManager::isSleeping()) {
    return MODE_SLEEP;
  }
  
  if (StateManager::isInSleepTransition()) {
    return MODE_SLEEP_TRANSITION;
  }
  
  if (StateManager::isForceManualMode()) {
    return MODE_MANUAL;
  }
  
  if (StateManager::isForceGlossyMode()) {
    return MODE_GLOSSY;
  }
  
  if (StateManager::isForceRainbowMode()) {
    return MODE_RAINBOW;
  }
  
  if (StateManager::isForcePulseMode()) {
    return MODE_PULSE;
  }
  
  // Si la config est chargée, afficher le vert progressif (même si WiFi pas encore connecté)
  if (StateManager::isConfigLoaded()) {
    return MODE_GREEN;
  }
  
  if (StateManager::isWiFiConnected()) {
    return MODE_GREEN;
  }
  
  if (StateManager::getWiFiAPClients() > 0) {
    return MODE_GLOSSY;
  }
  
  if (StateManager::isBLEConnected()) {
    return MODE_BLUE;
  }
  
  return MODE_RED;
}

void ModeManager::applyMode(Mode mode) {
  CRGB* leds = LEDController::getLeds();
  int numLeds = LEDController::getNumLeds();
  
  switch (mode) {
    case MODE_MANUAL:
      // En mode manuel, ne rien faire (la couleur a déjà été appliquée par la commande)
      delay(50);
      break;
      
    case MODE_GREEN:
      setGreenProgressCircle(leds, numLeds);
      delay(30);  // Vitesse de l'animation du cercle progressif
      break;
      
    case MODE_GLOSSY:
      setGlossy(leds, numLeds);
      delay(20);  // Vitesse de l'animation glossy
      break;
      
    case MODE_RAINBOW:
      setRainbow(leds, numLeds);
      delay(20);  // Vitesse de l'animation rainbow
      break;
      
    case MODE_PULSE:
      setPulse(leds, numLeds);
      delay(20);  // Vitesse de l'animation pulse
      break;
      
    case MODE_BLUE:
      setColor(leds, numLeds, CRGB::Blue);
      delay(50);
      break;
      
    case MODE_RED:
      setRed(leds, numLeds);
      delay(50);
      break;
    
    case MODE_SLEEP_TRANSITION:
      setSleepTransition(leds, numLeds);
      delay(30);  // Vitesse de l'animation de transition
      break;
    
    case MODE_SLEEP:
      // Éteindre toutes les LEDs
      LEDController::lock();
      for (int i = 0; i < numLeds; i++) {
        leds[i] = CRGB::Black;
      }
      LEDController::show();
      LEDController::unlock();
      delay(100);  // Réduire la consommation en mode sommeil
      break;
    
    default:
      break;
  }
}
