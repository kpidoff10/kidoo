#include <Arduino.h>

// Core
#include "core/boot_manager.h"
#include "core/state_manager.h"
#include "core/mode_manager.h"
#include "core/task_manager.h"

// Managers
#include "managers/wifi_manager.h"
#include "managers/ble_manager.h"
#include "managers/sd_manager.h"
#include "managers/nfc_manager.h"

// Effects
#include "effects/led_effects.h"

void setup() {
  // Effectuer toutes les initialisations au démarrage
  BootManager::boot();
}

// Fonction pour traiter les commandes série
void processSerialCommands() {
  static String serialBuffer = "";
  
  // Lire les données disponibles sur le port série
  while (Serial.available() > 0) {
    char c = Serial.read();
    
    // Si c'est un retour à la ligne ou un saut de ligne, traiter la commande
    if (c == '\n' || c == '\r') {
      if (serialBuffer.length() > 0) {
        serialBuffer.trim();
        serialBuffer.toLowerCase();
        
        Serial.print("[SERIAL] Commande recue: ");
        Serial.println(serialBuffer);
        
        // Traiter les commandes
        if (serialBuffer == "restart" || serialBuffer == "reset" || serialBuffer == "reboot") {
          Serial.println("[SERIAL] Redemarrage de l'ESP32...");
          delay(100); // Petit délai pour laisser le temps d'envoyer la réponse
          ESP.restart();
        } else if (serialBuffer == "help" || serialBuffer == "?") {
          Serial.println("[SERIAL] Commandes disponibles:");
          Serial.println("  restart / reset / reboot - Redemarrer l'ESP32");
          Serial.println("  sdcard / sd - Reinitialiser la carte SD");
          Serial.println("  nfc read - Lire un tag NFC");
          Serial.println("  nfc write - Ecrire un tag NFC de test");
          Serial.println("  nfc test - Ecrire un tag NFC de test (alias)");
          Serial.println("  help / ? - Afficher cette aide");
        } else if (serialBuffer == "sdcard" || serialBuffer == "sd") {
          Serial.println("[SERIAL] Reinitialisation de la carte SD...");
          if (initSDCard()) {
            Serial.println("[SERIAL] Carte SD initialisee avec succes !");
          } else {
            Serial.println("[SERIAL] Echec de l'initialisation de la carte SD");
          }
        } else if (serialBuffer == "nfc read" || serialBuffer == "nfc-read") {
          Serial.println("[SERIAL] Lecture d'un tag NFC...");
          Serial.println("[SERIAL] Approchez un tag NFC du lecteur...");
          
          if (!isNFCAvailable()) {
            Serial.println("[SERIAL] ERREUR: Module NFC non disponible");
          } else {
            // Attendre jusqu'à 5 secondes pour détecter un tag
            bool tagDetected = false;
            unsigned long startTime = millis();
            const unsigned long timeout = 5000; // 5 secondes
            
            while (millis() - startTime < timeout && !tagDetected) {
              NFCTagData tagData;
              if (readNFCTag(tagData)) {
                tagDetected = true;
                Serial.print("[SERIAL] Tag detecte ! UID: ");
                Serial.println(tagData.uidString);
                Serial.print("[SERIAL] Longueur UID: ");
                Serial.print(tagData.uidLength);
                Serial.println(" bytes");
                Serial.print("[SERIAL] UID (bytes): ");
                for (uint8_t i = 0; i < tagData.uidLength; i++) {
                  if (i > 0) Serial.print(" ");
                  Serial.print("0x");
                  if (tagData.uid[i] < 0x10) Serial.print("0");
                  Serial.print(tagData.uid[i], HEX);
                }
                Serial.println();
              }
              delay(100);
            }
            
            if (!tagDetected) {
              Serial.println("[SERIAL] Aucun tag detecte dans les 5 secondes");
            }
          }
        } else if (serialBuffer == "nfc write" || serialBuffer == "nfc-write" || serialBuffer == "nfc test" || serialBuffer == "nfc-test") {
          Serial.println("[SERIAL] Ecriture d'un tag NFC de test...");
          Serial.println("[SERIAL] Approchez un tag NFC inscriptible du lecteur...");
          
          if (!isNFCAvailable()) {
            Serial.println("[SERIAL] ERREUR: Module NFC non disponible");
          } else {
            // Préparer des données de test
            NFCWriteData writeData;
            writeData.blockNumber = 4; // Bloc 4 (éviter les blocs de secteur 0 qui sont protégés)
            writeData.dataLength = 16;
            
            // Remplir avec des données de test
            // "KIDOO TEST TAG" + padding
            const char* testData = "KIDOO TEST TAG";
            for (uint8_t i = 0; i < 14; i++) {
              writeData.data[i] = testData[i];
            }
            writeData.data[14] = 0x00;
            writeData.data[15] = 0x00;
            
            Serial.print("[SERIAL] Donnees de test: \"");
            Serial.print(testData);
            Serial.println("\"");
            Serial.print("[SERIAL] Bloc cible: ");
            Serial.println(writeData.blockNumber);
            
            // Attendre jusqu'à 5 secondes pour détecter un tag
            bool tagWritten = false;
            unsigned long startTime = millis();
            const unsigned long timeout = 5000; // 5 secondes
            
            while (millis() - startTime < timeout && !tagWritten) {
              NFCTagData tagData;
              if (writeNFCTag(writeData, tagData)) {
                tagWritten = true;
                Serial.println("[SERIAL] Tag ecrit avec succes !");
                Serial.print("[SERIAL] UID du tag: ");
                Serial.println(tagData.uidString);
              }
              delay(100);
            }
            
            if (!tagWritten) {
              Serial.println("[SERIAL] Aucun tag detecte ou erreur d'ecriture dans les 5 secondes");
            }
          }
        } else {
          Serial.print("[SERIAL] Commande inconnue: ");
          Serial.println(serialBuffer);
          Serial.println("[SERIAL] Tapez 'help' pour voir les commandes disponibles");
        }
        
        serialBuffer = "";
      }
    } else {
      // Ajouter le caractère au buffer
      serialBuffer += c;
      
      // Limiter la taille du buffer pour éviter les débordements
      if (serialBuffer.length() > 100) {
        serialBuffer = "";
        Serial.println("[SERIAL] Buffer trop long, ignore");
      }
    }
  }
}

// Callback pour les événements NFC
void onNFCEvent(const NFCEvent& event) {
  switch (event.type) {
    case NFC_EVENT_TAG_PLACED:
      Serial.println("[NFC EVENT] Tag pose - Action a implementer");
      // TODO: Implémenter l'action quand un tag est posé
      // Exemple: jouer la musique associée au tag
      break;
      
    case NFC_EVENT_TAG_REMOVED:
      Serial.println("[NFC EVENT] Tag retire - Action a implementer");
      // TODO: Implémenter l'action quand un tag est retiré
      // Exemple: arrêter la musique
      break;
      
    case NFC_EVENT_TAG_CHANGED:
      Serial.println("[NFC EVENT] Tag change - Action a implementer");
      // TODO: Implémenter l'action quand un tag change
      // Exemple: arrêter l'ancien, démarrer le nouveau
      break;
  }
}

void loop() {
  static int lastClientCount = 0;
  static bool lastBluetoothState = false;
  static bool lastWifiState = false;
  static bool nfcDetectionStarted = false;
  
  // Démarrer la détection NFC une seule fois (si le module est disponible)
  if (!nfcDetectionStarted && isNFCAvailable()) {
    startNFCDetection(onNFCEvent);
    nfcDetectionStarted = true;
  }
  
  // Traiter les commandes série
  processSerialCommands();
  
  // Traiter les commandes BLE (configuration WiFi, etc.)
  processBLECommands();
  
  // Mettre à jour la détection NFC
  updateNFCDetection();
  
  // Mettre à jour l'état WiFi
  updateWiFiState();
  
  // Mettre à jour l'état BLE
  updateBLEState();
  
  // Mettre à jour le timer de sommeil
  StateManager::updateSleepTimer();
  
  // Vérifier les changements d'état pour le logging
  bool wifiConnected = StateManager::isWiFiConnected();
  bool bluetoothConnected = StateManager::isBLEConnected();
  int connectedClients = StateManager::getWiFiAPClients();
  
  // Si l'état WiFi domestique a changé, logger l'événement
  if (wifiConnected != lastWifiState) {
    if (wifiConnected) {
      Serial.println("[WIFI] Connecte au reseau domestique !");
      Serial.print("[WIFI] Adresse IP: ");
      Serial.println(getStationIP());
      Serial.print("[WIFI] SSID: ");
      Serial.println(getConnectedSSID());
    } else {
      Serial.println("[WIFI] Deconnecte du reseau domestique");
    }
    lastWifiState = wifiConnected;
  }
  
  // Si le nombre de clients WiFi AP a changé, logger l'événement
  if (connectedClients != lastClientCount) {
    if (connectedClients > 0) {
      Serial.print("[WIFI AP] Client connecte ! Nombre de clients: ");
      Serial.println(connectedClients);
    } else {
      Serial.println("[WIFI AP] Aucun client connecte");
    }
    lastClientCount = connectedClients;
  }
  
  // Si l'état Bluetooth a changé, logger l'événement
  if (bluetoothConnected != lastBluetoothState) {
    if (bluetoothConnected) {
      Serial.println("[BLUETOOTH] Client connecte !");
    } else {
      Serial.println("[BLUETOOTH] Client deconnecte");
    }
    lastBluetoothState = bluetoothConnected;
  }
  
  // Les LEDs sont maintenant gérées par la tâche FreeRTOS dédiée (ledTask)
  // On ne fait plus rien ici pour les LEDs, elles tournent en continu dans leur propre tâche
  
  // On peut toujours vérifier les changements de mode pour le logging
  Mode newMode = ModeManager::determineMode();
  
  // Vérifier si le mode a changé (pour le logging uniquement)
  // Initialiser avec le mode actuel de StateManager pour éviter les faux changements au démarrage
  static bool firstRun = true;
  static Mode lastLoggedMode = MODE_RED;
  if (firstRun) {
    lastLoggedMode = StateManager::getCurrentMode();
    firstRun = false;
  }
  
  if (newMode != lastLoggedMode) {
    Mode previousMode = lastLoggedMode;
    Serial.print("[MODE] Changement de mode: ");
    Serial.print(StateManager::getModeName(previousMode));
    Serial.print(" -> ");
    Serial.println(StateManager::getModeName(newMode));
    
    // Réinitialiser l'effet de transition si on entre dans le mode transition
    if (newMode == MODE_SLEEP_TRANSITION && previousMode != MODE_SLEEP_TRANSITION) {
      resetSleepTransition();
    }
    
    lastLoggedMode = newMode;
  }
  
  // Mettre à jour le mode dans StateManager (utilisé par la tâche LED)
  StateManager::setMode(newMode);
  
  // Petite pause pour permettre aux autres tâches de s'exécuter
  delay(10);
}
