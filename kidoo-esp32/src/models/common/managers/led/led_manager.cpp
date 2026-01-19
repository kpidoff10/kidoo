#include "led_manager.h"
#include "../init/init_manager.h"
#include "../sd/sd_manager.h"
#include "../../../model_config.h"

// Variables statiques
bool LEDManager::initialized = false;
TaskHandle_t LEDManager::taskHandle = nullptr;
QueueHandle_t LEDManager::commandQueue = nullptr;
CRGB* LEDManager::leds = nullptr;
uint8_t LEDManager::currentBrightness = DEFAULT_LED_BRIGHTNESS;
LEDEffect LEDManager::currentEffect = LED_EFFECT_NONE;
CRGB LEDManager::currentColor = CRGB::Black;
unsigned long LEDManager::lastUpdateTime = 0;
unsigned long LEDManager::lastActivityTime = 0;
bool LEDManager::isSleeping = false;
bool LEDManager::isFadingToSleep = false;
bool LEDManager::isFadingFromSleep = false;
unsigned long LEDManager::sleepFadeStartTime = 0;
LEDEffect LEDManager::savedEffect = LED_EFFECT_NONE;
uint32_t LEDManager::sleepTimeoutMs = 0;
bool LEDManager::pulseNeedsReset = false;

bool LEDManager::init() {
  if (initialized) {
    return true;
  }
  
  // Récupérer la configuration globale
  const SDConfig& config = InitManager::getConfig();
  currentBrightness = config.led_brightness;
  sleepTimeoutMs = config.sleep_timeout_ms;
  lastActivityTime = millis();
  isSleeping = false;
  
  // Allouer le tableau de LEDs
  leds = new CRGB[NUM_LEDS];
  if (!leds) {
    return false;
  }
  
  // Initialiser FastLED
  FastLED.addLeds<LED_TYPE, LED_DATA_PIN>(leds, NUM_LEDS);
  FastLED.setBrightness(currentBrightness);
  
  // Créer la queue de commandes
  commandQueue = xQueueCreate(QUEUE_SIZE, sizeof(LEDCommand));
  if (commandQueue == nullptr) {
    delete[] leds;
    leds = nullptr;
    return false;
  }
  
  // Créer le thread de gestion des LEDs
  BaseType_t result = xTaskCreatePinnedToCore(
    ledTask,
    "LEDTask",
    TASK_STACK_SIZE,
    nullptr,
    TASK_PRIORITY,
    &taskHandle,
    1
  );
  
  if (result != pdPASS) {
    vQueueDelete(commandQueue);
    commandQueue = nullptr;
    delete[] leds;
    leds = nullptr;
    return false;
  }
  
  initialized = true;
  
  // Éteindre toutes les LEDs au démarrage
  clear();
  
  return true;
}

void LEDManager::stop() {
  if (!initialized) {
    return;
  }
  
  // Ne devrait jamais être appelé, mais au cas où...
  if (taskHandle != nullptr) {
    vTaskDelete(taskHandle);
    taskHandle = nullptr;
  }
  
  if (commandQueue != nullptr) {
    vQueueDelete(commandQueue);
    commandQueue = nullptr;
  }
  
  if (leds != nullptr) {
    delete[] leds;
    leds = nullptr;
  }
  
  initialized = false;
  Serial.println("[LED] Gestionnaire arrete (ne devrait pas arriver)");
}

bool LEDManager::sendCommand(const LEDCommand& cmd) {
  if (!initialized || commandQueue == nullptr) {
    return false;
  }
  
  // Envoyer la commande à la queue (non-bloquant)
  BaseType_t result = xQueueSend(commandQueue, &cmd, 0);
  return (result == pdTRUE);
}

bool LEDManager::setColor(uint8_t r, uint8_t g, uint8_t b) {
  LEDCommand cmd;
  cmd.type = LED_CMD_SET_COLOR;
  cmd.data.color.r = r;
  cmd.data.color.g = g;
  cmd.data.color.b = b;
  return sendCommand(cmd);
}

bool LEDManager::setBrightness(uint8_t brightness) {
  LEDCommand cmd;
  cmd.type = LED_CMD_SET_BRIGHTNESS;
  cmd.data.brightness = brightness;
  return sendCommand(cmd);
}

bool LEDManager::setEffect(LEDEffect effect) {
  LEDCommand cmd;
  cmd.type = LED_CMD_SET_EFFECT;
  cmd.data.effect = effect;
  return sendCommand(cmd);
}

bool LEDManager::clear() {
  LEDCommand cmd;
  cmd.type = LED_CMD_CLEAR;
  return sendCommand(cmd);
}

bool LEDManager::isInitialized() {
  return initialized;
}

uint8_t LEDManager::getCurrentBrightness() {
  return currentBrightness;
}

void LEDManager::ledTask(void* parameter) {
  // Ce thread tourne en continu et ne s'arrête jamais
  while (true) {
    // Traiter les commandes en attente
    LEDCommand cmd;
    while (xQueueReceive(commandQueue, &cmd, 0) == pdTRUE) {
      processCommand(cmd);
      // Réveiller les LEDs si une commande est reçue
      wakeUp();
    }
    
    // Vérifier le sleep mode
    checkSleepMode();
    
    // Gérer l'animation de fade vers sleep
    if (isFadingToSleep) {
      updateSleepFade();
    }
    
    // Mettre à jour les effets animés si nécessaire (seulement si pas en sleep et pas en fade)
    if (!isSleeping && !isFadingToSleep && !isFadingFromSleep) {
      unsigned long currentTime = millis();
      if (currentTime - lastUpdateTime >= UPDATE_INTERVAL_MS) {
        updateEffects();
        lastUpdateTime = currentTime;
      }
      // S'assurer que la luminosité maximale configurée est toujours respectée
      FastLED.setBrightness(currentBrightness);
    }
    
    // Appliquer les changements aux LEDs
    FastLED.show();
    
    // Petite pause pour éviter de surcharger le CPU
    vTaskDelay(pdMS_TO_TICKS(1));
  }
  
  // Ne devrait jamais arriver ici
  vTaskDelete(nullptr);
}

void LEDManager::processCommand(const LEDCommand& cmd) {
  switch (cmd.type) {
    case LED_CMD_SET_COLOR:
      currentColor = CRGB(cmd.data.color.r, cmd.data.color.g, cmd.data.color.b);
      currentEffect = LED_EFFECT_NONE;
      // Appliquer la couleur immédiatement
      fill_solid(leds, NUM_LEDS, currentColor);
      break;
      
    case LED_CMD_SET_BRIGHTNESS:
      currentBrightness = cmd.data.brightness;
      FastLED.setBrightness(currentBrightness);
      break;
      
    case LED_CMD_SET_EFFECT:
      currentEffect = cmd.data.effect;
      // Les effets seront gérés par updateEffects()
      break;
      
    case LED_CMD_CLEAR:
      currentColor = CRGB::Black;
      currentEffect = LED_EFFECT_NONE;
      fill_solid(leds, NUM_LEDS, CRGB::Black);
      break;
  }
  
  // Mettre à jour le temps d'activité
  lastActivityTime = millis();
}

void LEDManager::checkSleepMode() {
  // Si le sleep mode est désactivé (timeout = 0), ne rien faire
  if (sleepTimeoutMs == 0) {
    if (isSleeping || isFadingToSleep) {
      // Réveiller si on était en sleep ou en fade
      isSleeping = false;
      isFadingToSleep = false;
      FastLED.setBrightness(currentBrightness);
    }
    return;
  }
  
  unsigned long currentTime = millis();
  unsigned long timeSinceActivity = currentTime - lastActivityTime;
  
  // Vérifier si on doit entrer en sleep mode
  if (!isSleeping && !isFadingToSleep && timeSinceActivity >= sleepTimeoutMs) {
    // Démarrer l'animation de fade vers sleep
    isFadingToSleep = true;
    sleepFadeStartTime = currentTime;
    // Sauvegarder l'effet actuel pour le restaurer au réveil
    savedEffect = currentEffect;
  }
}

void LEDManager::updateSleepFade() {
  unsigned long currentTime = millis();
  unsigned long elapsed = currentTime - sleepFadeStartTime;
  
  if (elapsed >= SLEEP_FADE_DURATION_MS) {
    // Animation terminée, éteindre complètement
    isFadingToSleep = false;
    isSleeping = true;
    FastLED.setBrightness(0);
  } else {
    // Calculer le facteur de fade (1.0 -> 0.0)
    float fadeFactor = 1.0f - ((float)elapsed / (float)SLEEP_FADE_DURATION_MS);
    
    // Simple: on baisse juste la luminosité globale
    // Les couleurs actuelles des LEDs restent inchangées
    uint8_t fadedBrightness = (uint8_t)(currentBrightness * fadeFactor);
    FastLED.setBrightness(fadedBrightness);
  }
}

void LEDManager::wakeUp() {
  if (isSleeping || isFadingToSleep) {
    isSleeping = false;
    isFadingToSleep = false;
    
    // Si on avait un effet avant le sleep, démarrer un fade-in progressif
    if (savedEffect != LED_EFFECT_NONE) {
      isFadingFromSleep = true;
      sleepFadeStartTime = millis();
      // Restaurer l'effet pour qu'il reprenne après le fade-in
      currentEffect = savedEffect;
    } else {
      // Pas d'effet, restaurer directement
      FastLED.setBrightness(currentBrightness);
    }
  }
  // Réinitialiser le timer d'activité
  lastActivityTime = millis();
}

void LEDManager::updateWakeFade() {
  unsigned long currentTime = millis();
  unsigned long elapsed = currentTime - sleepFadeStartTime;
  
  if (elapsed >= SLEEP_FADE_DURATION_MS) {
    // Animation terminée, restaurer complètement
    isFadingFromSleep = false;
    
    // Si l'effet est PULSE, réinitialiser pour une transition fluide
    if (savedEffect == LED_EFFECT_PULSE) {
      resetPulseEffect();
      // Réinitialiser lastUpdateTime pour que l'effet reprenne immédiatement
      lastUpdateTime = millis();
    }
    
    // Restaurer la luminosité complète
    FastLED.setBrightness(currentBrightness);
  } else {
    // Calculer le facteur de fade (0.0 -> 1.0)
    float fadeFactor = (float)elapsed / (float)SLEEP_FADE_DURATION_MS;
    
    // Simple: on remonte juste la luminosité globale
    // Les couleurs actuelles des LEDs restent inchangées (effet en cours)
    uint8_t fadedBrightness = (uint8_t)(currentBrightness * fadeFactor);
    FastLED.setBrightness(fadedBrightness);
  }
}

bool LEDManager::getSleepState() {
  return isSleeping;
}

void LEDManager::resetPulseEffect() {
  // Marquer que l'effet PULSE doit être réinitialisé
  pulseNeedsReset = true;
}

void LEDManager::updateEffects() {
  static unsigned long effectTime = 0;
  unsigned long currentTime = millis();
  
  switch (currentEffect) {
    case LED_EFFECT_NONE:
      // Pas d'effet, couleur unie déjà appliquée
      break;
      
    case LED_EFFECT_RAINBOW: {
      // Effet arc-en-ciel qui défile
      static uint8_t hue = 0;
      for (int i = 0; i < NUM_LEDS; i++) {
        leds[i] = CHSV((hue + i * 2) % 256, 255, 255);
      }
      hue = (hue + 2) % 256;
      break;
    }
    
    case LED_EFFECT_PULSE: {
      // Effet de pulsation (respiration)
      static uint8_t pulseValue = 255;  // Commencer à 255 pour transition fluide après réveil
      static bool increasing = false;   // Commencer en descendant
      
      // Réinitialiser si nécessaire (après réveil depuis sleep)
      if (pulseNeedsReset) {
        pulseValue = 255;
        increasing = false;
        pulseNeedsReset = false;
      }
      
      if (increasing) {
        pulseValue += 2;
        if (pulseValue >= 255) {
          pulseValue = 255;
          increasing = false;
        }
      } else {
        pulseValue -= 2;
        if (pulseValue <= 50) {
          pulseValue = 50;
          increasing = true;
        }
      }
      
      CRGB pulseColor = currentColor;
      pulseColor.fadeToBlackBy(255 - pulseValue);
      fill_solid(leds, NUM_LEDS, pulseColor);
      break;
    }
    
    case LED_EFFECT_GLOSSY: {
      // Effet glossy multicolore
      static uint8_t offset = 0;
      for (int i = 0; i < NUM_LEDS; i++) {
        uint8_t hue = ((i * 256 / NUM_LEDS) + offset) % 256;
        leds[i] = CHSV(hue, 200, 255);
      }
      offset = (offset + 1) % 256;
      break;
    }
    
    case LED_EFFECT_ROTATE: {
      // Effet de rotation qui utilise la couleur définie (currentColor)
      static uint8_t position = 0;
      const uint8_t segmentSize = NUM_LEDS / 4; // Taille du segment (25% de la bande)
      
      // Éteindre toutes les LEDs
      fill_solid(leds, NUM_LEDS, CRGB::Black);
      
      // Allumer le segment avec la couleur définie qui tourne
      for (int i = 0; i < segmentSize; i++) {
        int ledIndex = (position + i) % NUM_LEDS;
        leds[ledIndex] = currentColor;
      }
      
      // Faire tourner le segment
      position = (position + 1) % NUM_LEDS;
      break;
    }
  }
}
