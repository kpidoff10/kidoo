#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <Arduino.h>

/**
 * Gestionnaire WiFi commun
 * 
 * Ce module gère l'initialisation et les opérations WiFi
 * pour tous les modèles supportant le WiFi
 */

// États de connexion WiFi
enum WiFiConnectionStatus {
  WIFI_STATUS_DISCONNECTED,    // Non connecté
  WIFI_STATUS_CONNECTING,      // Connexion en cours
  WIFI_STATUS_CONNECTED,       // Connecté
  WIFI_STATUS_CONNECTION_FAILED // Échec de connexion
};

class WiFiManager {
public:
  /**
   * Initialiser le gestionnaire WiFi
   * @return true si l'initialisation est réussie, false sinon
   */
  static bool init();
  
  /**
   * Vérifier si le WiFi est disponible/opérationnel
   * @return true si le WiFi est opérationnel, false sinon
   */
  static bool isAvailable();
  
  /**
   * Vérifier si le WiFi est initialisé
   * @return true si le WiFi est initialisé, false sinon
   */
  static bool isInitialized();
  
  /**
   * Se connecter au WiFi avec les identifiants de la config
   * @return true si la connexion est réussie, false sinon
   */
  static bool connect();
  
  /**
   * Se connecter au WiFi avec des identifiants spécifiques
   * @param ssid SSID du réseau
   * @param password Mot de passe du réseau
   * @param timeoutMs Timeout en millisecondes (défaut: 10000)
   * @return true si la connexion est réussie, false sinon
   */
  static bool connect(const char* ssid, const char* password, uint32_t timeoutMs = 10000);
  
  /**
   * Se déconnecter du WiFi
   */
  static void disconnect();
  
  /**
   * Vérifier si le WiFi est connecté
   * @return true si connecté, false sinon
   */
  static bool isConnected();
  
  /**
   * Obtenir l'état de connexion
   * @return État de connexion WiFi
   */
  static WiFiConnectionStatus getConnectionStatus();
  
  /**
   * Obtenir l'adresse IP locale
   * @return Adresse IP sous forme de String
   */
  static String getLocalIP();
  
  /**
   * Obtenir le SSID du réseau connecté
   * @return SSID du réseau
   */
  static String getSSID();
  
  /**
   * Obtenir la force du signal (RSSI)
   * @return RSSI en dBm
   */
  static int getRSSI();
  
  /**
   * Afficher les informations WiFi sur Serial
   */
  static void printInfo();

private:
  // Variables statiques
  static bool initialized;
  static bool available;
  static WiFiConnectionStatus connectionStatus;
  static char currentSSID[64];
  
  // Timeout de connexion par défaut (15 secondes)
  static const uint32_t DEFAULT_CONNECT_TIMEOUT_MS = 15000;
};

#endif // WIFI_MANAGER_H
