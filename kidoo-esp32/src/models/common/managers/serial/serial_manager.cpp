#include "serial_manager.h"
#include "../log/log_manager.h"
#include <esp_system.h>
#include <esp_heap_caps.h>
#include <cstdarg>

// Variables statiques
bool SerialManager::initialized = false;

void SerialManager::init() {
  if (initialized) {
    return;
  }
  
  initialized = true;
  
  // Afficher les informations système au démarrage
  printSystemInfo();
}

bool SerialManager::isAvailable() {
  return Serial && Serial.availableForWrite() > 0;
}

void SerialManager::reboot(uint32_t delayMs) {
  if (delayMs > 0) {
    Serial.print("[SERIAL] Redemarrage dans ");
    Serial.print(delayMs);
    Serial.println(" ms...");
    delay(delayMs);
  }
  
  Serial.println("[SERIAL] Redemarrage de l'ESP32...");
  Serial.flush();
  
  // Redémarrer l'ESP32
  esp_restart();
}

void SerialManager::deepSleep(uint32_t delayMs) {
  if (delayMs > 0) {
    Serial.print("[SERIAL] Deep sleep dans ");
    Serial.print(delayMs);
    Serial.println(" ms...");
    delay(delayMs);
  }
  
  Serial.println("[SERIAL] Passage en deep sleep...");
  Serial.flush();
  
  // Mettre en deep sleep (se réveillera après 1 seconde)
  // Note: Pour un deep sleep permanent, utiliser esp_deep_sleep_start()
  esp_deep_sleep(1000000ULL); // 1 seconde en microsecondes
}

void SerialManager::printSystemInfo() {
  if (!isAvailable()) {
    return;
  }
  
  Serial.println("");
  Serial.println("========================================");
  Serial.println("     INFORMATIONS SYSTEME");
  Serial.println("========================================");
  Serial.print("Chip Model: ");
  Serial.println(ESP.getChipModel());
  Serial.print("Chip Revision: ");
  Serial.println(ESP.getChipRevision());
  Serial.print("CPU Frequency: ");
  Serial.print(ESP.getCpuFreqMHz());
  Serial.println(" MHz");
  Serial.print("Flash Size: ");
  Serial.print(ESP.getFlashChipSize() / 1024 / 1024);
  Serial.println(" MB");
  Serial.print("SDK Version: ");
  Serial.println(ESP.getSdkVersion());
  Serial.println("========================================");
  Serial.println("");
}

void SerialManager::printMemoryInfo() {
  if (!isAvailable()) {
    return;
  }
  
  printTimestamp();
  Serial.println("[MEMORY] Informations memoire:");
  Serial.print("  Heap libre: ");
  Serial.print(getFreeHeap());
  Serial.println(" octets");
  Serial.print("  Heap total: ");
  Serial.print(getTotalHeap());
  Serial.println(" octets");
  Serial.print("  Heap minimum: ");
  Serial.print(getMinFreeHeap());
  Serial.println(" octets");
  Serial.print("  Utilisation: ");
  Serial.print((getTotalHeap() - getFreeHeap()) * 100 / getTotalHeap());
  Serial.println("%");
}

uint32_t SerialManager::getFreeHeap() {
  return ESP.getFreeHeap();
}

uint32_t SerialManager::getTotalHeap() {
  return ESP.getHeapSize();
}

uint32_t SerialManager::getMinFreeHeap() {
  return ESP.getMinFreeHeap();
}

void SerialManager::printTimestamp() {
  if (!isAvailable()) {
    return;
  }
  
  unsigned long ms = millis();
  unsigned long seconds = ms / 1000;
  unsigned long minutes = seconds / 60;
  unsigned long hours = minutes / 60;
  
  Serial.print("[");
  if (hours < 10) Serial.print("0");
  Serial.print(hours);
  Serial.print(":");
  if (minutes % 60 < 10) Serial.print("0");
  Serial.print(minutes % 60);
  Serial.print(":");
  if (seconds % 60 < 10) Serial.print("0");
  Serial.print(seconds % 60);
  Serial.print(".");
  if (ms % 1000 < 100) Serial.print("0");
  if (ms % 1000 < 10) Serial.print("0");
  Serial.print(ms % 1000);
  Serial.print("] ");
}

void SerialManager::log(const char* format, ...) {
  if (!isAvailable()) {
    return;
  }
  
  printTimestamp();
  
  va_list args;
  va_start(args, format);
  
  // Utiliser vsnprintf pour formater le message
  char buffer[256];
  vsnprintf(buffer, sizeof(buffer), format, args);
  Serial.println(buffer);
  
  va_end(args);
}

void SerialManager::logError(const char* format, ...) {
  if (!isAvailable()) {
    return;
  }
  
  va_list args;
  va_start(args, format);
  
  char buffer[256];
  vsnprintf(buffer, sizeof(buffer), format, args);
  
  // Utiliser LogManager pour logger l'erreur (écrit aussi sur SD)
  LogManager::error("%s", buffer);
  
  va_end(args);
}

void SerialManager::logDebug(const char* format, ...) {
  if (!isAvailable()) {
    return;
  }
  
  printTimestamp();
  Serial.print("[DEBUG] ");
  
  va_list args;
  va_start(args, format);
  
  char buffer[256];
  vsnprintf(buffer, sizeof(buffer), format, args);
  Serial.println(buffer);
  
  va_end(args);
}
