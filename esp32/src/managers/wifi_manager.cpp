#include "wifi_manager.h"
#include "../core/state_manager.h"

// Fonction pour initialiser le WiFi en mode Access Point
void initWiFiAP(const char* ssid) {
  // Mode AP + Station pour pouvoir recevoir les credentials et rester accessible
  WiFi.mode(WIFI_AP_STA);
  
  // Créer le point d'accès avec le SSID spécifié
  // Le mot de passe est vide par défaut (peut être ajouté si nécessaire)
  bool result = WiFi.softAP(ssid);
  
  if (result) {
    Serial.print("[WIFI] Point d'acces WiFi cree avec succes ! SSID: ");
    Serial.println(ssid);
    Serial.print("[WIFI] Adresse IP de l'AP: ");
    Serial.println(WiFi.softAPIP());
    Serial.println("[WIFI] En attente de configuration WiFi via Bluetooth...");
  } else {
    Serial.println("[WIFI] ERREUR: Impossible de creer le point d'acces WiFi");
  }
  
  // Mettre à jour l'état initial
  updateWiFiState();
}

// Fonction pour se connecter au WiFi domestique
bool connectToWiFi(const char* ssid, const char* password) {
  Serial.print("[WIFI] Tentative de connexion au WiFi: ");
  Serial.println(ssid);
  
  // S'assurer qu'on est en mode AP_STA pour garder l'AP actif
  WiFi.mode(WIFI_AP_STA);
  
  // Se connecter au WiFi
  WiFi.begin(ssid, password);
  
  // Attendre la connexion (max 20 secondes)
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  Serial.println();
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("[WIFI] Connexion reussie au WiFi !");
    Serial.print("[WIFI] Adresse IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("[WIFI] SSID: ");
    Serial.println(WiFi.SSID());
    Serial.print("[WIFI] Signal (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    
    // Mettre à jour l'état
    updateWiFiState();
    return true;
  } else {
    wl_status_t status = WiFi.status();
    String errorMessage = getWiFiStatusMessage(status);
    
    Serial.println("[WIFI] ERREUR: Impossible de se connecter au WiFi");
    Serial.print("[WIFI] Statut: ");
    Serial.print(status);
    Serial.print(" (");
    Serial.print(errorMessage);
    Serial.println(")");
    
    // Mettre à jour l'état
    updateWiFiState();
    return false;
  }
}

// Fonction pour obtenir un message d'erreur descriptif à partir d'un code de statut WiFi
String getWiFiStatusMessage(wl_status_t status) {
  switch (status) {
    case WL_IDLE_STATUS:
      return "En attente";
    case WL_NO_SSID_AVAIL:
      return "SSID non disponible";
    case WL_SCAN_COMPLETED:
      return "Scan termine";
    case WL_CONNECTED:
      return "Connecte";
    case WL_CONNECT_FAILED:
      return "Echec de connexion";
    case WL_CONNECTION_LOST:
      return "Connexion perdue";
    case WL_DISCONNECTED:
      return "Deconnecte";
    case WL_NO_SHIELD:
      return "Module WiFi non disponible";
    default:
      return "Erreur inconnue";
  }
}

// Fonction pour obtenir l'adresse IP de l'AP
IPAddress getAPIP() {
  return WiFi.softAPIP();
}

// Fonction pour obtenir l'adresse IP en mode Station
IPAddress getStationIP() {
  return WiFi.localIP();
}

// Fonction pour obtenir le nombre de clients connectés à l'AP
int getConnectedClients() {
  return WiFi.softAPgetStationNum();
}

// Fonction pour vérifier si connecté au WiFi
bool isWiFiConnected() {
  return WiFi.status() == WL_CONNECTED;
}

// Fonction pour obtenir le SSID auquel on est connecté (mode Station)
String getConnectedSSID() {
  if (WiFi.status() == WL_CONNECTED) {
    return WiFi.SSID();
  }
  return "";
}

// Fonction pour mettre à jour l'état dans StateManager
void updateWiFiState() {
  // Ne pas mettre à jour pendant l'initialisation (évite les réinitialisations intempestives)
  // Le flag isInitializing est géré par BootManager
  static bool lastWifiConnected = false;
  static int lastClients = 0;
  
  bool currentConnected = isWiFiConnected();
  int currentClients = getConnectedClients();
  
  // Ne mettre à jour que si l'état a vraiment changé
  if (currentConnected != lastWifiConnected || currentClients != lastClients) {
    StateManager::setWiFiConnected(currentConnected);
    StateManager::setWiFiAPClients(currentClients);
    
    // Réinitialiser le timer et forcer le réveil si l'état WiFi change (connexion/déconnexion)
    StateManager::resetSleepTimer(true);  // forceWake=true pour réveiller le système
    
    lastWifiConnected = currentConnected;
    lastClients = currentClients;
  } else {
    // Mettre à jour quand même les valeurs dans StateManager (au cas où)
    StateManager::setWiFiConnected(currentConnected);
    StateManager::setWiFiAPClients(currentClients);
  }
}
