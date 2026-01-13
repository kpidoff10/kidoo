#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <Arduino.h>
#include <WiFi.h>

// Fonction pour initialiser le WiFi en mode Access Point
void initWiFiAP(const char* ssid);

// Fonction pour se connecter au WiFi domestique
bool connectToWiFi(const char* ssid, const char* password);

// Fonction pour obtenir l'adresse IP de l'AP
IPAddress getAPIP();

// Fonction pour obtenir l'adresse IP en mode Station
IPAddress getStationIP();

// Fonction pour obtenir le nombre de clients connectés à l'AP
int getConnectedClients();

// Fonction pour vérifier si connecté au WiFi
bool isWiFiConnected();

// Fonction pour obtenir le SSID auquel on est connecté (mode Station)
String getConnectedSSID();

// Fonction pour mettre à jour l'état dans StateManager (à appeler périodiquement)
void updateWiFiState();

// Fonction pour obtenir un message d'erreur descriptif à partir d'un code de statut WiFi
String getWiFiStatusMessage(wl_status_t status);

#endif // WIFI_MANAGER_H
