#ifndef LED_CONTROLLER_H
#define LED_CONTROLLER_H

#include <Arduino.h>
#include <FastLED.h>
#include "../config/config.h"
#include <freertos/FreeRTOS.h>
#include <freertos/semphr.h>

class LEDController {
public:
  // Initialiser le contrôleur LED
  static bool init();
  
  // Obtenir le nombre de LEDs
  static int getNumLeds();
  
  // Obtenir le tableau de LEDs (pour les effets)
  // ATTENTION: Toujours utiliser lock() avant et unlock() après modification
  static CRGB* getLeds();
  
  // Verrouiller l'accès aux LEDs (à appeler avant toute modification)
  static void lock();
  
  // Déverrouiller l'accès aux LEDs (à appeler après toute modification)
  static void unlock();
  
  // Appliquer les changements (appeler FastLED.show())
  // Cette fonction verrouille automatiquement le mutex
  static void show();
  
  // Définir la luminosité (0-255)
  static void setBrightness(uint8_t brightness);
  
  // Obtenir la luminosité actuelle
  static uint8_t getBrightness();
  
  // Définir la luminosité en pourcentage (0-100)
  static void setBrightnessPercent(uint8_t percent);
  
  // Obtenir la luminosité en pourcentage (0-100)
  static uint8_t getBrightnessPercent();

private:
  static bool initialized;
  static int numLeds;
  static CRGB* leds;
  static uint8_t brightness;
  static SemaphoreHandle_t ledsMutex;  // Mutex pour protéger l'accès aux LEDs
};

#endif // LED_CONTROLLER_H
