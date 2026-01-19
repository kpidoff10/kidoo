#include "wifi_manager.h"
#include "../../../model_config.h"
#include "../init/init_manager.h"
#include "../sd/sd_manager.h"

#ifdef HAS_WIFI
#include <WiFi.h>
#endif

// Variables statiques
bool WiFiManager::initialized = false;
bool WiFiManager::available = false;
WiFiConnectionStatus WiFiManager::connectionStatus = WIFI_STATUS_DISCONNECTED;
char WiFiManager::currentSSID[64] = "";

bool WiFiManager::init() {
  if (initialized) {
    return available;
  }
  
  initialized = true;
  available = false;
  connectionStatus = WIFI_STATUS_DISCONNECTED;
  currentSSID[0] = '\0';
  
#ifndef HAS_WIFI
  Serial.println("[WIFI] WiFi non disponible sur ce modele");
  return false;
#else
  Serial.println("[WIFI] Initialisation du WiFi...");
  
  // Configurer le WiFi en mode Station (client)
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  
  available = true;
  Serial.println("[WIFI] WiFi initialise (mode Station)");
  
  return true;
#endif
}

bool WiFiManager::isAvailable() {
  return initialized && available;
}

bool WiFiManager::isInitialized() {
  return initialized;
}

bool WiFiManager::connect() {
#ifndef HAS_WIFI
  return false;
#else
  if (!available) {
    Serial.println("[WIFI] ERREUR: WiFi non initialise");
    return false;
  }
  
  // Récupérer la config depuis InitManager
  const SDConfig& config = InitManager::getConfig();
  
  // Vérifier si les identifiants WiFi sont configurés
  if (strlen(config.wifi_ssid) == 0) {
    Serial.println("[WIFI] Aucun SSID configure dans config.json");
    connectionStatus = WIFI_STATUS_DISCONNECTED;
    return false;
  }
  
  Serial.print("[WIFI] Connexion au reseau: ");
  Serial.println(config.wifi_ssid);
  
  return connect(config.wifi_ssid, config.wifi_password, DEFAULT_CONNECT_TIMEOUT_MS);
#endif
}

bool WiFiManager::connect(const char* ssid, const char* password, uint32_t timeoutMs) {
#ifndef HAS_WIFI
  return false;
#else
  if (!available) {
    Serial.println("[WIFI] ERREUR: WiFi non initialise");
    return false;
  }
  
  if (ssid == nullptr || strlen(ssid) == 0) {
    Serial.println("[WIFI] ERREUR: SSID invalide");
    connectionStatus = WIFI_STATUS_CONNECTION_FAILED;
    return false;
  }
  
  // Sauvegarder le SSID
  strncpy(currentSSID, ssid, sizeof(currentSSID) - 1);
  currentSSID[sizeof(currentSSID) - 1] = '\0';
  
  connectionStatus = WIFI_STATUS_CONNECTING;
  
  Serial.print("[WIFI] Connexion a: ");
  Serial.println(ssid);
  
  // Démarrer la connexion
  WiFi.begin(ssid, password);
  
  // Attendre la connexion avec timeout
  unsigned long startTime = millis();
  int dotCount = 0;
  
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - startTime >= timeoutMs) {
      Serial.println();
      Serial.println("[WIFI] ERREUR: Timeout de connexion");
      connectionStatus = WIFI_STATUS_CONNECTION_FAILED;
      return false;
    }
    
    delay(500);
    Serial.print(".");
    dotCount++;
    
    if (dotCount >= 40) {
      Serial.println();
      dotCount = 0;
    }
  }
  
  Serial.println();
  connectionStatus = WIFI_STATUS_CONNECTED;
  
  Serial.println("[WIFI] ========================================");
  Serial.println("[WIFI] Connecte avec succes !");
  Serial.print("[WIFI] SSID: ");
  Serial.println(ssid);
  Serial.print("[WIFI] Adresse IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("[WIFI] Force du signal: ");
  Serial.print(WiFi.RSSI());
  Serial.println(" dBm");
  Serial.println("[WIFI] ========================================");
  
  return true;
#endif
}

void WiFiManager::disconnect() {
#ifdef HAS_WIFI
  if (!available) {
    return;
  }
  
  WiFi.disconnect();
  connectionStatus = WIFI_STATUS_DISCONNECTED;
  currentSSID[0] = '\0';
  Serial.println("[WIFI] Deconnecte");
#endif
}

bool WiFiManager::isConnected() {
#ifdef HAS_WIFI
  if (!available) {
    return false;
  }
  
  bool connected = (WiFi.status() == WL_CONNECTED);
  
  // Mettre à jour le statut si nécessaire
  if (connected && connectionStatus != WIFI_STATUS_CONNECTED) {
    connectionStatus = WIFI_STATUS_CONNECTED;
  } else if (!connected && connectionStatus == WIFI_STATUS_CONNECTED) {
    connectionStatus = WIFI_STATUS_DISCONNECTED;
  }
  
  return connected;
#else
  return false;
#endif
}

WiFiConnectionStatus WiFiManager::getConnectionStatus() {
  return connectionStatus;
}

String WiFiManager::getLocalIP() {
#ifdef HAS_WIFI
  if (!available || !isConnected()) {
    return "0.0.0.0";
  }
  return WiFi.localIP().toString();
#else
  return "0.0.0.0";
#endif
}

String WiFiManager::getSSID() {
#ifdef HAS_WIFI
  if (!available || !isConnected()) {
    return "";
  }
  return String(currentSSID);
#else
  return "";
#endif
}

int WiFiManager::getRSSI() {
#ifdef HAS_WIFI
  if (!available || !isConnected()) {
    return 0;
  }
  return WiFi.RSSI();
#else
  return 0;
#endif
}

void WiFiManager::printInfo() {
  Serial.println("[WIFI] ========== Info WiFi ==========");
  
#ifndef HAS_WIFI
  Serial.println("[WIFI] WiFi non disponible sur ce modele");
#else
  if (!initialized) {
    Serial.println("[WIFI] WiFi non initialise");
  } else if (!available) {
    Serial.println("[WIFI] WiFi non disponible");
  } else {
    Serial.print("[WIFI] Statut: ");
    switch (connectionStatus) {
      case WIFI_STATUS_DISCONNECTED:
        Serial.println("Deconnecte");
        break;
      case WIFI_STATUS_CONNECTING:
        Serial.println("Connexion en cours...");
        break;
      case WIFI_STATUS_CONNECTED:
        Serial.println("Connecte");
        Serial.print("[WIFI] SSID: ");
        Serial.println(currentSSID);
        Serial.print("[WIFI] IP: ");
        Serial.println(WiFi.localIP());
        Serial.print("[WIFI] RSSI: ");
        Serial.print(WiFi.RSSI());
        Serial.println(" dBm");
        break;
      case WIFI_STATUS_CONNECTION_FAILED:
        Serial.println("Echec de connexion");
        break;
    }
  }
#endif
  
  Serial.println("[WIFI] ================================");
}
