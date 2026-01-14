#ifndef LED_EFFECTS_H
#define LED_EFFECTS_H

#include <Arduino.h>
#include <FastLED.h>

// Fonction pour mettre toutes les LEDs en rouge
void setRed(CRGB* leds, int numLeds);

// Fonction pour l'effet glossy multicolore
void setGlossy(CRGB* leds, int numLeds);

// Fonction pour l'effet rainbow (arc-en-ciel)
void setRainbow(CRGB* leds, int numLeds);

// Fonction pour l'effet pulse (pulsation)
void setPulse(CRGB* leds, int numLeds);

// Fonction pour mettre toutes les LEDs dans une couleur spécifique
void setColor(CRGB* leds, int numLeds, CRGB color);

// Fonction pour mettre toutes les LEDs dans une couleur HSV
void setColorHSV(CRGB* leds, int numLeds, uint8_t hue, uint8_t saturation, uint8_t value);

// Fonction pour l'effet cercle vert progressif (indique que le Kidoo est configuré)
void setGreenProgressCircle(CRGB* leds, int numLeds);

// Fonction pour l'effet orange pulsant (respiration) - indique le démarrage
void setOrangeBreathing(CRGB* leds, int numLeds);

// Fonction pour l'effet cercle orange progressif (indique le démarrage en cours)
void setOrangeProgressCircle(CRGB* leds, int numLeds);

// Fonction pour l'effet de transition avant le sommeil (fade out progressif)
void setSleepTransition(CRGB* leds, int numLeds);

// Fonction pour réinitialiser l'effet de transition (à appeler quand on entre dans le mode transition)
void resetSleepTransition();

#endif // LED_EFFECTS_H
