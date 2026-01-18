#include "sd_manager.h"
#include <SPI.h>
#include <SD.h>
#include <ArduinoJson.h>
#include "../../../model_config.h"

// Variables statiques
bool SDManager::initialized = false;
bool SDManager::cardAvailable = false;
const char* SDManager::CONFIG_FILE_PATH = "/config.json";

// Initialiser une configuration avec les valeurs par défaut
void SDManager::initDefaultConfig(SDConfig* config) {
  if (config == nullptr) return;
  
  config->valid = false; // Par défaut, pas de config depuis SD
  strcpy(config->device_name, DEFAULT_DEVICE_NAME);
  strcpy(config->wifi_ssid, DEFAULT_WIFI_SSID);
  strcpy(config->wifi_password, DEFAULT_WIFI_PASSWORD);
  config->led_brightness = DEFAULT_LED_BRIGHTNESS;
  config->sleep_timeout_ms = DEFAULT_SLEEP_TIMEOUT_MS;
}

bool SDManager::init() {
  if (initialized) {
    return cardAvailable;
  }
  
  initialized = true;
  cardAvailable = false;
  
  if (initSDCard()) {
    cardAvailable = true;
    
    // Vérifier le type de carte
    uint8_t cardType = getCardType();
    if (cardType == CARD_NONE) {
      cardAvailable = false;
    }
  }
  
  return cardAvailable;
}

bool SDManager::isAvailable() {
  if (!initialized) {
    return false;
  }
  
  // Vérifier à nouveau si la carte est toujours présente
  if (cardAvailable) {
    uint8_t cardType = SD.cardType();
    if (cardType == CARD_NONE) {
      cardAvailable = false;
    }
  }
  
  return cardAvailable;
}

uint8_t SDManager::getCardType() {
  if (!initialized) {
    return CARD_NONE;
  }
  return SD.cardType();
}

uint64_t SDManager::getTotalSpace() {
  if (!isAvailable()) {
    return 0;
  }
  return SD.totalBytes();
}

uint64_t SDManager::getFreeSpace() {
  if (!isAvailable()) {
    return 0;
  }
  return SD.totalBytes() - SD.usedBytes();
}

uint64_t SDManager::getUsedSpace() {
  if (!isAvailable()) {
    return 0;
  }
  return SD.usedBytes();
}

bool SDManager::initSDCard() {
  // Initialiser le bus SPI avec les pins configurés
  SPI.begin(SD_SCK_PIN, SD_MISO_PIN, SD_MOSI_PIN, SD_CS_PIN);
  delay(100);
  
  // Configurer la broche CS en sortie et la mettre à HIGH
  pinMode(SD_CS_PIN, OUTPUT);
  digitalWrite(SD_CS_PIN, HIGH);
  delay(50);
  
  // Essayer d'initialiser la carte SD avec différentes fréquences
  uint32_t frequencies[] = {400000, 1000000, 4000000, 8000000};
  int maxAttempts = sizeof(frequencies) / sizeof(frequencies[0]);
  
  for (int i = 0; i < maxAttempts; i++) {
    if (SD.begin(SD_CS_PIN, SPI, frequencies[i])) {
      return true;
    }
    delay(200);
  }
  
  return false;
}

bool SDManager::configFileExists() {
  if (!isAvailable()) {
    return false;
  }
  
  return SD.exists(CONFIG_FILE_PATH);
}

SDConfig SDManager::getConfig() {
  // Initialiser avec les valeurs par défaut
  SDConfig config;
  SDManager::initDefaultConfig(&config);
  
  if (!isAvailable()) {
    return config;
  }
  
  if (!configFileExists()) {
    return config;
  }
  
  // Ouvrir le fichier
  File configFile = SD.open(CONFIG_FILE_PATH, FILE_READ);
  if (!configFile) {
    return config;
  }
  
  // Lire la taille du fichier
  size_t fileSize = configFile.size();
  if (fileSize == 0) {
    configFile.close();
    return config;
  }
  
  // Allouer un buffer pour lire le fichier
  const size_t maxSize = 1024;
  if (fileSize > maxSize) {
    fileSize = maxSize;
  }
  
  char* jsonBuffer = new char[fileSize + 1];
  if (!jsonBuffer) {
    configFile.close();
    return config;
  }
  
  // Lire le fichier
  size_t bytesRead = configFile.readBytes(jsonBuffer, fileSize);
  jsonBuffer[bytesRead] = '\0';
  configFile.close();
  
  if (bytesRead == 0) {
    delete[] jsonBuffer;
    return config;
  }
  
  // Parser le JSON
  // Utiliser StaticJsonDocument avec allocation statique (1024 octets)
  StaticJsonDocument<1024> doc;
  DeserializationError error = deserializeJson(doc, jsonBuffer);
  
  delete[] jsonBuffer;
  
  if (error) {
    return config;
  }
  
  // Extraire les valeurs (utiliser is<String>() au lieu de containsKey())
  if (doc["wifi_ssid"].is<String>()) {
    strncpy(config.wifi_ssid, doc["wifi_ssid"] | "", sizeof(config.wifi_ssid) - 1);
    config.wifi_ssid[sizeof(config.wifi_ssid) - 1] = '\0';
  }
  
  if (doc["wifi_password"].is<String>()) {
    strncpy(config.wifi_password, doc["wifi_password"] | "", sizeof(config.wifi_password) - 1);
    config.wifi_password[sizeof(config.wifi_password) - 1] = '\0';
  }
  
  if (doc["device_name"].is<String>()) {
    strncpy(config.device_name, doc["device_name"] | "Kidoo", sizeof(config.device_name) - 1);
    config.device_name[sizeof(config.device_name) - 1] = '\0';
  }
  
  if (doc["led_brightness"].is<int>()) {
    int brightness = doc["led_brightness"] | 255;
    if (brightness < 0) brightness = 0;
    if (brightness > 255) brightness = 255;
    config.led_brightness = (uint8_t)brightness;
  }
  
  if (doc["sleep_timeout_ms"].is<int>()) {
    int timeout = doc["sleep_timeout_ms"] | 0;
    if (timeout < 0) {
      timeout = 0;  // 0 = désactivé
    } else if (timeout > 0 && timeout < MIN_SLEEP_TIMEOUT_MS) {
      // Si activé mais en dessous du minimum, utiliser le minimum
      timeout = MIN_SLEEP_TIMEOUT_MS;
    }
    config.sleep_timeout_ms = (uint32_t)timeout;
  }
  
  config.valid = true;
  return config;
}

bool SDManager::saveConfig(const SDConfig& config) {
  if (!isAvailable()) {
    return false;
  }
  
  // Créer un document JSON
  StaticJsonDocument<1024> doc;
  
  // Ajouter les valeurs (seulement si elles sont valides/modifiées)
  if (strlen(config.device_name) > 0) {
    doc["device_name"] = config.device_name;
  }
  
  if (strlen(config.wifi_ssid) > 0) {
    doc["wifi_ssid"] = config.wifi_ssid;
  }
  
  if (strlen(config.wifi_password) > 0) {
    doc["wifi_password"] = config.wifi_password;
  }
  
  doc["led_brightness"] = config.led_brightness;
  doc["sleep_timeout_ms"] = config.sleep_timeout_ms;
  
  // Ouvrir le fichier en mode écriture (crée le fichier s'il n'existe pas)
  File configFile = SD.open(CONFIG_FILE_PATH, FILE_WRITE);
  if (!configFile) {
    return false;
  }
  
  // Sérialiser le JSON dans le fichier
  size_t bytesWritten = serializeJson(doc, configFile);
  configFile.close();
  
  return (bytesWritten > 0);
}
