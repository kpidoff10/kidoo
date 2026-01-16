#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

#include <Arduino.h>

// Initialiser le client MQTT
// Doit être appelé après la connexion WiFi
void initMQTT();

// Mettre à jour le client MQTT (à appeler dans loop())
// Gère la connexion, la reconnexion et la réception des messages
void updateMQTT();

// Vérifier si MQTT est connecté
bool isMQTTConnected();

// Obtenir le Kidoo ID depuis la configuration
// Utilisé pour construire le topic MQTT
String getKidooId();

// Définir le Kidoo ID (doit être configuré avant initMQTT)
void setKidooId(const String& kidooId);

#endif // MQTT_MANAGER_H
