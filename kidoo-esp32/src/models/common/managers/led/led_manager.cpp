#include "led_manager.h"
#include "../init/init_manager.h"
#include "../sd/sd_manager.h"
#include "../../../model_config.h"
#include "../../config/core_config.h"

#ifdef HAS_WIFI
#include "../wifi/wifi_manager.h"
#endif

#ifdef HAS_BLE
#include "../ble_config/ble_config_manager.h"
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
  // IMPORTANT: On limite les appels à FastLED.show() pour ne pas interférer avec l'audio I2S
  // FastLED.show() désactive brièvement les interruptions, ce qui peut causer des grésillements
  
  static unsigned long lastShowTime = 0;
  static bool needsUpdate = true;  // Flag pour savoir si on doit appeler FastLED.show()
  
  // Intervalle minimum entre deux FastLED.show() (en ms)
  // 33ms = ~30 FPS, suffisant pour les animations et évite les conflits avec I2S
  const unsigned long SHOW_INTERVAL_MS = 33;
  
  while (true) {
    // Traiter les commandes en attente
    LEDCommand cmd;
    while (xQueueReceive(commandQueue, &cmd, 0) == pdTRUE) {
      processCommand(cmd);
      // Réveiller les LEDs si une commande est reçue
      wakeUp();
      needsUpdate = true;
    }
    
    // Vérifier le sleep mode
    checkSleepMode();
    
    // Gérer l'animation de fade vers sleep
    if (isFadingToSleep) {
      updateSleepFade();
      needsUpdate = true;
    }
    
    // Gérer l'animation de fade depuis sleep (réveil)
    if (isFadingFromSleep) {
      updateWakeFade();
      needsUpdate = true;
    }
    
    // Mettre à jour les effets animés si nécessaire
    // Permettre les effets même pendant le fade-in (mais pas pendant le fade-out)
    if (!isSleeping && !isFadingToSleep) {
      unsigned long currentTime = millis();
      if (currentTime - lastUpdateTime >= UPDATE_INTERVAL_MS) {
        // Pendant le fade-in, on permet les effets pour qu'ils s'appliquent progressivement
        // Mais on s'assure que les LEDs sont bien éteintes au début
        if (isFadingFromSleep && (currentTime - sleepFadeStartTime) < 50) {
          // Au tout début du fade-in, éteindre les LEDs pour éviter le flash
          fill_solid(leds, NUM_LEDS, CRGB::Black);
        } else {
          // Appliquer les effets normalement
          updateEffects();
        }
        lastUpdateTime = currentTime;
        needsUpdate = true;
      }
      // S'assurer que la luminosité maximale configurée est toujours respectée
      // (sauf pendant le fade-in où on utilise la luminosité fade)
      if (!isFadingFromSleep) {
        FastLED.setBrightness(currentBrightness);
      }
    }
    
    // Appliquer les changements aux LEDs SEULEMENT si nécessaire et pas trop souvent
    // Cela évite de bloquer les interruptions I2S trop fréquemment
    unsigned long currentTime = millis();
    if (needsUpdate && (currentTime - lastShowTime >= SHOW_INTERVAL_MS)) {
      // IMPORTANT: S'assurer que si on a clear() ou si l'effet est NONE avec couleur noire,
      // on éteint vraiment toutes les LEDs
      if (currentEffect == LED_EFFECT_NONE && currentColor == CRGB::Black) {
        // S'assurer que toutes les LEDs sont bien éteintes
        fill_solid(leds, NUM_LEDS, CRGB::Black);
        FastLED.setBrightness(0);
      }
      FastLED.show();
      lastShowTime = currentTime;
      needsUpdate = false;
    }
    
    // Pause plus longue pour laisser de la bande passante à l'audio
    vTaskDelay(pdMS_TO_TICKS(5));
  }
  
  // Ne devrait jamais arriver ici
  vTaskDelete(nullptr);
}

void LEDManager::processCommand(const LEDCommand& cmd) {
  switch (cmd.type) {
    case LED_CMD_SET_COLOR:
      // Si on change de couleur et qu'on a un effet actif, éteindre d'abord
      // Cela évite le flash de la couleur précédente
      if (currentEffect != LED_EFFECT_NONE) {
        // Éteindre toutes les LEDs avant de changer de couleur
        fill_solid(leds, NUM_LEDS, CRGB::Black);
      }
      currentColor = CRGB(cmd.data.color.r, cmd.data.color.g, cmd.data.color.b);
      // Si on change de couleur et qu'on n'a pas d'effet actif, appliquer immédiatement
      // Si on a un effet, la couleur sera appliquée par l'effet
      if (currentEffect == LED_EFFECT_NONE) {
        // Appliquer la couleur immédiatement
        fill_solid(leds, NUM_LEDS, currentColor);
      }
      // Ne pas réinitialiser l'effet ici, il sera géré par SET_EFFECT
      // L'effet reste actif, seule la couleur change
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
      // Si on change d'effet, éteindre d'abord pour transition propre
      // Cela évite le flash de la couleur/effet précédent
      if (currentEffect != cmd.data.effect) {
        // Éteindre toutes les LEDs avant de changer d'effet
        fill_solid(leds, NUM_LEDS, CRGB::Black);
      }
      currentEffect = cmd.data.effect;
      // Si on change vers PULSE, réinitialiser l'effet pour éviter le flash
      if (currentEffect == LED_EFFECT_PULSE) {
        resetPulseEffect();
      }
      // Les effets seront gérés par updateEffects()
      break;
      
    case LED_CMD_CLEAR:
      currentColor = CRGB::Black;
      currentEffect = LED_EFFECT_NONE;
      // IMPORTANT: Éteindre complètement toutes les LEDs
      // S'assurer que toutes les LEDs sont bien à CRGB::Black
      fill_solid(leds, NUM_LEDS, CRGB::Black);
      // S'assurer que la luminosité est à 0 pour éteindre complètement
      FastLED.setBrightness(0);
      // La mise à jour sera faite par FastLED.show() dans la boucle principale
      // avec needsUpdate = true qui a été défini lors de la réception de la commande
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
  
  // IMPORTANT: Ne pas entrer en sleep mode si le BLE est actif (mode appairage)
  // Les LEDs doivent rester allumées pour indiquer le mode appairage
  #ifdef HAS_BLE
  if (BLEConfigManager::isBLEEnabled()) {
    // BLE actif, réveiller si on était en sleep
    if (isSleeping || isFadingToSleep) {
      isSleeping = false;
      isFadingToSleep = false;
      FastLED.setBrightness(currentBrightness);
      // Restaurer l'effet si nécessaire
      if (savedEffect != LED_EFFECT_NONE) {
        currentEffect = savedEffect;
        savedEffect = LED_EFFECT_NONE;
      }
    }
    // Réinitialiser le timer d'activité pour éviter le sleep
    lastActivityTime = millis();
    return;
  }
  #endif
  
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
    // IMPORTANT: Clear les LEDs quand on atteint 0 luminosité (mode sleep)
    // Cela évite le flash de la couleur précédente quand on réactive
    fill_solid(leds, NUM_LEDS, CRGB::Black);
  } else {
    // Calculer le facteur de fade (1.0 -> 0.0)
    float fadeFactor = 1.0f - ((float)elapsed / (float)SLEEP_FADE_DURATION_MS);
    
    // Simple: on baisse juste la luminosité globale
    // Les couleurs actuelles des LEDs restent inchangées
    uint8_t fadedBrightness = (uint8_t)(currentBrightness * fadeFactor);
    FastLED.setBrightness(fadedBrightness);
    
    // Si la luminosité atteint 0 (ou presque), clear les LEDs
    if (fadedBrightness == 0) {
      fill_solid(leds, NUM_LEDS, CRGB::Black);
    }
  }
}

void LEDManager::wakeUp() {
  bool wasSleeping = (isSleeping || isFadingToSleep);
  
  if (isSleeping || isFadingToSleep) {
    isSleeping = false;
    isFadingToSleep = false;
    
    // IMPORTANT: Éteindre d'abord les LEDs pour éviter le flash de l'animation précédente
    // Les LEDs peuvent encore contenir l'ancienne couleur/effet
    fill_solid(leds, NUM_LEDS, CRGB::Black);
    
    // Démarrer un fade-in progressif pour le réveil
    isFadingFromSleep = true;
    sleepFadeStartTime = millis();
    
    // Restaurer l'effet s'il y en avait un
    if (savedEffect != LED_EFFECT_NONE) {
      currentEffect = savedEffect;
      // Si on restaure PULSE, réinitialiser l'effet
      if (currentEffect == LED_EFFECT_PULSE) {
        resetPulseEffect();
      }
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
    
    // IMPORTANT: S'assurer que les LEDs sont bien éteintes avant de restaurer l'effet
    // Cela évite le flash de l'animation précédente
    fill_solid(leds, NUM_LEDS, CRGB::Black);
    
    // Si l'effet est PULSE, réinitialiser pour une transition fluide
    if (currentEffect == LED_EFFECT_PULSE) {
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
    
    // IMPORTANT: Pendant le fade-in, s'assurer que les LEDs sont bien éteintes au début
    // et appliquer la nouvelle couleur/effet progressivement
    if (fadedBrightness == 0 || elapsed < 50) {
      // Au tout début du fade-in, s'assurer que les LEDs sont bien éteintes
      fill_solid(leds, NUM_LEDS, CRGB::Black);
    } else {
      // Pendant le fade-in, appliquer la couleur/effet
      // Si on a un effet, il sera géré par updateEffects() dans la boucle principale
      // Mais on doit s'assurer que la couleur de base est correcte
      if (currentEffect == LED_EFFECT_NONE) {
        fill_solid(leds, NUM_LEDS, currentColor);
      }
      // Si on a un effet, updateEffects() s'en chargera dans la boucle principale
      // Mais on doit permettre à updateEffects() de s'exécuter même pendant le fade-in
    }
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
      // Effet de pulsation (respiration) rapide et fluide
      // Utiliser le temps réel pour une vitesse constante et fluide
      static unsigned long pulseStartTime = 0;
      
      // Réinitialiser si nécessaire (après réveil depuis sleep)
      if (pulseNeedsReset) {
        pulseStartTime = currentTime;
        pulseNeedsReset = false;
      }
      
      // Cycle de respiration : ~2.5 secondes pour un cycle complet (inspiration + expiration)
      const uint32_t PULSE_CYCLE_MS = 2500;  // 2.5 secondes
      uint32_t elapsed = (currentTime - pulseStartTime) % PULSE_CYCLE_MS;
      
      // Calculer la phase normalisée (0 à 1023 pour précision)
      uint16_t phase = (elapsed * 1024) / PULSE_CYCLE_MS;
      
      // Calculer la valeur de pulsation avec une courbe sinusoïdale douce
      // Utiliser une approximation de sin pour fluidité maximale
      // Phase 0-511 : montée (inspiration), Phase 512-1023 : descente (expiration)
      // Minimum réduit de 50 à 30 pour un effet plus sombre en bas (~12% de luminosité)
      const uint8_t PULSE_MIN = 30;  // Minimum de luminosité (réduit de 50 à 30)
      const uint8_t PULSE_MAX = 255;  // Maximum de luminosité
      const uint8_t PULSE_RANGE = PULSE_MAX - PULSE_MIN;  // 225
      
      uint8_t pulseValue;
      if (phase < 512) {
        // Montée (inspiration) : de PULSE_MIN à PULSE_MAX
        // Courbe douce : utiliser phase² pour accélération progressive
        uint16_t normalizedPhase = phase;  // 0-511
        // Appliquer une courbe douce (quadratique) pour fluidité
        uint16_t smoothPhase = (normalizedPhase * normalizedPhase) / 512;
        pulseValue = PULSE_MIN + ((smoothPhase * PULSE_RANGE) / 512);
      } else {
        // Descente (expiration) : de PULSE_MAX à PULSE_MIN
        uint16_t phaseDown = phase - 512;  // 0-511
        // Courbe douce inverse
        uint16_t smoothPhase = 511 - phaseDown;
        smoothPhase = (smoothPhase * smoothPhase) / 512;
        pulseValue = PULSE_MIN + ((smoothPhase * PULSE_RANGE) / 512);
      }
      
      // Appliquer la pulsation à la couleur
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
      // Effet de rotation type "serpent" avec début (tête) et fin (queue) progressifs
      // Utiliser le temps réel pour une rotation constante et fluide
      static unsigned long rotateStartTime = 0;
      
      // Initialiser le temps de départ si nécessaire
      if (rotateStartTime == 0) {
        rotateStartTime = currentTime;
      }
      
      // Cycle de rotation : ~4 secondes pour un tour complet, peu importe le nombre de LEDs
      const uint32_t ROTATE_CYCLE_MS = 4000;  // 4 secondes
      uint32_t elapsed = (currentTime - rotateStartTime) % ROTATE_CYCLE_MS;
      
      // Calculer la position de la tête du serpent avec précision fractionnaire
      // Utiliser une précision élevée (256x) pour fluidité maximale
      uint32_t headPositionPrecise = (elapsed * NUM_LEDS * 256) / ROTATE_CYCLE_MS;
      uint16_t headPosition = (headPositionPrecise >> 8) % NUM_LEDS;  // Position de la tête (LED principale)
      uint8_t headSubPosition = headPositionPrecise & 0xFF;  // Position fractionnaire (0-255)
      
      // Longueur du serpent (nombre de LEDs)
      const uint8_t snakeLength = NUM_LEDS / 4;  // 25% de la bande
      
      // Éteindre toutes les LEDs
      fill_solid(leds, NUM_LEDS, CRGB::Black);
      
      // Dessiner le serpent progressif avec position fractionnaire pour mouvement ultra-fluide
      // Le serpent s'étend de (headPosition - snakeLength) à headPosition
      // Utiliser la position fractionnaire pour créer un dégradé qui se déplace progressivement
      
      // Parcourir toutes les LEDs pour créer un dégradé fluide
      for (int ledIndex = 0; ledIndex < NUM_LEDS; ledIndex++) {
        // Calculer la position précise de cette LED (en unités fractionnaires)
        // Utiliser le centre de la LED pour plus de précision et fluidité
        // +128 pour centrer, cela donne une transition plus douce entre LEDs
        int32_t ledPositionPrecise = ((int32_t)ledIndex * 256) + 128;  // Centre de la LED
        
        // Calculer la distance depuis la tête (en tenant compte du wrap-around)
        int32_t distanceToHead = headPositionPrecise - ledPositionPrecise;
        
        // Gérer le wrap-around (distance la plus courte)
        if (distanceToHead > (NUM_LEDS * 256) / 2) {
          distanceToHead -= (NUM_LEDS * 256);
        } else if (distanceToHead < -(NUM_LEDS * 256) / 2) {
          distanceToHead += (NUM_LEDS * 256);
        }
        
        // Convertir en valeur absolue et vérifier si cette LED fait partie du serpent
        int32_t absDistance = (distanceToHead < 0) ? -distanceToHead : distanceToHead;
        int32_t maxSnakeDistance = snakeLength * 256;
        
        // Si la LED est en dehors du serpent, elle est éteinte
        if (absDistance > maxSnakeDistance) {
          leds[ledIndex] = CRGB::Black;
          continue;
        }
        
        // Calculer l'intensité avec dégradé progressif de la queue vers la tête
        // Utiliser une courbe sinusoïdale pour fluidité maximale (transition ultra-douce)
        uint8_t intensity;
        if (absDistance == 0) {
          // Tête : luminosité maximale (255)
          intensity = 255;
        } else {
          // Queue vers tête : dégradé progressif avec courbe sinusoïdale
          // Utiliser la distance inverse : proche de la tête = plus élevé
          uint32_t fadeFactor = maxSnakeDistance - absDistance;
          
          // Normaliser sur 0-256 pour calcul sinusoïdal
          uint32_t normalizedFade = (fadeFactor * 256) / maxSnakeDistance;  // 0-256
          
          // Courbe sinusoïdale pour transition ultra-fluide et naturelle
          // sin(π/2 * x) où x va de 0 à 1, donne une courbe très douce
          // Approximation : utiliser une table de lookup ou calcul polynomial
          // Pour x de 0 à 256, on veut sin(π/2 * x/256)
          // Approximation polynomiale de sin : sin(x) ≈ x - x³/6 + x⁵/120 (pour x petit)
          // Mais on utilise une approximation plus simple et efficace
          
          // Convertir en angle (0 à 90 degrés, soit 0 à π/2)
          // Utiliser une approximation sinusoïdale avec interpolation quadratique
          // Pour fluidité maximale : courbe qui monte très doucement
          
          // Méthode : utiliser une courbe qui combine plusieurs techniques
          // 1. Normalisation douce
          uint32_t x = normalizedFade;  // 0-256
          
          // 2. Courbe sinusoïdale approximée : sin(π/2 * x/256)
          // Approximation : pour x de 0 à 256, on utilise une interpolation
          // Formule simplifiée : utilise une courbe qui ressemble à sin mais plus rapide à calculer
          // On utilise une combinaison de courbes pour fluidité maximale
          
          // Courbe sinusoïdale optimisée pour fluidité maximale
          // Approximation efficace : combinaison de courbes pour transition ultra-douce
          uint32_t sinFade;
          
          // Calculer les composantes de la courbe
          uint32_t x2 = (x * x) / 256;        // x²/256 : courbe douce
          uint32_t x3 = (x2 * x) / 256;      // x³/256² : transition progressive
          
          // Combinaison optimisée : 80% courbe douce, 20% transition
          // Cela donne une montée très douce au début, transition fluide ensuite
          // Formule : 0.8 * x² + 0.2 * x³ pour fluidité maximale
          sinFade = (x2 * 4 + x3) / 5;
          
          // S'assurer que la valeur reste dans les limites
          if (sinFade > 256) sinFade = 256;
          
          // Intensité de 30 (queue) à 255 (tête) avec courbe sinusoïdale
          intensity = 30 + ((sinFade * 225) / 256);
        }
        
        // Appliquer la couleur avec l'intensité calculée
        CRGB snakeColor = currentColor;
        snakeColor.fadeToBlackBy(255 - intensity);
        leds[ledIndex] = snakeColor;
      }
      break;
    }
  }
}
