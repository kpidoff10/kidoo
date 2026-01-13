#ifndef LED_CONTROLLER_H
#define LED_CONTROLLER_H

#include <Arduino.h>
#include <FastLED.h>
#include "../config/config.h"

class LEDController {
public:
  // Initialiser le contrôleur LED
  static bool init();
  
  // Obtenir le nombre de LEDs
  static int getNumLeds();
  
  // Obtenir le tableau de LEDs (pour les effets)
  static CRGB* getLeds();
  
  // Appliquer les changements (appeler FastLED.show())
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
};

#endif // LED_CONTROLLER_H
