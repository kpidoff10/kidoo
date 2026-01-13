#include "config_manager.h"
#include "sd_manager.h"
#include <ArduinoJson.h>

// Variables de configuration en mémoire
static String configWiFiSSID = "";
static String configWiFiPassword = "";
static uint8_t configBrightness = 100; // Valeur par défaut 100% (255 en valeur FastLED)
const uint8_t MIN_BRIGHTNESS = 10; // Luminosité minimale (10%)
const uint8_t MAX_BRIGHTNESS = 100; // Luminosité maximale (100%)

static unsigned long configSleepTimeout = 30000; // Valeur par défaut 30 secondes
const unsigned long MIN_SLEEP_TIMEOUT = 5000;   // Minimum 5 secondes
const unsigned long MAX_SLEEP_TIMEOUT = 300000; // Maximum 5 minutes (300 secondes)

// Fonction pour sauvegarder la configuration globale du Kidoo sur la carte SD
bool saveKidooConfigToSD() {
  Serial.println("[CONFIG] Tentative de sauvegarde de la configuration...");
  
  if (!isSDCardAvailable()) {
    Serial.println("[CONFIG] ERREUR: Carte SD non disponible, impossible de sauvegarder la configuration");
    return false;
  }

  Serial.println("[CONFIG] Carte SD disponible, creation du JSON...");

  // Créer le document JSON
  JsonDocument doc;
  
  // Section WiFi
  JsonObject wifiObj = doc["wifi"].to<JsonObject>();
  wifiObj["ssid"] = configWiFiSSID;
  wifiObj["password"] = configWiFiPassword;
  
  Serial.print("[CONFIG] SSID a sauvegarder: ");
  Serial.println(configWiFiSSID);
  Serial.print("[CONFIG] Password a sauvegarder: ");
  Serial.println(configWiFiPassword.length() > 0 ? "***" : "(vide)");
  
  // Section LEDs
  JsonObject ledsObj = doc["leds"].to<JsonObject>();
  ledsObj["brightness"] = configBrightness;
  
  Serial.print("[CONFIG] Luminosite a sauvegarder: ");
  Serial.print(configBrightness);
  Serial.println("%");
  
  // Section Sleep
  JsonObject sleepObj = doc["sleep"].to<JsonObject>();
  sleepObj["timeout"] = configSleepTimeout;
  
  Serial.print("[CONFIG] Timeout sommeil a sauvegarder: ");
  Serial.print(configSleepTimeout);
  Serial.println(" ms");

  // Sérialiser en JSON
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.print("[CONFIG] JSON genere (");
  Serial.print(jsonString.length());
  Serial.println(" bytes):");
  Serial.println(jsonString);

  // Écrire sur la carte SD de manière atomique pour éviter la corruption en cas de coupure
  const char* configPath = "/kidoo_config.json";
  Serial.print("[CONFIG] Ecriture atomique du fichier: ");
  Serial.println(configPath);
  
  bool success = writeSDCardFileAtomic(configPath, (const uint8_t*)jsonString.c_str(), jsonString.length());

  if (success) {
    // Attendre un peu pour s'assurer que l'écriture est terminée
    delay(200);
    
    // Vérifier que le fichier existe bien AVANT de dire que c'est un succès
    if (sdCardFileExists(configPath)) {
      Serial.println("[CONFIG] SUCCES: Configuration Kidoo sauvegardee sur la carte SD");
      Serial.print("[CONFIG] Verification: Le fichier existe bien: ");
      Serial.println(configPath);
      
      // Afficher la taille du fichier pour confirmation
      uint32_t fileSize = getSDCardFileSize(configPath);
      if (fileSize > 0) {
        Serial.print("[CONFIG] Taille du fichier: ");
        Serial.print(fileSize);
        Serial.println(" bytes");
      } else {
        Serial.println("[CONFIG] ATTENTION: Impossible de lire la taille du fichier");
      }
    } else {
      Serial.println("[CONFIG] ERREUR: L'ecriture a semble reussir mais le fichier n'existe pas !");
      Serial.println("[CONFIG] Il y a un probleme avec la carte SD");
      Serial.println("[CONFIG] Verifiez que la carte SD n'est pas en lecture seule");
      success = false; // Considérer comme un échec
    }
  } else {
    Serial.println("[CONFIG] ERREUR: Echec lors de la sauvegarde de la configuration Kidoo");
    Serial.println("[CONFIG] Causes possibles:");
    Serial.println("[CONFIG]   - Carte SD pleine ou presque pleine");
    Serial.println("[CONFIG]   - Probleme d'ecriture sur la carte SD");
    Serial.println("[CONFIG]   - Fichier temporaire ne peut pas etre cree");
    Serial.println("[CONFIG] Verifiez l'espace libre sur la carte SD");
    
    // Tentative de repli : utiliser l'écriture normale (non atomique)
    Serial.println("[CONFIG] Tentative de sauvegarde avec methode normale (non atomique)...");
    if (writeSDCardFile(configPath, (const uint8_t*)jsonString.c_str(), jsonString.length())) {
      Serial.println("[CONFIG] Configuration sauvegardee avec methode normale (non atomique)");
      return true;
    } else {
      Serial.println("[CONFIG] Echec egalement avec la methode normale");
    }
  }

  return success;
}

// Fonction pour charger la configuration globale du Kidoo depuis la carte SD
bool loadKidooConfigFromSD() {
  Serial.println("[CONFIG] Tentative de chargement de la configuration...");
  
  if (!isSDCardAvailable()) {
    Serial.println("[CONFIG] ERREUR: Carte SD non disponible, impossible de charger la configuration");
    return false;
  }

  const char* configPath = "/kidoo_config.json";
  const char* tempPath = "/kidoo_config.json.tmp";
  
  // Nettoyer les fichiers temporaires résiduels (écriture atomique interrompue)
  if (sdCardFileExists(tempPath)) {
    Serial.println("[CONFIG] Nettoyage: Suppression d'un fichier temporaire residuel");
    deleteSDCardFile(tempPath);
  }
  
  Serial.print("[CONFIG] Recherche du fichier: ");
  Serial.println(configPath);
  
  if (!sdCardFileExists(configPath)) {
    Serial.println("[CONFIG] Fichier de configuration Kidoo non trouve sur la carte SD");
    return false;
  }

  Serial.println("[CONFIG] Fichier trouve, lecture en cours...");

  // Lire le fichier (max 1024 bytes pour la config globale)
  uint8_t buffer[1024];
  bool readSuccess = readSDCardFile(configPath, buffer, sizeof(buffer) - 1);
  
  if (!readSuccess) {
    Serial.println("[CONFIG] ERREUR: Echec lors de la lecture du fichier de configuration Kidoo");
    return false;
  }

  // Ajouter le caractère de fin de chaîne
  buffer[sizeof(buffer) - 1] = '\0';
  String jsonString = String((char*)buffer);
  
  Serial.print("[CONFIG] Fichier lu (");
  Serial.print(jsonString.length());
  Serial.println(" bytes):");
  Serial.println(jsonString);

  // Parser le JSON
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, jsonString);

  if (error) {
    Serial.print("[CONFIG] ERREUR: Echec du parsing JSON de la configuration: ");
    Serial.println(error.c_str());
    return false;
  }

  Serial.println("[CONFIG] JSON parse avec succes, extraction des valeurs...");

  // Extraire les valeurs WiFi
  if (doc["wifi"].is<JsonObject>()) {
    JsonObject wifiObj = doc["wifi"];
    configWiFiSSID = wifiObj["ssid"] | "";
    configWiFiPassword = wifiObj["password"] | "";
    Serial.println("[CONFIG] Format moderne detecte (section wifi)");
  } else {
    // Support du format legacy (si le fichier existe mais pas de section wifi)
    configWiFiSSID = doc["ssid"] | "";
    configWiFiPassword = doc["password"] | "";
    Serial.println("[CONFIG] Format legacy detecte (racine)");
  }

  // Extraire les valeurs LEDs
  if (doc["leds"].is<JsonObject>()) {
    JsonObject ledsObj = doc["leds"];
    uint8_t loadedBrightness = ledsObj["brightness"] | 100; // Valeur par défaut 100%
    
    // Valider et ajuster la valeur chargée (min 10%)
    if (loadedBrightness < MIN_BRIGHTNESS) {
      Serial.print("[CONFIG] ATTENTION: Luminosite chargee trop faible (");
      Serial.print(loadedBrightness);
      Serial.print("%), ajustee a ");
      Serial.print(MIN_BRIGHTNESS);
      Serial.println("%");
      loadedBrightness = MIN_BRIGHTNESS;
    }
    if (loadedBrightness > MAX_BRIGHTNESS) {
      Serial.print("[CONFIG] ATTENTION: Luminosite chargee trop elevee (");
      Serial.print(loadedBrightness);
      Serial.print("%), ajustee a ");
      Serial.print(MAX_BRIGHTNESS);
      Serial.println("%");
      loadedBrightness = MAX_BRIGHTNESS;
    }
    
    configBrightness = loadedBrightness;
    Serial.print("[CONFIG] Luminosite chargee: ");
    Serial.print(configBrightness);
    Serial.println("%");
  } else {
    // Si pas de section leds, utiliser la valeur par défaut
    configBrightness = 100;
    Serial.println("[CONFIG] Aucune configuration de luminosite trouvee, utilisation de la valeur par defaut (100%)");
  }

  // Extraire les valeurs Sleep
  if (doc["sleep"].is<JsonObject>()) {
    JsonObject sleepObj = doc["sleep"];
    unsigned long loadedTimeout = sleepObj["timeout"] | 30000; // Valeur par défaut 30 secondes
    
    // Valider et ajuster la valeur chargée
    if (loadedTimeout < MIN_SLEEP_TIMEOUT) {
      Serial.print("[CONFIG] ATTENTION: Timeout sommeil charge trop faible (");
      Serial.print(loadedTimeout);
      Serial.print(" ms), ajuste a ");
      Serial.print(MIN_SLEEP_TIMEOUT);
      Serial.println(" ms");
      loadedTimeout = MIN_SLEEP_TIMEOUT;
    }
    if (loadedTimeout > MAX_SLEEP_TIMEOUT) {
      Serial.print("[CONFIG] ATTENTION: Timeout sommeil charge trop eleve (");
      Serial.print(loadedTimeout);
      Serial.print(" ms), ajuste a ");
      Serial.print(MAX_SLEEP_TIMEOUT);
      Serial.println(" ms");
      loadedTimeout = MAX_SLEEP_TIMEOUT;
    }
    
    configSleepTimeout = loadedTimeout;
    Serial.print("[CONFIG] Timeout sommeil charge: ");
    Serial.print(configSleepTimeout);
    Serial.println(" ms");
  } else {
    // Si pas de section sleep, utiliser la valeur par défaut
    configSleepTimeout = 30000;
    Serial.println("[CONFIG] Aucune configuration de timeout sommeil trouvee, utilisation de la valeur par defaut (30000 ms)");
  }

  Serial.println("[CONFIG] SUCCES: Configuration Kidoo chargee depuis la carte SD");
  if (configWiFiSSID.length() > 0) {
    Serial.print("[CONFIG] WiFi SSID: ");
    Serial.println(configWiFiSSID);
    Serial.print("[CONFIG] WiFi Password: ");
    Serial.println(configWiFiPassword.length() > 0 ? "***" : "(vide)");
  } else {
    Serial.println("[CONFIG] ATTENTION: SSID vide dans la configuration");
  }
  
  return true;
}

// Fonction pour obtenir le SSID WiFi depuis la configuration
String getConfigWiFiSSID() {
  return configWiFiSSID;
}

// Fonction pour obtenir le mot de passe WiFi depuis la configuration
String getConfigWiFiPassword() {
  return configWiFiPassword;
}

// Fonction pour définir le SSID WiFi dans la configuration
void setConfigWiFiSSID(const char* ssid) {
  configWiFiSSID = String(ssid);
}

// Fonction pour définir le mot de passe WiFi dans la configuration
void setConfigWiFiPassword(const char* password) {
  configWiFiPassword = String(password);
}

// Fonction pour obtenir la luminosité depuis la configuration (0-100)
uint8_t getConfigBrightness() {
  return configBrightness;
}

// Fonction pour définir la luminosité dans la configuration (10-100)
void setConfigBrightness(uint8_t brightness) {
  // S'assurer que la valeur est entre 10 et 100
  if (brightness < MIN_BRIGHTNESS) {
    brightness = MIN_BRIGHTNESS;
  }
  if (brightness > MAX_BRIGHTNESS) {
    brightness = MAX_BRIGHTNESS;
  }
  configBrightness = brightness;
}

// Fonction pour obtenir le timeout de sommeil depuis la configuration (en millisecondes)
unsigned long getConfigSleepTimeout() {
  return configSleepTimeout;
}

// Fonction pour définir le timeout de sommeil dans la configuration (5000-300000 ms)
void setConfigSleepTimeout(unsigned long timeout) {
  // S'assurer que la valeur est entre MIN_SLEEP_TIMEOUT et MAX_SLEEP_TIMEOUT
  if (timeout < MIN_SLEEP_TIMEOUT) {
    timeout = MIN_SLEEP_TIMEOUT;
  }
  if (timeout > MAX_SLEEP_TIMEOUT) {
    timeout = MAX_SLEEP_TIMEOUT;
  }
  configSleepTimeout = timeout;
}