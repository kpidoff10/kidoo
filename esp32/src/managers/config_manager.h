#ifndef CONFIG_MANAGER_H
#define CONFIG_MANAGER_H

#include <Arduino.h>

// Fonction pour sauvegarder la configuration globale du Kidoo sur la carte SD
bool saveKidooConfigToSD();

// Fonction pour charger la configuration globale du Kidoo depuis la carte SD
bool loadKidooConfigFromSD();

// Fonction pour obtenir le SSID WiFi depuis la configuration
String getConfigWiFiSSID();

// Fonction pour obtenir le mot de passe WiFi depuis la configuration
String getConfigWiFiPassword();

// Fonction pour définir le SSID WiFi dans la configuration
void setConfigWiFiSSID(const char* ssid);

// Fonction pour définir le mot de passe WiFi dans la configuration
void setConfigWiFiPassword(const char* password);

// Fonction pour obtenir la luminosité depuis la configuration (10-100)
uint8_t getConfigBrightness();

// Fonction pour définir la luminosité dans la configuration (10-100)
void setConfigBrightness(uint8_t brightness);

// Fonction pour obtenir le timeout de sommeil depuis la configuration (en millisecondes)
unsigned long getConfigSleepTimeout();

// Fonction pour définir le timeout de sommeil dans la configuration (5000-300000 ms)
void setConfigSleepTimeout(unsigned long timeout);

#endif // CONFIG_MANAGER_H