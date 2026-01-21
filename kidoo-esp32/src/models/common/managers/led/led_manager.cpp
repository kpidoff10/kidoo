#include "led_manager.h"
#include "../init/init_manager.h"
#include "../sd/sd_manager.h"
#include "../../../model_config.h"
#include "../../config/core_config.h"

#ifdef HAS_WIFI
#include "../wifi/wifi_manager.h"
#endif

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
  Serial.println("[LED] Debut init...");
  Serial.printf("[LED] LED_DATA_PIN=%d, NUM_LEDS=%d\n", LED_DATA_PIN, NUM_LEDS);
  
  if (initialized) {
    Serial.println("[LED] Deja initialise");
    return true;
  }
  
  // Récupérer la configuration globale
  const SDConfig& config = InitManager::getConfig();
  currentBrightness = config.led_brightness;
  sleepTimeoutMs = config.sleep_timeout_ms;
  lastActivityTime = millis();
  isSleeping = false;
  Serial.printf("[LED] Brightness=%d, SleepTimeout=%lu\n", currentBrightness, sleepTimeoutMs);
  
  // Allouer le tableau de LEDs (en PSRAM si disponible et configuré)
  Serial.println("[LED] Allocation memoire...");
  #if USE_PSRAM_FOR_LED_BUFFER
  if (psramFound()) {
    leds = (CRGB*)ps_malloc(NUM_LEDS * sizeof(CRGB));
    if (leds) {
      Serial.printf("[LED] Buffer alloue en PSRAM (%d bytes)\n", NUM_LEDS * sizeof(CRGB));
    }
  }
  #endif
  
  // Fallback sur heap classique si PSRAM non disponible ou désactivée
  if (!leds) {
    leds = new CRGB[NUM_LEDS];
  }
  
  if (!leds) {
    Serial.println("[LED] ERREUR: Allocation memoire echouee!");
    return false;
  }
  Serial.println("[LED] Memoire OK");
  
  // Initialiser FastLED
  Serial.println("[LED] Init FastLED...");
  FastLED.addLeds<LED_TYPE, LED_DATA_PIN>(leds, NUM_LEDS);
  FastLED.setBrightness(currentBrightness);
  FastLED.setDither(0);           // Désactiver le dithering pour éviter le scintillement
  FastLED.setMaxRefreshRate(0);   // Pas de limite de refresh rate
  FastLED.clearData();            // Nettoyer toutes les données LED
  FastLED.show();                 // Appliquer immédiatement
  Serial.println("[LED] FastLED OK");
  
  // Créer la queue de commandes
  Serial.println("[LED] Creation queue...");
  commandQueue = xQueueCreate(QUEUE_SIZE, sizeof(LEDCommand));
  if (commandQueue == nullptr) {
    Serial.println("[LED] ERREUR: Creation queue echouee!");
    delete[] leds;
    leds = nullptr;
    return false;
  }
  Serial.println("[LED] Queue OK");
  
  // Créer le thread de gestion des LEDs sur Core 1 (temps-réel)
  Serial.println("[LED] Creation task...");
  Serial.printf("[LED] Core=%d, Priority=%d, Stack=%d\n", TASK_CORE, TASK_PRIORITY, TASK_STACK_SIZE);
  BaseType_t result = xTaskCreatePinnedToCore(
    ledTask,
    "LEDTask",
    TASK_STACK_SIZE,
    nullptr,
    TASK_PRIORITY,
    &taskHandle,
    TASK_CORE  // Core 1 (configuré dans core_config.h)
  );
  
  if (result != pdPASS) {
    Serial.printf("[LED] ERREUR: Creation task echouee! Code=%d\n", result);
    vQueueDelete(commandQueue);
    commandQueue = nullptr;
    delete[] leds;
    leds = nullptr;
    return false;
  }
  Serial.println("[LED] Task OK");
  
  initialized = true;
  
  // Éteindre toutes les LEDs au démarrage
  clear();
  
  Serial.println("[LED] Init complete!");
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
    
    // Gérer l'animation de fade depuis sleep (réveil)
    if (isFadingFromSleep) {
      updateWakeFade();
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
    vTaskDelay(pdMS_TO_TICKS(10));
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
      // Réappliquer la couleur sur toutes les LEDs si pas d'effet actif
      if (currentEffect == LED_EFFECT_NONE) {
        fill_solid(leds, NUM_LEDS, currentColor);
      }
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
  bool wasSleeping = (isSleeping || isFadingToSleep);
  
  if (isSleeping || isFadingToSleep) {
    isSleeping = false;
    isFadingToSleep = false;
    
    // Démarrer un fade-in progressif pour le réveil
    isFadingFromSleep = true;
    sleepFadeStartTime = millis();
    
    // Restaurer l'effet s'il y en avait un
    if (savedEffect != LED_EFFECT_NONE) {
      currentEffect = savedEffect;
    } else {
      // Pas d'effet, réappliquer la couleur sur toutes les LEDs
      fill_solid(leds, NUM_LEDS, currentColor);
    }
  }
  // Réinitialiser le timer d'activité
  lastActivityTime = millis();
  
  // Si on sortait du mode sommeil, vérifier le WiFi et relancer le retry si nécessaire
  if (wasSleeping) {
    #ifdef HAS_WIFI
    if (!WiFiManager::isConnected() && !WiFiManager::isRetryThreadActive()) {
      // WiFi non connecté et pas de retry en cours, démarrer le retry
      Serial.println("[LED] Sortie du sleep mode - verification WiFi...");
      WiFiManager::startRetryThread();
    }
    #endif
  }
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
    
    // S'assurer que toutes les LEDs ont la couleur si pas d'effet
    if (currentEffect == LED_EFFECT_NONE) {
      fill_solid(leds, NUM_LEDS, currentColor);
    }
  } else {
    // Calculer le facteur de fade (0.0 -> 1.0)
    float fadeFactor = (float)elapsed / (float)SLEEP_FADE_DURATION_MS;
    
    // Simple: on remonte juste la luminosité globale
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
