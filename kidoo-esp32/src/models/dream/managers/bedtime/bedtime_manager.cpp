#include "bedtime_manager.h"
#include <ArduinoJson.h>
#include <limits.h>  // Pour ULONG_MAX

// Variables statiques
bool BedtimeManager::initialized = false;
BedtimeConfig BedtimeManager::config;
bool BedtimeManager::bedtimeActive = false;
bool BedtimeManager::manuallyStarted = false;
unsigned long BedtimeManager::bedtimeStartTime = 0;
unsigned long BedtimeManager::lastCheckTime = 0;
uint8_t BedtimeManager::lastTriggeredHour = 255;  // 255 = jamais déclenché
uint8_t BedtimeManager::lastTriggeredMinute = 255;
bool BedtimeManager::fadeInActive = false;
bool BedtimeManager::fadeOutActive = false;
unsigned long BedtimeManager::fadeStartTime = 0;

// Constantes
static const unsigned long FADE_IN_DURATION_MS = 30000;      // 30 secondes
static const unsigned long FADE_OUT_DURATION_MS = 300000;    // 5 minutes
static const unsigned long BEDTIME_DURATION_MS = 1800000;     // 30 minutes avant fade-out
static const unsigned long CHECK_INTERVAL_MS = 60000;        // Vérifier toutes les minutes

bool BedtimeManager::init() {
  if (initialized) {
    return true;
  }
  
  Serial.println("[BEDTIME] Initialisation du gestionnaire bedtime...");
  
  // Vérifier que le RTC est disponible
  if (!RTCManager::isAvailable()) {
    Serial.println("[BEDTIME] ERREUR: RTC non disponible");
    return false;
  }
  
  // Charger la configuration depuis la SD
  if (!loadConfig()) {
    Serial.println("[BEDTIME] ERREUR: Impossible de charger la configuration");
    return false;
  }
  
  initialized = true;
  Serial.println("[BEDTIME] Gestionnaire initialise");
  
  return true;
}

bool BedtimeManager::loadConfig() {
  // Charger la configuration depuis la SD
  SDConfig sdConfig = SDManager::getConfig();
  
  // Copier les paramètres généraux
  config.colorR = sdConfig.bedtime_colorR;
  config.colorG = sdConfig.bedtime_colorG;
  config.colorB = sdConfig.bedtime_colorB;
  config.brightness = sdConfig.bedtime_brightness;
  config.allNight = sdConfig.bedtime_allNight;
  
  // Copier l'effet (ou "none" si vide)
  if (strlen(sdConfig.bedtime_effect) > 0) {
    strncpy(config.effect, sdConfig.bedtime_effect, sizeof(config.effect) - 1);
    config.effect[sizeof(config.effect) - 1] = '\0';
  } else {
    strcpy(config.effect, "none");
  }
  
  // Initialiser tous les schedules à désactivés par défaut
  for (int i = 0; i < 7; i++) {
    config.schedules[i].hour = 20;
    config.schedules[i].minute = 0;
    config.schedules[i].activated = false;
  }
  
  // Parser le weekdaySchedule JSON
  if (strlen(sdConfig.bedtime_weekdaySchedule) > 0) {
    parseWeekdaySchedule(sdConfig.bedtime_weekdaySchedule);
  }
  
  Serial.println("[BEDTIME] Configuration chargee depuis la SD");
  Serial.printf("[BEDTIME] Couleur RGB(%d, %d, %d), Brightness: %d%%, AllNight: %s, Effect: %s\n",
                config.colorR, config.colorG, config.colorB, config.brightness,
                config.allNight ? "true" : "false", config.effect);
  
  return true;
}

bool BedtimeManager::reloadConfig() {
  Serial.println("[BEDTIME] Rechargement de la configuration...");
  
  // Réinitialiser les flags de déclenchement pour permettre un nouveau déclenchement
  lastTriggeredHour = 255;
  lastTriggeredMinute = 255;
  
  bool result = loadConfig();
  
  // Vérifier immédiatement si c'est l'heure de déclencher le bedtime
  if (result && initialized && RTCManager::isAvailable()) {
    checkNow();
  }
  
  return result;
}

void BedtimeManager::checkNow() {
  if (!initialized || !RTCManager::isAvailable()) {
    return;
  }
  
  Serial.println("[BEDTIME] Vérification immédiate après mise à jour de la configuration");
  
  // Vérifier immédiatement si c'est l'heure de déclencher le bedtime
  checkBedtimeTrigger();
}

void BedtimeManager::parseWeekdaySchedule(const char* jsonStr) {
  if (!jsonStr || strlen(jsonStr) == 0) {
    return;
  }
  
  // Parser le JSON
  #pragma GCC diagnostic push
  #pragma GCC diagnostic ignored "-Wdeprecated-declarations"
  StaticJsonDocument<512> doc;
  #pragma GCC diagnostic pop
  
  DeserializationError error = deserializeJson(doc, jsonStr);
  if (error) {
    Serial.print("[BEDTIME] Erreur parsing weekdaySchedule: ");
    Serial.println(error.c_str());
    return;
  }
  
  // Mapping des jours de la semaine
  const char* weekdays[] = {"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"};
  
  // Parser chaque jour
  for (int i = 0; i < 7; i++) {
    if (doc[weekdays[i]].is<JsonObject>()) {
      JsonObject daySchedule = doc[weekdays[i]].as<JsonObject>();
      
      if (daySchedule["hour"].is<int>()) {
        config.schedules[i].hour = daySchedule["hour"].as<int>();
      }
      if (daySchedule["minute"].is<int>()) {
        config.schedules[i].minute = daySchedule["minute"].as<int>();
      }
      if (daySchedule["activated"].is<bool>()) {
        config.schedules[i].activated = daySchedule["activated"].as<bool>();
      } else {
        // Si activated n'est pas présent, considérer comme activé si hour/minute sont présents
        config.schedules[i].activated = daySchedule["hour"].is<int>() && daySchedule["minute"].is<int>();
      }
      
      if (config.schedules[i].activated) {
        Serial.printf("[BEDTIME] %s: %02d:%02d (active)\n", weekdays[i], 
                      config.schedules[i].hour, config.schedules[i].minute);
      }
    }
  }
}

uint8_t BedtimeManager::weekdayToIndex(uint8_t dayOfWeek) {
  // RTC dayOfWeek: 1=Lundi, 7=Dimanche
  // Notre index: 0=Lundi, 6=Dimanche
  if (dayOfWeek >= 1 && dayOfWeek <= 7) {
    return dayOfWeek - 1;
  }
  return 0; // Par défaut, lundi
}

const char* BedtimeManager::indexToWeekday(uint8_t index) {
  const char* weekdays[] = {"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"};
  if (index < 7) {
    return weekdays[index];
  }
  return weekdays[0];
}

void BedtimeManager::update() {
  if (!initialized) {
    return;
  }
  
  if (!RTCManager::isAvailable()) {
    // Log seulement toutes les 5 minutes pour éviter le spam
    static unsigned long lastRtcErrorLog = 0;
    unsigned long currentTime = millis();
    if (currentTime - lastRtcErrorLog >= 300000) { // 5 minutes
      Serial.println("[BEDTIME] ERREUR: RTC non disponible, impossible de vérifier l'heure");
      lastRtcErrorLog = currentTime;
    }
    return;
  }
  
  unsigned long currentTime = millis();
  
  // Vérifier périodiquement (toutes les minutes)
  if (currentTime - lastCheckTime >= CHECK_INTERVAL_MS) {
    lastCheckTime = currentTime;
    checkBedtimeTrigger();
  }
  
  // Mettre à jour les animations de fade si actives
  if (fadeInActive) {
    updateFadeIn();
  }
  
  // Vérifier si on doit démarrer le fade-out (30 minutes après le début si allNight = false)
  if (bedtimeActive && !config.allNight && !fadeInActive && !fadeOutActive) {
    unsigned long elapsedSinceStart;
    
    // Gérer le wrap-around de millis() (se produit après ~49 jours)
    if (currentTime >= bedtimeStartTime) {
      elapsedSinceStart = currentTime - bedtimeStartTime;
    } else {
      // Wrap-around détecté
      elapsedSinceStart = (ULONG_MAX - bedtimeStartTime) + currentTime;
    }
    
    if (elapsedSinceStart >= BEDTIME_DURATION_MS) {
      // Démarrer le fade-out après 30 minutes
      fadeOutActive = true;
      fadeStartTime = currentTime;
      Serial.println("[BEDTIME] 30 minutes écoulées, démarrage du fade-out (5 minutes de fade-out)");
    }
  }
  
  if (fadeOutActive) {
    updateFadeOut();
  }
}

void BedtimeManager::checkBedtimeTrigger() {
  DateTime now = RTCManager::getDateTime();
  uint8_t dayIndex = weekdayToIndex(now.dayOfWeek);
  
  // Log de débogage pour chaque vérification
  Serial.printf("[BEDTIME] Vérification: Heure actuelle %02d:%02d:%02d, Jour de la semaine: %d (index: %d)\n",
                now.hour, now.minute, now.second, now.dayOfWeek, dayIndex);
  Serial.printf("[BEDTIME] Configuration pour ce jour: %02d:%02d, Activé: %s\n",
                config.schedules[dayIndex].hour, config.schedules[dayIndex].minute,
                config.schedules[dayIndex].activated ? "Oui" : "Non");
  
  // Vérifier si le bedtime est activé pour aujourd'hui
  if (!config.schedules[dayIndex].activated) {
    Serial.println("[BEDTIME] Le bedtime n'est pas activé pour aujourd'hui");
    // Si le bedtime était actif mais le jour n'est plus activé, l'arrêter
    if (bedtimeActive) {
      Serial.println("[BEDTIME] Arrêt du bedtime car le jour n'est plus activé");
      stopBedtime();
    }
    return;
  }
  
  // Vérifier si c'est l'heure de coucher exacte (dans la minute, secondes 0-59)
  // On vérifie toutes les minutes, donc on déclenche si on est dans la bonne minute
  if (now.hour == config.schedules[dayIndex].hour && 
      now.minute == config.schedules[dayIndex].minute) {
    Serial.printf("[BEDTIME] Heure correspondante détectée! Bedtime actif: %s, Last triggered: %02d:%02d\n",
                  bedtimeActive ? "Oui" : "Non", lastTriggeredHour, lastTriggeredMinute);
    
    // Déclencher le bedtime si pas déjà actif et qu'on n'a pas déjà déclenché cette minute
    // ET que le bedtime n'a pas été démarré manuellement
    // Cela évite de déclencher plusieurs fois dans la même minute
    if (!bedtimeActive && 
        !manuallyStarted &&
        (lastTriggeredHour != now.hour || lastTriggeredMinute != now.minute)) {
      Serial.println("[BEDTIME] >>> DÉCLENCHEMENT DU BEDTIME <<<");
      startBedtime();
      lastTriggeredHour = now.hour;
      lastTriggeredMinute = now.minute;
    } else {
      if (bedtimeActive) {
        Serial.println("[BEDTIME] Bedtime déjà actif, pas de nouveau déclenchement");
      } else if (manuallyStarted) {
        Serial.println("[BEDTIME] Bedtime démarré manuellement, pas de déclenchement automatique");
      } else {
        Serial.println("[BEDTIME] Déjà déclenché cette minute, pas de nouveau déclenchement");
      }
    }
  } else {
    // Log pour comprendre pourquoi ça ne correspond pas
    Serial.printf("[BEDTIME] Heure ne correspond pas: Actuelle %02d:%02d vs Config %02d:%02d\n",
                  now.hour, now.minute, config.schedules[dayIndex].hour, config.schedules[dayIndex].minute);
    
    // Si on n'est plus dans la minute de coucher, réinitialiser les flags de déclenchement
    if (lastTriggeredHour == config.schedules[dayIndex].hour && 
        lastTriggeredMinute == config.schedules[dayIndex].minute) {
      // On est sorti de la minute de déclenchement, réinitialiser pour permettre un nouveau déclenchement demain
      Serial.println("[BEDTIME] Sortie de la minute de déclenchement, réinitialisation des flags");
      lastTriggeredHour = 255;
      lastTriggeredMinute = 255;
    }
  }
}

void BedtimeManager::startBedtime() {
  Serial.println("[BEDTIME] Démarrage du bedtime automatique");
  
  bedtimeActive = true;
  bedtimeStartTime = millis();
  fadeInActive = true;
  fadeOutActive = false;
  fadeStartTime = millis();
  
  // Convertir brightness de 0-100 vers 0-255
  uint8_t brightnessValue = (config.brightness * 255 + 50) / 100;
  
  // Empêcher le sleep mode pendant le bedtime
  LEDManager::preventSleep();
  
  // Réveiller les LEDs
  LEDManager::wakeUp();
  
  // Déterminer l'effet à utiliser
  LEDEffect effect = LED_EFFECT_NONE;
  bool useEffect = false;
  
  // Vérifier si un effet est configuré (et n'est pas "none")
  if (strlen(config.effect) > 0 && strcmp(config.effect, "none") != 0) {
    useEffect = true;
    
    // Convertir le nom de l'effet en enum
    if (strcmp(config.effect, "pulse") == 0) {
      effect = LED_EFFECT_PULSE;
    } else if (strcmp(config.effect, "rainbow-soft") == 0) {
      effect = LED_EFFECT_RAINBOW_SOFT;
    } else if (strcmp(config.effect, "breathe") == 0) {
      effect = LED_EFFECT_BREATHE;
    } else if (strcmp(config.effect, "nightlight") == 0) {
      effect = LED_EFFECT_NIGHTLIGHT;
    } else {
      // Effet inconnu, utiliser couleur fixe
      useEffect = false;
      effect = LED_EFFECT_NONE;
      Serial.printf("[BEDTIME] Effet inconnu: %s, utilisation de la couleur fixe\n", config.effect);
    }
  }
  
  if (useEffect) {
    // Mode effet animé
    LEDManager::setEffect(effect);
    // Définir aussi la couleur pour les effets qui l'utilisent (comme ROTATE)
    LEDManager::setColor(config.colorR, config.colorG, config.colorB);
    Serial.printf("[BEDTIME] Effet: %s, Couleur RGB(%d, %d, %d), Brightness cible: %d%%\n",
                  config.effect, config.colorR, config.colorG, config.colorB, config.brightness);
  } else {
    // Mode couleur fixe
    LEDManager::setEffect(LED_EFFECT_NONE);
    LEDManager::setColor(config.colorR, config.colorG, config.colorB);
    Serial.printf("[BEDTIME] Couleur RGB(%d, %d, %d), Brightness cible: %d%%\n",
                  config.colorR, config.colorG, config.colorB, config.brightness);
  }
}

void BedtimeManager::updateFadeIn() {
  unsigned long elapsed = millis() - fadeStartTime;
  
  if (elapsed >= FADE_IN_DURATION_MS) {
    // Fade-in terminé
    fadeInActive = false;
    
    // Appliquer la brightness finale
    uint8_t brightnessValue = (config.brightness * 255 + 50) / 100;
    LEDManager::setBrightness(brightnessValue);
    
    Serial.println("[BEDTIME] Fade-in termine");
  } else {
    // Interpolation linéaire de la brightness
    float progress = (float)elapsed / (float)FADE_IN_DURATION_MS;
    uint8_t targetBrightness = (config.brightness * 255 + 50) / 100;
    uint8_t currentBrightness = (uint8_t)(progress * targetBrightness);
    
    LEDManager::setBrightness(currentBrightness);
  }
}

void BedtimeManager::updateFadeOut() {
  unsigned long elapsed = millis() - fadeStartTime;
  
  if (elapsed >= FADE_OUT_DURATION_MS) {
    // Fade-out terminé, éteindre complètement et arrêter le bedtime
    fadeOutActive = false;
    LEDManager::clear();
    bedtimeActive = false; // Arrêter le bedtime après le fade-out
    manuallyStarted = false; // Réinitialiser le flag manuel
    Serial.println("[BEDTIME] Fade-out termine, LEDs eteintes, bedtime arrete");
  } else {
    // Interpolation linéaire de la brightness vers 0
    float progress = (float)elapsed / (float)FADE_OUT_DURATION_MS;
    uint8_t startBrightness = (config.brightness * 255 + 50) / 100;
    uint8_t currentBrightness = (uint8_t)(startBrightness * (1.0f - progress));
    
    LEDManager::setBrightness(currentBrightness);
  }
}

void BedtimeManager::stopBedtime() {
  Serial.println("[BEDTIME] Arrêt du bedtime");
  
  bedtimeActive = false;
  fadeInActive = false;
  fadeOutActive = false;
  manuallyStarted = false; // Réinitialiser le flag manuel
  
  // Réautoriser le sleep mode
  LEDManager::allowSleep();
  
  // Éteindre les LEDs
  LEDManager::clear();
}

bool BedtimeManager::isBedtimeEnabled() {
  if (!initialized) {
    return false;
  }
  
  DateTime now = RTCManager::getDateTime();
  uint8_t dayIndex = weekdayToIndex(now.dayOfWeek);
  
  return config.schedules[dayIndex].activated;
}

BedtimeConfig BedtimeManager::getConfig() {
  return config;
}

bool BedtimeManager::isBedtimeActive() {
  return bedtimeActive;
}

void BedtimeManager::startBedtimeManually() {
  Serial.println("[BEDTIME] Démarrage manuel du bedtime");
  
  // Marquer comme démarré manuellement pour empêcher le déclenchement automatique
  manuallyStarted = true;
  
  // Démarrer le bedtime normalement
  startBedtime();
}

void BedtimeManager::stopBedtimeManually() {
  Serial.println("[BEDTIME] Arrêt manuel du bedtime");
  
  // Arrêter le bedtime (qui réinitialisera aussi manuallyStarted)
  stopBedtime();
}
