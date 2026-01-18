#include "led_effects.h"
#include "../core/led_controller.h"
#include <math.h>

#ifndef PI
#define PI 3.14159265358979323846
#endif

// Fonction pour mettre toutes les LEDs en rouge
void setRed(CRGB* leds, int numLeds) {
  LEDController::lock();
  for (int i = 0; i < numLeds; i++) {
    leds[i] = CRGB::Red;
  }
  LEDController::show();
  LEDController::unlock();
}

// Fonction pour mettre toutes les LEDs dans une couleur spécifique
void setColor(CRGB* leds, int numLeds, CRGB color) {
  LEDController::lock();
  for (int i = 0; i < numLeds; i++) {
    leds[i] = color;
  }
  LEDController::show();
  LEDController::unlock();
}

// Fonction pour mettre toutes les LEDs dans une couleur HSV
void setColorHSV(CRGB* leds, int numLeds, uint8_t hue, uint8_t saturation, uint8_t value) {
  LEDController::lock();
  for (int i = 0; i < numLeds; i++) {
    leds[i] = CHSV(hue, saturation, value);
  }
  LEDController::show();
  LEDController::unlock();
}

// Fonction pour l'effet glossy multicolore
void setGlossy(CRGB* leds, int numLeds) {
  static uint8_t hue = 0;      // Teinte de base (0-255 = cycle complet)
  static uint8_t offset = 0;   // Offset pour l'effet glossy
  
  LEDController::lock();
  for (int i = 0; i < numLeds; i++) {
    // Calculer la teinte avec un décalage pour créer un gradient
    uint8_t pixelHue = hue + (i * 2) + offset;
    
    // Créer un effet glossy en variant la saturation et la valeur
    uint8_t saturation = 255;  // Saturation maximale pour des couleurs vives
    uint8_t value = 255;       // Valeur maximale
    
    // Ajouter un effet de brillance glossy avec une variation sinusoïdale
    float glossyWave = sin((i + offset) * 0.1) * 0.3 + 0.7;  // Entre 0.4 et 1.0
    value = (uint8_t)(255 * glossyWave);
    
    // Convertir HSV en RGB
    leds[i] = CHSV(pixelHue, saturation, value);
  }
  
  LEDController::show();
  
  // Incrémenter pour faire défiler les couleurs (hors lock pour éviter de bloquer trop longtemps)
  hue += 1;      // Vitesse du cycle de couleurs
  offset += 2;   // Vitesse de l'effet glossy
  
  LEDController::unlock();
}

// Fonction pour l'effet rainbow (arc-en-ciel)
void setRainbow(CRGB* leds, int numLeds) {
  static uint8_t hue = 0;  // Teinte de base pour l'arc-en-ciel
  
  LEDController::lock();
  for (int i = 0; i < numLeds; i++) {
    // Créer un arc-en-ciel en distribuant les teintes sur toutes les LEDs
    uint8_t pixelHue = hue + (i * 256 / numLeds);
    leds[i] = CHSV(pixelHue, 255, 255);
  }
  
  LEDController::show();
  
  // Incrémenter la teinte pour faire défiler l'arc-en-ciel
  hue += 2;  // Vitesse du défilement de l'arc-en-ciel
  
  LEDController::unlock();
}

// Fonction pour l'effet pulse (pulsation)
void setPulse(CRGB* leds, int numLeds) {
  static uint8_t brightness = 0;
  static int8_t direction = 1;  // 1 pour augmenter, -1 pour diminuer
  
  // Calculer la luminosité avec un effet de pulsation
  brightness += direction * 3;  // Vitesse de la pulsation
  
  // Inverser la direction aux extrémités
  if (brightness >= 255) {
    brightness = 255;
    direction = -1;
  } else if (brightness <= 50) {
    brightness = 50;
    direction = 1;
  }
  
  LEDController::lock();
  // Appliquer la pulsation à toutes les LEDs avec une couleur bleue
  for (int i = 0; i < numLeds; i++) {
    leds[i] = CRGB(brightness / 3, brightness / 3, brightness);  // Bleu pulsant
  }
  
  LEDController::show();
  LEDController::unlock();
}

// Fonction pour l'effet cercle vert progressif (indique que le Kidoo est configuré)
// Crée un cercle vert qui tourne en continu
void setGreenProgressCircle(CRGB* leds, int numLeds) {
  static float position = 0.0f;  // Position de départ du cercle (0.0 à 1.0)
  
  // Incrémenter la position pour faire tourner le cercle
  position += 0.02f;  // Vitesse de rotation (ajustable)
  
  // Boucler la position entre 0 et 1 pour une rotation infinie
  if (position >= 1.0f) {
    position -= 1.0f;
  }
  
  // Taille du segment vert (25% du cercle)
  float segmentSize = 0.25f;
  int segmentLeds = (int)(segmentSize * numLeds);
  
  // Calculer la position de départ en nombre de LEDs
  int startLed = (int)(position * numLeds);
  
  LEDController::lock();
  // Éteindre toutes les LEDs d'abord
  for (int i = 0; i < numLeds; i++) {
    leds[i] = CRGB::Black;
  }
  
  // Allumer le segment vert qui tourne autour du cercle
  for (int i = 0; i < segmentLeds; i++) {
    int ledIndex = (startLed + i) % numLeds;  // Utiliser modulo pour boucler autour du cercle
    leds[ledIndex] = CRGB::Green;
  }
  
  LEDController::show();
  LEDController::unlock();
}

// Fonction pour l'effet orange pulsant (respiration) - indique le démarrage
void setOrangeBreathing(CRGB* leds, int numLeds) {
  static float progress = 0.0f;  // Progression de 0.0 à 1.0 (0% à 100%)
  static float speed = 0.015f;  // Vitesse de la respiration (ajustable)
  
  // Incrémenter la progression de manière fluide
  progress += speed;
  
  // Boucler de 0 à 1 puis revenir à 0 (cycle complet)
  if (progress >= 1.0f) {
    progress = 1.0f;
    speed = -speed;  // Inverser la direction
  } else if (progress <= 0.0f) {
    progress = 0.0f;
    speed = -speed;  // Inverser la direction
  }
  
  // Calculer la luminosité de manière fluide (0 à 255)
  // Utiliser une courbe sinusoïdale pour un effet plus naturel
  float sineValue = sin(progress * PI);  // sin(0) = 0, sin(PI/2) = 1, sin(PI) = 0
  uint8_t brightness = (uint8_t)(sineValue * 255.0f);
  
  LEDController::lock();
  // Appliquer la respiration à toutes les LEDs avec une couleur orange
  // Orange = Rouge + Vert (sans bleu)
  // Ajuster les proportions pour un bel orange
  for (int i = 0; i < numLeds; i++) {
    leds[i] = CRGB(brightness, brightness * 0.4, 0);  // Orange pulsant fluide
  }
  
  LEDController::show();
  LEDController::unlock();
}

// Fonction pour l'effet cercle orange progressif (indique le démarrage en cours)
// Crée un cercle orange qui tourne en continu, similaire au cercle vert
void setOrangeProgressCircle(CRGB* leds, int numLeds) {
  static float position = 0.0f;  // Position de départ du cercle (0.0 à 1.0)
  
  // Incrémenter la position pour faire tourner le cercle
  position += 0.02f;  // Vitesse de rotation (ajustable)
  
  // Boucler la position entre 0 et 1 pour une rotation infinie
  if (position >= 1.0f) {
    position -= 1.0f;
  }
  
  // Taille du segment orange (25% du cercle)
  float segmentSize = 0.25f;
  int segmentLeds = (int)(segmentSize * numLeds);
  
  // Calculer la position de départ en nombre de LEDs
  int startLed = (int)(position * numLeds);
  
  LEDController::lock();
  // Éteindre toutes les LEDs d'abord
  for (int i = 0; i < numLeds; i++) {
    leds[i] = CRGB::Black;
  }
  
  // Allumer le segment orange qui tourne autour du cercle
  // Orange = Rouge + Vert (sans bleu), proportions: R=255, G=102, B=0
  for (int i = 0; i < segmentLeds; i++) {
    int ledIndex = (startLed + i) % numLeds;  // Utiliser modulo pour boucler autour du cercle
    leds[ledIndex] = CRGB(255, 102, 0);  // Orange vif
  }
  
  LEDController::show();
  LEDController::unlock();
}

// Variable statique globale pour réinitialiser l'effet de transition
static bool sleepTransitionNeedsReset = false;

// Fonction pour l'effet de transition avant le sommeil (fade out progressif)
// Crée un effet de fondu progressif qui s'assombrit jusqu'à s'éteindre
void setSleepTransition(CRGB* leds, int numLeds) {
  static float fadeProgress = 0.0f;  // Progression du fondu (0.0 = normal, 1.0 = éteint)
  static unsigned long lastUpdate = 0;
  const unsigned long UPDATE_INTERVAL = 50;  // Mettre à jour toutes les 50ms
  
  // Réinitialiser si nécessaire (première fois ou après reset)
  if (sleepTransitionNeedsReset) {
    fadeProgress = 0.0f;
    lastUpdate = millis();
    sleepTransitionNeedsReset = false;
  }
  
  unsigned long currentTime = millis();
  
  // Mettre à jour la progression seulement si assez de temps s'est écoulé
  if (currentTime - lastUpdate >= UPDATE_INTERVAL) {
    fadeProgress += 0.02f;  // Vitesse du fondu (ajustable)
    
    // Limiter entre 0 et 1
    if (fadeProgress > 1.0f) {
      fadeProgress = 1.0f;
    }
    
    lastUpdate = currentTime;
  }
  
  // Obtenir la luminosité configurée actuelle (0-255)
  uint8_t configuredBrightness = LEDController::getBrightness();
  
  // Calculer la luminosité basée sur la progression (de la luminosité configurée à 0)
  // La transition part de la luminosité configurée et descend jusqu'à 0
  uint8_t brightness = (uint8_t)(configuredBrightness * (1.0f - fadeProgress));
  
  LEDController::lock();
  // Appliquer un fondu progressif à toutes les LEDs
  // Utiliser une couleur douce (blanc chaud) qui s'assombrit
  for (int i = 0; i < numLeds; i++) {
    // Blanc chaud qui s'assombrit progressivement
    uint8_t r = brightness;
    uint8_t g = (uint8_t)(brightness * 0.9f);  // Légèrement plus chaud
    uint8_t b = (uint8_t)(brightness * 0.7f);   // Encore plus chaud
    leds[i] = CRGB(r, g, b);
  }
  
  LEDController::show();
  LEDController::unlock();
}

// Fonction pour réinitialiser l'effet de transition
void resetSleepTransition() {
  sleepTransitionNeedsReset = true;
}
