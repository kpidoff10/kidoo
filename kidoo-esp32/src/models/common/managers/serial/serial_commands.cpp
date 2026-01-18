#include "serial_commands.h"
#include "serial_manager.h"
#include "../led/led_manager.h"
#include "../init/init_manager.h"
#include "../sd/sd_manager.h"
#include "../ble/ble_manager.h"
#include "../wifi/wifi_manager.h"
#include "../pubnub/pubnub_manager.h"
#include "../../../model_serial_commands.h"
#include "../../../model_pubnub_routes.h"
#include <Arduino.h>

// Variables statiques
bool SerialCommands::initialized = false;
String SerialCommands::inputBuffer = "";

void SerialCommands::init() {
  if (initialized) {
    return;
  }
  
  initialized = true;
  inputBuffer = "";
  
  Serial.println("[SERIAL] Systeme de commandes initialise");
  Serial.println("[SERIAL] Tapez 'help' pour voir les commandes disponibles");
}

void SerialCommands::update() {
  if (!Serial.available()) {
    return;
  }
  
  // Lire les caractères disponibles
  while (Serial.available()) {
    char c = Serial.read();
    
    if (c == '\n' || c == '\r') {
      if (inputBuffer.length() > 0) {
        processCommand(inputBuffer);
        inputBuffer = "";
      }
    } else if (c == '\b' || c == 127) {
      // Backspace
      if (inputBuffer.length() > 0) {
        inputBuffer.remove(inputBuffer.length() - 1);
        Serial.print("\b \b");
      }
    } else if (c >= 32 && c <= 126) {
      // Caractère imprimable
      inputBuffer += c;
      Serial.print(c);
    }
  }
}

void SerialCommands::processCommand(const String& command) {
  if (command.length() == 0) {
    return;
  }
  
  Serial.println(); // Nouvelle ligne après la commande
  
  // Séparer la commande et les arguments
  int spaceIndex = command.indexOf(' ');
  String cmd = command;
  String args = "";
  
  if (spaceIndex > 0) {
    cmd = command.substring(0, spaceIndex);
    args = command.substring(spaceIndex + 1);
  }
  
  cmd.toLowerCase();
  cmd.trim();
  args.trim();
  
  // Traiter les commandes communes
  if (cmd == "help" || cmd == "?") {
    cmdHelp();
  } else if (cmd == "reboot" || cmd == "restart") {
    cmdReboot(args);
  } else if (cmd == "info" || cmd == "system") {
    cmdInfo();
  } else if (cmd == "memory" || cmd == "mem") {
    cmdMemory();
  } else if (cmd == "clear" || cmd == "cls") {
    cmdClear();
  } else if (cmd == "brightness" || cmd == "bright") {
    cmdBrightness(args);
  } else if (cmd == "sleep" || cmd == "sleepmode") {
    cmdSleep(args);
  } else if (cmd == "ble" || cmd == "bluetooth" || cmd == "ble-status") {
    cmdBLE();
  } else if (cmd == "wifi" || cmd == "wifi-status") {
    cmdWiFi();
  } else if (cmd == "wifi-set") {
    cmdWiFiSet(args);
  } else if (cmd == "wifi-connect") {
    cmdWiFiConnect();
  } else if (cmd == "wifi-disconnect") {
    cmdWiFiDisconnect();
  } else if (cmd == "pubnub" || cmd == "pubnub-status") {
    cmdPubNub();
  } else if (cmd == "pubnub-connect") {
    cmdPubNubConnect();
  } else if (cmd == "pubnub-disconnect") {
    cmdPubNubDisconnect();
  } else if (cmd == "pubnub-publish" || cmd == "pubnub-pub") {
    cmdPubNubPublish(args);
  } else if (cmd == "pubnub-routes" || cmd == "routes") {
    cmdPubNubRoutes();
  } else {
    // Essayer les commandes spécifiques au modèle
    if (!ModelSerialCommands::processCommand(command)) {
      // Commande non reconnue
      Serial.print("[SERIAL] Commande inconnue: ");
      Serial.println(cmd);
      Serial.println("[SERIAL] Tapez 'help' pour voir les commandes disponibles");
    }
  }
}

void SerialCommands::printHelp() {
  Serial.println("");
  Serial.println("========================================");
  Serial.println("     COMMANDES SERIAL DISPONIBLES");
  Serial.println("========================================");
  Serial.println("  help, ?          - Afficher cette aide");
  Serial.println("  reboot [ms]      - Redemarrer l'ESP32 (optionnel: delai en ms)");
  Serial.println("  info, system     - Afficher les informations systeme");
  Serial.println("  memory, mem      - Afficher l'utilisation de la memoire");
  Serial.println("  clear, cls       - Effacer l'ecran");
  Serial.println("  brightness [%]   - Afficher ou definir la luminosite (0-100%)");
  Serial.println("  sleep [timeout]  - Afficher ou definir le timeout sleep mode (ms, min: 5000, 0=desactive)");
  Serial.println("  ble, bluetooth   - Afficher l'etat de connexion BLE");
  Serial.println("  wifi             - Afficher l'etat de connexion WiFi");
  Serial.println("  wifi-set <ssid> [password] - Configurer le WiFi");
  Serial.println("  wifi-connect     - Se connecter au WiFi configure");
  Serial.println("  wifi-disconnect  - Se deconnecter du WiFi");
  Serial.println("  pubnub           - Afficher l'etat PubNub");
  Serial.println("  pubnub-connect   - Se connecter a PubNub");
  Serial.println("  pubnub-disconnect - Se deconnecter de PubNub");
  Serial.println("  pubnub-pub <msg> - Publier un message");
  Serial.println("  pubnub-routes    - Afficher les routes PubNub disponibles");
  Serial.println("========================================");
  
  // Afficher l'aide des commandes spécifiques au modèle
  ModelSerialCommands::printHelp();
}

void SerialCommands::cmdHelp() {
  printHelp();
}

void SerialCommands::cmdReboot(const String& args) {
  uint32_t delayMs = 0;
  
  if (args.length() > 0) {
    delayMs = args.toInt();
  }
  
  SerialManager::reboot(delayMs);
}

void SerialCommands::cmdInfo() {
  SerialManager::printSystemInfo();
}

void SerialCommands::cmdMemory() {
  SerialManager::printMemoryInfo();
}

void SerialCommands::cmdClear() {
  // Effacer l'écran (séquence ANSI)
  Serial.print("\033[2J");  // Effacer l'écran
  Serial.print("\033[H");   // Curseur en haut à gauche
}

void SerialCommands::cmdBrightness(const String& args) {
  if (!LEDManager::isInitialized()) {
    Serial.println("[SERIAL] LED Manager non initialise");
    return;
  }
  
  if (args.length() == 0) {
    // Afficher la luminosité actuelle en %
    uint8_t brightness = LEDManager::getCurrentBrightness();
    uint8_t percent = (brightness * 100) / 255;
    Serial.print("[SERIAL] Luminosite actuelle: ");
    Serial.print(percent);
    Serial.println("%");
  } else {
    // Définir la luminosité en %
    int percent = args.toInt();
    
    if (percent < 0 || percent > 100) {
      Serial.println("[SERIAL] Erreur: La luminosite doit etre entre 0 et 100%");
      return;
    }
    
    // Convertir % en valeur brute (0-255)
    uint8_t brightness = (uint8_t)((percent * 255) / 100);
    
    if (LEDManager::setBrightness(brightness)) {
      // Mettre à jour et sauvegarder la configuration
      SDConfig config = InitManager::getConfig();
      config.led_brightness = brightness;
      
      if (SDManager::isAvailable() && InitManager::updateConfig(config)) {
        Serial.print("[SERIAL] Luminosite definie a: ");
        Serial.print(percent);
        Serial.println("% (sauvegarde dans config.json)");
      } else {
        Serial.print("[SERIAL] Luminosite definie a: ");
        Serial.print(percent);
        Serial.println("% (sauvegarde echec)");
      }
    } else {
      Serial.println("[SERIAL] Erreur: Impossible de definir la luminosite");
    }
  }
}

void SerialCommands::cmdSleep(const String& args) {
  if (!LEDManager::isInitialized()) {
    Serial.println("[SERIAL] LED Manager non initialise");
    return;
  }
  
  // Pour le sleep mode, on doit accéder à la config via InitManager
  // car le timeout est chargé depuis la config au démarrage
  // Pour l'instant, on peut juste consulter via la config
  // et modifier en runtime sans sauvegarder
  
  if (args.length() == 0) {
    // Afficher le timeout actuel du sleep mode
    const SDConfig& config = InitManager::getConfig();
    uint32_t timeout = config.sleep_timeout_ms;
    
    Serial.print("[SERIAL] Sleep mode timeout: ");
    if (timeout == 0) {
      Serial.println("Desactive");
    } else {
      Serial.print(timeout);
      Serial.print(" ms (");
      Serial.print(timeout / 1000.0f, 1);
      Serial.println(" s)");
    }
    
    bool isSleeping = LEDManager::getSleepState();
    Serial.print("[SERIAL] Sleep mode actuel: ");
    Serial.println(isSleeping ? "Actif (LEDs eteintes)" : "Inactif (LEDs actives)");
  } else {
    // Définir le timeout du sleep mode
    // Note: Ceci modifie seulement en runtime, pas dans la config
    int timeout = args.toInt();
    
    if (timeout < 0) {
      Serial.println("[SERIAL] Erreur: Le timeout ne peut pas etre negatif");
      return;
    }
    
    if (timeout > 0 && timeout < 5000) {
      Serial.println("[SERIAL] Erreur: Le timeout minimum est de 5000 ms (5 secondes)");
      Serial.println("[SERIAL] Utilisez 0 pour desactiver le sleep mode");
      return;
    }
    
    // Mettre à jour le sleep timeout dans la configuration
    SDConfig config = InitManager::getConfig();
    config.sleep_timeout_ms = (uint32_t)timeout;
    
    if (SDManager::isAvailable() && InitManager::updateConfig(config)) {
      // Mettre à jour le timeout dans LEDManager
      // Note: LEDManager lit sleepTimeoutMs depuis InitManager::getConfig() au démarrage
      // Pour le runtime, on devrait ajouter une méthode setSleepTimeout() dans LEDManager
      // Pour l'instant, il faudra redémarrer pour que le changement prenne effet
      Serial.print("[SERIAL] Sleep timeout defini a: ");
      if (timeout == 0) {
        Serial.println("Desactive (sauvegarde dans config.json)");
      } else {
        Serial.print(timeout);
        Serial.println(" ms (sauvegarde dans config.json)");
        Serial.println("[SERIAL] Note: Redemarrez pour appliquer le nouveau timeout");
      }
    } else {
      Serial.println("[SERIAL] Erreur: Impossible de sauvegarder le sleep timeout");
    }
  }
}

void SerialCommands::cmdBLE() {
  Serial.println("");
  Serial.println("========== Etat BLE ==========");
  
#ifndef HAS_BLE
  Serial.println("[BLE] BLE non disponible sur ce modele");
  Serial.println("==============================");
  return;
#else
  // Vérifier l'initialisation
  if (!BLEManager::isInitialized()) {
    Serial.println("[BLE] BLE non initialise");
    Serial.println("==============================");
    return;
  }
  
  // Vérifier la disponibilité
  if (!BLEManager::isAvailable()) {
    Serial.println("[BLE] BLE non disponible");
    Serial.println("==============================");
    return;
  }
  
  // Afficher l'état de connexion
  bool connected = BLEManager::isConnected();
  Serial.print("[BLE] Connexion: ");
  if (connected) {
    Serial.println("CONNECTE");
  } else {
    Serial.println("NON CONNECTE");
  }
  
  // Afficher le statut depuis InitManager
  InitStatus bleStatus = InitManager::getComponentStatus("ble");
  Serial.print("[BLE] Statut initialisation: ");
  switch (bleStatus) {
    case INIT_NOT_STARTED:
      Serial.println("Non demarre");
      break;
    case INIT_IN_PROGRESS:
      Serial.println("En cours");
      break;
    case INIT_SUCCESS:
      Serial.println("OK");
      break;
    case INIT_FAILED:
      Serial.println("ERREUR");
      break;
  }
  
  Serial.println("==============================");
#endif
}

void SerialCommands::cmdWiFi() {
  WiFiManager::printInfo();
}

void SerialCommands::cmdWiFiSet(const String& args) {
#ifndef HAS_WIFI
  Serial.println("[WIFI] WiFi non disponible sur ce modele");
  return;
#else
  if (args.length() == 0) {
    Serial.println("[WIFI] Usage: wifi-set <ssid> [password]");
    Serial.println("[WIFI] Exemple: wifi-set MonReseau MonMotDePasse");
    Serial.println("[WIFI] Note: Si pas de mot de passe, laissez vide");
    return;
  }
  
  // Séparer SSID et mot de passe
  String ssid = "";
  String password = "";
  
  int spaceIndex = args.indexOf(' ');
  if (spaceIndex > 0) {
    ssid = args.substring(0, spaceIndex);
    password = args.substring(spaceIndex + 1);
    password.trim();
  } else {
    ssid = args;
  }
  
  ssid.trim();
  
  if (ssid.length() == 0) {
    Serial.println("[WIFI] Erreur: SSID invalide");
    return;
  }
  
  if (ssid.length() >= 64) {
    Serial.println("[WIFI] Erreur: SSID trop long (max 63 caracteres)");
    return;
  }
  
  if (password.length() >= 64) {
    Serial.println("[WIFI] Erreur: Mot de passe trop long (max 63 caracteres)");
    return;
  }
  
  // Mettre à jour la configuration
  SDConfig config = InitManager::getConfig();
  strncpy(config.wifi_ssid, ssid.c_str(), sizeof(config.wifi_ssid) - 1);
  config.wifi_ssid[sizeof(config.wifi_ssid) - 1] = '\0';
  strncpy(config.wifi_password, password.c_str(), sizeof(config.wifi_password) - 1);
  config.wifi_password[sizeof(config.wifi_password) - 1] = '\0';
  
  // Sauvegarder
  if (SDManager::isAvailable() && InitManager::updateConfig(config)) {
    Serial.println("[WIFI] Configuration WiFi sauvegardee:");
    Serial.print("[WIFI]   SSID: ");
    Serial.println(ssid);
    Serial.print("[WIFI]   Password: ");
    if (password.length() > 0) {
      Serial.println("********");
    } else {
      Serial.println("(aucun)");
    }
    Serial.println("[WIFI] Utilisez 'wifi-connect' pour vous connecter");
  } else {
    Serial.println("[WIFI] Erreur: Impossible de sauvegarder la configuration");
  }
#endif
}

void SerialCommands::cmdWiFiConnect() {
#ifndef HAS_WIFI
  Serial.println("[WIFI] WiFi non disponible sur ce modele");
  return;
#else
  if (!WiFiManager::isAvailable()) {
    Serial.println("[WIFI] WiFi non initialise");
    return;
  }
  
  // Vérifier si déjà connecté
  if (WiFiManager::isConnected()) {
    Serial.println("[WIFI] Deja connecte. Deconnexion...");
    WiFiManager::disconnect();
    delay(500);
  }
  
  // Se connecter avec la config
  Serial.println("[WIFI] Tentative de connexion...");
  if (WiFiManager::connect()) {
    Serial.println("[WIFI] Connexion reussie!");
  } else {
    Serial.println("[WIFI] Echec de connexion");
  }
#endif
}

void SerialCommands::cmdWiFiDisconnect() {
#ifndef HAS_WIFI
  Serial.println("[WIFI] WiFi non disponible sur ce modele");
  return;
#else
  if (!WiFiManager::isAvailable()) {
    Serial.println("[WIFI] WiFi non initialise");
    return;
  }
  
  if (!WiFiManager::isConnected()) {
    Serial.println("[WIFI] Pas connecte");
    return;
  }
  
  WiFiManager::disconnect();
  Serial.println("[WIFI] Deconnecte");
#endif
}

void SerialCommands::cmdPubNub() {
  PubNubManager::printInfo();
}

void SerialCommands::cmdPubNubConnect() {
#ifndef HAS_PUBNUB
  Serial.println("[PUBNUB] PubNub non disponible sur ce modele");
  return;
#else
  if (!PubNubManager::isInitialized()) {
    // Tenter d'initialiser
    if (!PubNubManager::init()) {
      Serial.println("[PUBNUB] Echec initialisation");
      return;
    }
  }
  
  // Vérifier si déjà connecté
  if (PubNubManager::isConnected()) {
    Serial.println("[PUBNUB] Deja connecte");
    return;
  }
  
  // Se connecter
  Serial.println("[PUBNUB] Tentative de connexion...");
  if (PubNubManager::connect()) {
    Serial.println("[PUBNUB] Connexion reussie!");
  } else {
    Serial.println("[PUBNUB] Echec de connexion");
  }
#endif
}

void SerialCommands::cmdPubNubDisconnect() {
#ifndef HAS_PUBNUB
  Serial.println("[PUBNUB] PubNub non disponible sur ce modele");
  return;
#else
  if (!PubNubManager::isConnected()) {
    Serial.println("[PUBNUB] Pas connecte");
    return;
  }
  
  PubNubManager::disconnect();
  Serial.println("[PUBNUB] Deconnecte");
#endif
}

void SerialCommands::cmdPubNubPublish(const String& args) {
#ifndef HAS_PUBNUB
  Serial.println("[PUBNUB] PubNub non disponible sur ce modele");
  return;
#else
  if (!PubNubManager::isConnected()) {
    Serial.println("[PUBNUB] Non connecte");
    return;
  }
  
  if (args.length() == 0) {
    // Publier le statut par défaut
    if (PubNubManager::publishStatus()) {
      Serial.println("[PUBNUB] Statut publie");
    } else {
      Serial.println("[PUBNUB] Echec publication");
    }
  } else {
    // Publier le message
    if (PubNubManager::publish(args.c_str())) {
      Serial.print("[PUBNUB] Message publie: ");
      Serial.println(args);
    } else {
      Serial.println("[PUBNUB] Echec publication");
    }
  }
#endif
}

void SerialCommands::cmdPubNubRoutes() {
#ifndef HAS_PUBNUB
  Serial.println("[PUBNUB] PubNub non disponible sur ce modele");
  return;
#else
  ModelPubNubRoutes::printRoutes();
#endif
}
