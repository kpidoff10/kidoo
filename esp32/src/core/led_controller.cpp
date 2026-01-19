#include "led_controller.h"
#include "../config/config.h"
#include "../config/pins.h"

bool LEDController::initialized = false;
int LEDController::numLeds = NUM_LEDS_DEFINE;
CRGB* LEDController::leds = nullptr;
uint8_t LEDController::brightness = DEFAULT_BRIGHTNESS;
SemaphoreHandle_t LEDController::ledsMutex = nullptr;

bool LEDController::init() {
  if (initialized) {
    return true;
  }
  
  // Créer le mutex pour protéger l'accès aux LEDs
  ledsMutex = xSemaphoreCreateMutex();
  if (ledsMutex == nullptr) {
    Serial.println("[LED] ERREUR: Impossible de creer le mutex pour les LEDs");
    return false;
  }
  
  // Allouer le tableau de LEDs
  leds = new CRGB[numLeds];
  if (!leds) {
    Serial.println("[LED] ERREUR: Impossible d'allouer la memoire pour les LEDs");
    vSemaphoreDelete(ledsMutex);
    ledsMutex = nullptr;
    return false;
  }
  
  // Initialiser FastLED
  FastLED.addLeds<NEOPIXEL, LED_DATA_PIN>(leds, numLeds);
  FastLED.setBrightness(brightness);
  
  initialized = true;
  Serial.print("[LED] Controleur initialise avec ");
  Serial.print(numLeds);
  Serial.println(" LEDs");
  Serial.println("[LED] Mutex cree pour proteger l'acces aux LEDs");
  
  return true;
}

int LEDController::getNumLeds() {
  return numLeds;
}

CRGB* LEDController::getLeds() {
  return leds;
}

void LEDController::lock() {
  if (ledsMutex != nullptr) {
    xSemaphoreTake(ledsMutex, portMAX_DELAY);
  }
}

void LEDController::unlock() {
  if (ledsMutex != nullptr) {
    xSemaphoreGive(ledsMutex);
  }
}

void LEDController::show() {
  if (initialized) {
    FastLED.show();
  }
}

void LEDController::setBrightness(uint8_t newBrightness) {
  brightness = newBrightness;
  if (initialized) {
    FastLED.setBrightness(brightness);
    FastLED.show();
  }
}

uint8_t LEDController::getBrightness() {
  return brightness;
}

void LEDController::setBrightnessPercent(uint8_t percent) {
  // Convertir 0-100 en 0-255
  uint8_t newBrightness = map(percent, 0, 100, 0, 255);
  setBrightness(newBrightness);
}

uint8_t LEDController::getBrightnessPercent() {
  // Convertir 0-255 en 0-100
  return map(brightness, 0, 255, 0, 100);
}
