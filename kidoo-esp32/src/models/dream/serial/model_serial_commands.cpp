#include "model_serial_commands.h"
#include "../../model_config.h"
#include "../managers/bedtime/bedtime_manager.h"
#include "../managers/wakeup/wakeup_manager.h"
#include <Arduino.h>

/**
 * Commandes Serial spécifiques au modèle Kidoo Dream
 */

bool ModelDreamSerialCommands::processCommand(const String& command) {
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
  
  // Traiter les commandes spécifiques au Dream
  if (cmd == "dream-info") {
    Serial.println("[DREAM] Informations specifiques au modele Dream");
    Serial.println("[DREAM] Nombre de LEDs: 40");
    Serial.println("[DREAM] Modele: Kidoo Dream");
    Serial.println("[DREAM] NFC: Non disponible");
    return true;
  }
  else if (cmd == "bedtime-show" || cmd == "show-bedtime") {
    BedtimeConfig config = BedtimeManager::getConfig();
    
    Serial.println("");
    Serial.println("========================================");
    Serial.println("  CONFIGURATION BEDTIME (COUCHER)");
    Serial.println("========================================");
    Serial.printf("Couleur: RGB(%d, %d, %d)\n", config.colorR, config.colorG, config.colorB);
    Serial.printf("Luminosite: %d%%\n", config.brightness);
    Serial.printf("Allume toute la nuit: %s\n", config.allNight ? "Oui" : "Non");
    Serial.println("");
    Serial.println("Horaires par jour:");
    
    const char* weekdays[] = {"Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"};
    bool hasAnySchedule = false;
    
    for (int i = 0; i < 7; i++) {
      if (config.schedules[i].activated) {
        Serial.printf("  %s: %02d:%02d (Active)\n", 
                     weekdays[i], 
                     config.schedules[i].hour, 
                     config.schedules[i].minute);
        hasAnySchedule = true;
      } else {
        Serial.printf("  %s: %02d:%02d (Inactif)\n", 
                     weekdays[i], 
                     config.schedules[i].hour, 
                     config.schedules[i].minute);
      }
    }
    
    if (!hasAnySchedule) {
      Serial.println("  Aucun horaire active");
    }
    
    Serial.printf("Bedtime actif: %s\n", BedtimeManager::isBedtimeActive() ? "Oui" : "Non");
    Serial.println("========================================");
    Serial.println("");
    
    return true;
  }
  else if (cmd == "wakeup-show" || cmd == "show-wakeup") {
    WakeupConfig config = WakeupManager::getConfig();
    
    Serial.println("");
    Serial.println("========================================");
    Serial.println("  CONFIGURATION WAKEUP (REVEIL)");
    Serial.println("========================================");
    Serial.printf("Couleur: RGB(%d, %d, %d)\n", config.colorR, config.colorG, config.colorB);
    Serial.printf("Luminosite: %d%%\n", config.brightness);
    Serial.println("");
    Serial.println("Horaires par jour:");
    Serial.println("(Le reveil commence 15 minutes avant l'heure indiquee)");
    
    const char* weekdays[] = {"Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"};
    bool hasAnySchedule = false;
    
    for (int i = 0; i < 7; i++) {
      if (config.schedules[i].activated) {
        // Calculer l'heure de début (15 minutes avant)
        uint8_t startHour = config.schedules[i].hour;
        uint8_t startMinute = config.schedules[i].minute;
        
        if (startMinute >= 15) {
          startMinute -= 15;
        } else {
          startMinute += 45;
          if (startHour > 0) {
            startHour--;
          } else {
            startHour = 23;
          }
        }
        
        Serial.printf("  %s: %02d:%02d (Active - demarre a %02d:%02d)\n", 
                     weekdays[i], 
                     config.schedules[i].hour, 
                     config.schedules[i].minute,
                     startHour,
                     startMinute);
        hasAnySchedule = true;
      } else {
        Serial.printf("  %s: %02d:%02d (Inactif)\n", 
                     weekdays[i], 
                     config.schedules[i].hour, 
                     config.schedules[i].minute);
      }
    }
    
    if (!hasAnySchedule) {
      Serial.println("  Aucun horaire active");
    }
    
    Serial.printf("Wakeup actif: %s\n", WakeupManager::isWakeupActive() ? "Oui" : "Non");
    Serial.println("========================================");
    Serial.println("");
    
    return true;
  }
  
  return false; // Commande non reconnue
}

void ModelDreamSerialCommands::printHelp() {
  Serial.println("");
  Serial.println("========================================");
  Serial.println("  COMMANDES SPECIFIQUES DREAM");
  Serial.println("========================================");
  Serial.println("  dream-info         - Afficher les infos du modele Dream");
  Serial.println("  bedtime-show       - Afficher la configuration bedtime (coucher)");
  Serial.println("  wakeup-show        - Afficher la configuration wakeup (reveil)");
  Serial.println("========================================");
  Serial.println("");
}
