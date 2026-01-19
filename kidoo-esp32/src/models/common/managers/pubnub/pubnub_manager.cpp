#include "pubnub_manager.h"
#include "../../../model_config.h"

#ifdef HAS_PUBNUB

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "../wifi/wifi_manager.h"
#include "../serial/serial_commands.h"
#include "../init/init_manager.h"
#include "../../../model_pubnub_routes.h"

// Variables statiques
bool PubNubManager::initialized = false;
bool PubNubManager::connected = false;
bool PubNubManager::threadRunning = false;
char PubNubManager::channel[64] = "";
char PubNubManager::timeToken[32] = "0";
TaskHandle_t PubNubManager::taskHandle = nullptr;
QueueHandle_t PubNubManager::publishQueue = nullptr;

// URLs PubNub
static const char* PUBNUB_ORIGIN = "ps.pndsn.com";

// Structure pour les messages à publier
struct PublishMessage {
  char message[256];
};

bool PubNubManager::init() {
  if (initialized) {
    return true;
  }
  
  Serial.println("[PUBNUB] Initialisation...");
  
  // Vérifier que les clés sont configurées
  if (strlen(DEFAULT_PUBNUB_SUBSCRIBE_KEY) == 0) {
    Serial.println("[PUBNUB] Subscribe key non configuree dans default_config.h");
    return false;
  }
  
  // Construire le nom du channel basé sur l'adresse MAC (unique par appareil)
  uint8_t mac[6];
  WiFi.macAddress(mac);
  snprintf(channel, sizeof(channel), "kidoo-%02X%02X%02X%02X%02X%02X",
    mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  
  // Créer la file d'attente pour les publications
  publishQueue = xQueueCreate(PUBLISH_QUEUE_SIZE, sizeof(PublishMessage));
  if (publishQueue == nullptr) {
    Serial.println("[PUBNUB] Erreur creation queue");
    return false;
  }
  
  initialized = true;
  Serial.println("[PUBNUB] Initialisation OK");
  Serial.print("[PUBNUB] Channel: ");
  Serial.println(channel);
  
  return true;
}

bool PubNubManager::connect() {
  if (!initialized) {
    Serial.println("[PUBNUB] Non initialise");
    return false;
  }
  
  // Vérifier que le WiFi est connecté
  if (!WiFiManager::isConnected()) {
    Serial.println("[PUBNUB] WiFi non connecte");
    return false;
  }
  
  // Si le thread tourne déjà, on est déjà connecté
  if (threadRunning) {
    Serial.println("[PUBNUB] Deja connecte");
    return true;
  }
  
  Serial.println("[PUBNUB] Demarrage du thread...");
  
  // Reset le timetoken pour commencer fresh
  strcpy(timeToken, "0");
  
  // Créer le thread FreeRTOS
  BaseType_t result = xTaskCreatePinnedToCore(
    threadFunction,     // Fonction du thread
    "PubNubTask",       // Nom du thread
    STACK_SIZE,         // Taille de la stack
    nullptr,            // Paramètre
    TASK_PRIORITY,      // Priorité
    &taskHandle,        // Handle
    0                   // Core 0 (laisser Core 1 pour WiFi/BLE)
  );
  
  if (result != pdPASS) {
    Serial.println("[PUBNUB] Erreur creation thread");
    return false;
  }
  
  threadRunning = true;
  connected = true;
  Serial.println("[PUBNUB] Thread demarre!");
  
  // Publier le statut "online"
  publishStatus();
  
  return true;
}

void PubNubManager::disconnect() {
  if (!initialized) {
    return;
  }
  
  // Arrêter le thread
  if (taskHandle != nullptr) {
    threadRunning = false;
    vTaskDelay(pdMS_TO_TICKS(100)); // Laisser le temps au thread de s'arrêter
    vTaskDelete(taskHandle);
    taskHandle = nullptr;
  }
  
  connected = false;
  strcpy(timeToken, "0");
  Serial.println("[PUBNUB] Deconnecte");
}

bool PubNubManager::isConnected() {
  return initialized && connected && threadRunning && WiFiManager::isConnected();
}

bool PubNubManager::isInitialized() {
  return initialized;
}

bool PubNubManager::isAvailable() {
  return initialized && 
         WiFiManager::isConnected() && 
         strlen(DEFAULT_PUBNUB_SUBSCRIBE_KEY) > 0;
}

void PubNubManager::loop() {
  // Le thread gère tout, cette fonction ne fait rien
  // Gardée pour compatibilité avec le code existant
}

void PubNubManager::threadFunction(void* parameter) {
  Serial.println("[PUBNUB] Thread actif");
  
  while (threadRunning) {
    // Vérifier la connexion WiFi
    if (!WiFiManager::isConnected()) {
      if (connected) {
        connected = false;
        Serial.println("[PUBNUB] WiFi perdu");
      }
      vTaskDelay(pdMS_TO_TICKS(1000));
      continue;
    }
    
    // Reconnecter si nécessaire
    if (!connected) {
      connected = true;
      strcpy(timeToken, "0");
      Serial.println("[PUBNUB] WiFi retrouve, reconnexion...");
    }
    
    // Traiter les messages à publier en attente
    PublishMessage pubMsg;
    while (xQueueReceive(publishQueue, &pubMsg, 0) == pdTRUE) {
      publishInternal(pubMsg.message);
    }
    
    // Subscribe (long polling)
    subscribe();
    
    // Petit délai entre les polls
    vTaskDelay(pdMS_TO_TICKS(SUBSCRIBE_INTERVAL_MS));
  }
  
  Serial.println("[PUBNUB] Thread arrete");
  vTaskDelete(nullptr);
}

bool PubNubManager::subscribe() {
  if (!WiFiManager::isConnected()) {
    return false;
  }
  
  HTTPClient http;
  
  // Construire l'URL de subscribe
  char url[256];
  snprintf(url, sizeof(url),
    "http://%s/subscribe/%s/%s/0/%s",
    PUBNUB_ORIGIN,
    DEFAULT_PUBNUB_SUBSCRIBE_KEY,
    channel,
    timeToken
  );
  
  http.begin(url);
  http.setConnectTimeout(2000);
  http.setTimeout(5000); // 5 secondes - PubNub garde la connexion ouverte
  
  int httpCode = http.GET();
  
  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    http.end();
    processMessages(payload.c_str());
    return true;
  } else {
    http.end();
    return false;
  }
}

void PubNubManager::processMessages(const char* json) {
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, json);
  
  if (error) {
    return;
  }
  
  // Extraire le nouveau timetoken
  if (doc[1].is<const char*>()) {
    strncpy(timeToken, doc[1].as<const char*>(), sizeof(timeToken) - 1);
    timeToken[sizeof(timeToken) - 1] = '\0';
  }
  
  // Traiter les messages
  JsonArray messages = doc[0].as<JsonArray>();
  for (JsonVariant msg : messages) {
    if (msg.is<const char*>()) {
      // Message texte simple = commande série
      executeCommand(msg.as<const char*>());
    } else if (msg.is<JsonObject>()) {
      JsonObject obj = msg.as<JsonObject>();
      
      // Ignorer nos propres messages (status, response, type)
      if (obj["status"].is<const char*>() || obj["response"].is<const char*>() || obj["type"].is<const char*>()) {
        continue;
      }
      
      // Si c'est une action, utiliser les routes
      if (obj["action"].is<const char*>()) {
        ModelPubNubRoutes::processMessage(obj);
      }
      // Si c'est une commande série (legacy)
      else if (obj["cmd"].is<const char*>()) {
        executeCommand(obj["cmd"].as<const char*>());
      }
    }
  }
}

void PubNubManager::executeCommand(const char* command) {
  // Ignorer les messages vides
  if (command == nullptr || strlen(command) == 0) {
    return;
  }
  
  // Ignorer nos propres confirmations (évite la boucle infinie)
  // Les confirmations sont des JSON avec "response"
  if (strstr(command, "\"response\"") != nullptr) {
    return;
  }
  
  // Ignorer les messages de statut (évite la boucle infinie)
  if (strstr(command, "\"status\"") != nullptr) {
    return;
  }
  
  Serial.print("[PUBNUB] Commande recue: ");
  Serial.println(command);
  
  // Exécuter via SerialCommands
  SerialCommands::processCommand(String(command));
  
  // Note: On ne publie plus de confirmation pour éviter les boucles
  // Si besoin, utiliser un channel séparé pour les réponses
}

bool PubNubManager::publish(const char* message) {
  if (!initialized || publishQueue == nullptr) {
    return false;
  }
  
  // Ajouter à la file d'attente (thread-safe)
  PublishMessage pubMsg;
  strncpy(pubMsg.message, message, sizeof(pubMsg.message) - 1);
  pubMsg.message[sizeof(pubMsg.message) - 1] = '\0';
  
  if (xQueueSend(publishQueue, &pubMsg, 0) != pdTRUE) {
    Serial.println("[PUBNUB] Queue pleine, message ignore");
    return false;
  }
  
  return true;
}

bool PubNubManager::publishInternal(const char* message) {
  if (!WiFiManager::isConnected()) {
    return false;
  }
  
  if (strlen(DEFAULT_PUBNUB_PUBLISH_KEY) == 0) {
    return false;
  }
  
  HTTPClient http;
  
  // Encoder le message pour l'URL
  String encodedMessage;
  
  if (message[0] == '{' || message[0] == '[') {
    encodedMessage = message;
  } else {
    encodedMessage = "\"";
    encodedMessage += message;
    encodedMessage += "\"";
  }
  
  // URL encode
  encodedMessage.replace("\"", "%22");
  encodedMessage.replace(" ", "%20");
  encodedMessage.replace("{", "%7B");
  encodedMessage.replace("}", "%7D");
  encodedMessage.replace(":", "%3A");
  encodedMessage.replace(",", "%2C");
  
  char url[512];
  snprintf(url, sizeof(url),
    "http://%s/publish/%s/%s/0/%s/0/%s",
    PUBNUB_ORIGIN,
    DEFAULT_PUBNUB_PUBLISH_KEY,
    DEFAULT_PUBNUB_SUBSCRIBE_KEY,
    channel,
    encodedMessage.c_str()
  );
  
  http.begin(url);
  http.setTimeout(3000);
  
  int httpCode = http.GET();
  http.end();
  
  if (httpCode == HTTP_CODE_OK) {
    return true;
  } else {
    Serial.print("[PUBNUB] Erreur publish: ");
    Serial.println(httpCode);
    return false;
  }
}

bool PubNubManager::publishStatus() {
  char statusJson[128];
  snprintf(statusJson, sizeof(statusJson),
    "{\"status\":\"online\",\"device\":\"%s\",\"ip\":\"%s\"}",
    DEFAULT_DEVICE_NAME,
    WiFiManager::getLocalIP().c_str()
  );
  
  return publish(statusJson);
}

void PubNubManager::printInfo() {
  Serial.println("");
  Serial.println("========== Etat PubNub ==========");
  
  Serial.print("[PUBNUB] Initialise: ");
  Serial.println(initialized ? "Oui" : "Non");
  
  if (!initialized) {
    Serial.println("=================================");
    return;
  }
  
  Serial.print("[PUBNUB] Channel: ");
  Serial.println(channel);
  
  Serial.print("[PUBNUB] Thread actif: ");
  Serial.println(threadRunning ? "Oui" : "Non");
  
  Serial.print("[PUBNUB] Connecte: ");
  Serial.println(connected ? "Oui" : "Non");
  
  Serial.print("[PUBNUB] TimeToken: ");
  Serial.println(timeToken);
  
  // Afficher la mémoire libre du thread
  if (taskHandle != nullptr) {
    Serial.print("[PUBNUB] Stack libre: ");
    Serial.print(uxTaskGetStackHighWaterMark(taskHandle));
    Serial.println(" bytes");
  }
  
  Serial.println("=================================");
}

const char* PubNubManager::getChannel() {
  return channel;
}

#else // !HAS_PUBNUB

// Implémentation vide si PubNub n'est pas disponible
bool PubNubManager::init() { return false; }
bool PubNubManager::connect() { return false; }
void PubNubManager::disconnect() {}
bool PubNubManager::isConnected() { return false; }
bool PubNubManager::isInitialized() { return false; }
bool PubNubManager::isAvailable() { return false; }
void PubNubManager::loop() {}
bool PubNubManager::publish(const char*) { return false; }
bool PubNubManager::publishStatus() { return false; }
void PubNubManager::printInfo() {
  Serial.println("[PUBNUB] PubNub non disponible sur ce modele");
}
const char* PubNubManager::getChannel() { return ""; }

// Variables statiques
bool PubNubManager::initialized = false;
bool PubNubManager::connected = false;
bool PubNubManager::threadRunning = false;
char PubNubManager::channel[64] = "";
char PubNubManager::timeToken[32] = "0";
TaskHandle_t PubNubManager::taskHandle = nullptr;
QueueHandle_t PubNubManager::publishQueue = nullptr;

#endif // HAS_PUBNUB
