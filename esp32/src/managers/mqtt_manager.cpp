#include "mqtt_manager.h"
#include "../core/state_manager.h"
#include "../managers/wifi_manager.h"
#include "../managers/commands/brightness/command.h"
#include "../managers/commands/sleep_timeout/command.h"
#include "../config/config.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Configuration MQTT
// Ces valeurs peuvent être stockées dans la configuration SD ou définies ici
#define MQTT_BROKER_HOST "05570522768945d290f4d8ddaffe279f.s1.eu.hivemq.cloud"  // HiveMQ Cloud cluster
#define MQTT_BROKER_PORT 8883                 // Port TLS sécurisé (8883 pour HiveMQ Cloud)
#define MQTT_CLIENT_ID_PREFIX "kidoo-esp32-"  // Préfixe pour l'ID client
#define MQTT_TOPIC_PREFIX "kidoos/"           // Préfixe des topics MQTT
#define MQTT_RECONNECT_DELAY 5000             // Délai avant reconnexion (ms)
#define MQTT_KEEPALIVE 60                     // Keepalive MQTT (secondes)

// Credentials MQTT (à configurer depuis HiveMQ Cloud dashboard)
// Pour l'instant, on utilise des valeurs par défaut (à remplacer)
#define MQTT_USERNAME "kidoo"  // Votre username HiveMQ Cloud
#define MQTT_PASSWORD "Kidoo-app10"  // Votre password HiveMQ Cloud

// Variables globales
WiFiClientSecure wifiClient;  // Utiliser WiFiClientSecure pour TLS
PubSubClient mqttClient(wifiClient);
String kidooId = "";  // ID du Kidoo (doit être configuré)
unsigned long lastReconnectAttempt = 0;
bool mqttInitialized = false;

/**
 * Callback appelé quand un message MQTT est reçu
 */
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("[MQTT] Message reçu sur le topic: ");
  Serial.println(topic);
  Serial.print("[MQTT] Longueur du message: ");
  Serial.println(length);

  // Convertir le payload en String
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("[MQTT] Contenu du message: ");
  Serial.println(message);

  // Parser le JSON
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, message);

  if (error) {
    Serial.print("[MQTT] Erreur de parsing JSON: ");
    Serial.println(error.c_str());
    return;
  }

  // Vérifier que c'est bien notre topic
  String expectedTopic = MQTT_TOPIC_PREFIX + kidooId + "/config";
  if (String(topic) != expectedTopic) {
    Serial.print("[MQTT] Topic inattendu. Attendu: ");
    Serial.print(expectedTopic);
    Serial.print(", Reçu: ");
    Serial.println(topic);
    return;
  }

  // Traiter les changements de configuration
  bool configChanged = false;

  // Mettre à jour la luminosité si présente
  if (doc.containsKey("brightness")) {
    int brightness = doc["brightness"].as<int>();
    Serial.print("[MQTT] Mise à jour de la luminosité: ");
    Serial.println(brightness);

    // Créer un document JSON pour la commande BRIGHTNESS
    JsonDocument brightnessDoc;
    brightnessDoc["command"] = "BRIGHTNESS";
    brightnessDoc["percent"] = brightness;

    // Appeler le handler de commande brightness
    if (handleBrightnessCommand(brightnessDoc)) {
      configChanged = true;
      Serial.println("[MQTT] Luminosité mise à jour avec succès");
    } else {
      Serial.println("[MQTT] Erreur lors de la mise à jour de la luminosité");
    }
  }

  // Mettre à jour le timeout de sommeil si présent
  if (doc.containsKey("sleepTimeout")) {
    int sleepTimeout = doc["sleepTimeout"].as<int>();
    Serial.print("[MQTT] Mise à jour du timeout de sommeil: ");
    Serial.println(sleepTimeout);

    // Créer un document JSON pour la commande SLEEP_TIMEOUT
    JsonDocument sleepDoc;
    sleepDoc["command"] = "SLEEP_TIMEOUT";
    sleepDoc["timeout"] = sleepTimeout;

    // Appeler le handler de commande sleep_timeout
    if (handleSleepTimeoutCommand(sleepDoc)) {
      configChanged = true;
      Serial.println("[MQTT] Timeout de sommeil mis à jour avec succès");
    } else {
      Serial.println("[MQTT] Erreur lors de la mise à jour du timeout de sommeil");
    }
  }

  if (configChanged) {
    Serial.println("[MQTT] Configuration mise à jour depuis MQTT");
    // Réinitialiser le timer de sommeil car on a reçu une activité
    StateManager::resetSleepTimer(true);
  } else {
    Serial.println("[MQTT] Aucun changement de configuration détecté");
  }
}

/**
 * Se connecter au broker MQTT
 */
bool connectMQTT() {
  if (kidooId.length() == 0) {
    Serial.println("[MQTT] Kidoo ID non configuré, impossible de se connecter");
    return false;
  }

  // Générer un ID client unique
  String clientId = MQTT_CLIENT_ID_PREFIX + String(random(0xffff), HEX);

  Serial.print("[MQTT] Tentative de connexion au broker: ");
  Serial.print(MQTT_BROKER_HOST);
  Serial.print(":");
  Serial.println(MQTT_BROKER_PORT);
  Serial.print("[MQTT] Client ID: ");
  Serial.println(clientId);

  // Configurer le certificat TLS (pour HiveMQ Cloud)
  // Note: HiveMQ Cloud utilise un certificat valide, on peut accepter tous les certificats
  // Pour une sécurité maximale, vous pouvez ajouter le certificat spécifique
  wifiClient.setInsecure();  // Accepter tous les certificats (pour développement)
  // wifiClient.setCACert(hivemq_root_ca);  // Pour production, utiliser le certificat CA

  // Tenter de se connecter avec credentials si fournis
  bool connected = false;
  if (strlen(MQTT_USERNAME) > 0 && strlen(MQTT_PASSWORD) > 0) {
    Serial.println("[MQTT] Connexion avec authentification...");
    connected = mqttClient.connect(clientId.c_str(), MQTT_USERNAME, MQTT_PASSWORD);
  } else {
    Serial.println("[MQTT] Connexion sans authentification...");
    connected = mqttClient.connect(clientId.c_str());
  }

  if (connected) {
    Serial.println("[MQTT] Connecté au broker avec succès");

    // S'abonner au topic de configuration
    String topic = MQTT_TOPIC_PREFIX + kidooId + "/config";
    Serial.print("[MQTT] Abonnement au topic: ");
    Serial.println(topic);

    if (mqttClient.subscribe(topic.c_str())) {
      Serial.println("[MQTT] Abonné au topic avec succès");
      return true;
    } else {
      Serial.println("[MQTT] Erreur lors de l'abonnement au topic");
      mqttClient.disconnect();
      return false;
    }
  } else {
    Serial.print("[MQTT] Échec de la connexion, code d'erreur: ");
    Serial.println(mqttClient.state());
    return false;
  }
}

/**
 * Initialiser le client MQTT
 * Doit être appelé après la connexion WiFi
 */
void initMQTT() {
  if (mqttInitialized) {
    return;
  }

  if (!isWiFiConnected()) {
    Serial.println("[MQTT] WiFi non connecté, impossible d'initialiser MQTT");
    return;
  }

  if (kidooId.length() == 0) {
    Serial.println("[MQTT] Kidoo ID non configuré, impossible d'initialiser MQTT");
    return;
  }

  Serial.println("[MQTT] Initialisation du client MQTT...");

  // Configurer le serveur MQTT
  mqttClient.setServer(MQTT_BROKER_HOST, MQTT_BROKER_PORT);
  
  // Configurer le callback pour les messages reçus
  mqttClient.setCallback(mqttCallback);
  
  // Configurer le buffer
  mqttClient.setBufferSize(512);  // Buffer de 512 bytes pour les messages JSON

  mqttInitialized = true;
  Serial.println("[MQTT] Client MQTT initialisé");

  // Tenter de se connecter immédiatement
  lastReconnectAttempt = 0;  // Forcer la tentative de connexion
}

/**
 * Mettre à jour le client MQTT
 * À appeler dans loop() pour gérer la connexion et la réception des messages
 */
void updateMQTT() {
  if (!mqttInitialized || !isWiFiConnected()) {
    return;
  }

  // Si connecté, traiter les messages
  if (mqttClient.connected()) {
    mqttClient.loop();
  } else {
    // Tenter de se reconnecter
    unsigned long now = millis();
    if (now - lastReconnectAttempt >= MQTT_RECONNECT_DELAY) {
      lastReconnectAttempt = now;
      
      Serial.println("[MQTT] Tentative de reconnexion...");
      if (connectMQTT()) {
        Serial.println("[MQTT] Reconnexion réussie");
      } else {
        Serial.println("[MQTT] Échec de la reconnexion, nouvelle tentative dans 5 secondes");
      }
    }
  }
}

/**
 * Vérifier si MQTT est connecté
 */
bool isMQTTConnected() {
  return mqttClient.connected();
}

/**
 * Obtenir le Kidoo ID
 */
String getKidooId() {
  return kidooId;
}

/**
 * Définir le Kidoo ID
 * Doit être appelé avant initMQTT()
 */
void setKidooId(const String& id) {
  kidooId = id;
  Serial.print("[MQTT] Kidoo ID défini: ");
  Serial.println(kidooId);
}
